import { useState, useEffect, useContext } from "react";
import { Web3Context } from "../../web3";

const VerificationsLogic = () => {
  const { account, verificate, unverificate, getVerifications } = useContext(Web3Context);

  const [requests, setRequests] = useState([])

  const getData = async () => {
    setRequests(await getVerifications())
  }

  const makeVerification = async (address) => {
    console.log(`address`, address)
    let tx = await verificate(address);
    console.log(`tx`, tx)
  }

  const unmakeVerification = async (address) => {
    console.log(`address`, address)
  }

  useEffect(() => {
    getData();
  }, [account])

  return {
    requests,
    getData,
    makeVerification, 
    unmakeVerification
  }
}

export default VerificationsLogic;