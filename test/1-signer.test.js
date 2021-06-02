const Signer = artifacts.require("Signer");

const {
  BN,
  time,
  expectEvent,
  expectRevert,
  constants: { ZERO_ADDRESS },
} = require("@openzeppelin/test-helpers");

const { expect } = require("chai");
require("chai").use(require("chai-bn")(BN));

const toWei = (value) => web3.utils.toWei(String(value));
const toBN = (value) => web3.utils.toBN(String(value));

contract("Platform", ([owner, alice, bob, random]) => {
  let signer;

  before(async () => {
    signer = await Signer.new();
  });
  
  it("Should not post without verification", async () => {
    await expectRevert(
      signer.uploadFile("new promotions", "hash123", time.duration.days(20), time.duration.days(30), {from: alice}),
      "Not a verified user"
    )
  })

  it("Should not verify an account if not owner", async () => {
    await expectRevert(
      signer.verify(alice, {from: alice}),
      "Ownable: caller is not the owner"
    )
  })

  it("Should request a verification", async () => {
    let tx = await signer.requestVerification("my name is alice", {from: alice});
    expectEvent(tx, "userVerificationRequest", {
      owner: alice,
      timestamp: toBN(await time.latest()),
    });
  })

  it("Should verify an account", async () => {
    let tx = await signer.verify(alice, {from: owner});
    expectEvent(tx, "userVerification", {
      owner: alice,
      timestamp: toBN(await time.latest()),
    });
  })
  
  it("Should upload a file", async () => {
    let tx = await signer.uploadFile("new promotions", "hash123", time.duration.days(20), time.duration.days(30), {from: alice});
    expectEvent(tx, "createFile", {
      owner: alice,
      fileHash: "hash123",
      validTo: toBN(time.duration.days(30)),
    });
  })
  
  it("Should get the file information", async () => {
    let tx = await signer.getInformation("hash123", {from: bob});

    expect(tx[0]).to.equal(alice);
    expect(tx[1]).to.equal("new promotions");
    expect(tx[2]).to.equal("hash123");
    expect(tx[3]).to.be.bignumber.equal(time.duration.days(20));
    expect(tx[4]).to.be.bignumber.equal(time.duration.days(30));
  })

  it("Should not verify an account if not request", async () => {
    await expectRevert(
      signer.verify(bob, {from: owner}),
      "user have not requested"
    )
  })

});
