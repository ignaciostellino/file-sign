import React, { useReducer, useCallback, createContext, useEffect } from "react";

import { Web3Reducer } from "./reducer";

// WEB3 CONNECTION PACKAGES
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";

import Signer from '../utils/abi/Signer.json';
import {CONTRACT_ADDRESS, CURRENT_NETWORK, DEPLOY_BLOCK} from './constants';

let web3 = null;

const initialState = {
  loading: true,
  connected: false,
  account: null,
  contracts: {},
  networkId: null,
  chainId: null,
};

export const Web3Context = createContext(initialState);

export const Web3Provider = ({ children }) => {
  const [state, dispatch] = useReducer(Web3Reducer, initialState);

  const setAccount = (account) => {
    dispatch({
      type: "SET_ACCOUNT",
      payload: account,
    });
  };

  const setNetworkId = (networkId) => {
    dispatch({
      type: "SET_NETWORK_ID",
      payload: networkId,
    });
  };

  const setContracts = (contracts) => {
    dispatch({
      type: "SET_CONTRACTS",
      payload: contracts,
    });
  };

  const logout = () => {
    setAccount(null);
    localStorage.setItem("defaultWallet", null);
  };

  const connectWeb3 = useCallback(async () => {
    // Web3 Modal
    let host;
    let network;
    if(CURRENT_NETWORK === 'Rinkeby'){
      host = "https://rinkeby.infura.io/v3/203d5c0b362148819014f26057fb0d90";
      network = "rinkeby";
    }else{
      host = "https://mainnet.infura.io/v3/203d5c0b362148819014f26057fb0d90";
      network = "mainnet";
    }

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "203d5c0b362148819014f26057fb0d90", // required
        },
      },
      torus: {
        package: Torus, // required
        options: {
          networkParams: {
            host, // optional
            networkId: 1, // optional
          },
          config: {
            buildEnv: "production", // optional
          },
        },
      },
      authereum: {
        package: Authereum,
      },
    };

    try {
      const web3Modal = new Web3Modal({
        network,
        cacheProvider: true, // optional
        providerOptions, // required
        theme: "light",
      });
      const provider = await web3Modal.connect();

      web3 = new Web3(provider);
      window.web3 = web3;

      const signer = new web3.eth.Contract(Signer.abi, CONTRACT_ADDRESS);
      setContracts({...state.contracts, signer});
      window.signer = signer;

      const networkId = await web3.givenProvider.networkVersion;
      setNetworkId(networkId);
      
      const acc = await web3.eth.getAccounts();
      setAccount(acc[0]);
      console.log("Connected Account: ", acc[0]);

    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWeb3Lite = useCallback(async () => {
    // Web3 Modal
    let host;
    if(CURRENT_NETWORK === 'Rinkeby'){
      host = "https://rinkeby.infura.io/v3/203d5c0b362148819014f26057fb0d90";
    }else{
      host = "https://mainnet.infura.io/v3/203d5c0b362148819014f26057fb0d90";
    }

    try {

      web3 = new Web3(host);
      window.web3 = web3;

      const signer = new web3.eth.Contract(Signer.abi, CONTRACT_ADDRESS);
      setContracts({...state.contracts, signer});
      window.signer = signer;
      const networkId = await web3.givenProvider.networkVersion;
      setNetworkId(networkId);

    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOwner = async () => {
    if(state.account){
      return await state.contracts.signer.methods.owner().call() === state.account;
    }
  }

  const getInformation = async (hash) => {
    if(state.account){
      let allEvents = await state.contracts.signer.getPastEvents('createFile', {fromBlock: DEPLOY_BLOCK, toBlock: 'latest'})
      for (const event of allEvents) {
        let file = event.returnValues;
        if(file.fileHash === hash){
          let resp = await state.contracts.signer.methods.getInformation(hash).call();
          let owner = await state.contracts.signer.methods.getOwnerInformation(resp["0"]).call()
          let data = {}

          if(CURRENT_NETWORK === 'BSC_Testnet'){
            data.blockInfo = "https://testnet.bscscan.com/tx/"+event.transactionHash;
          }
          if(CURRENT_NETWORK === 'BSC'){
            data.blockInfo = "https://bscscan.com/tx/"+event.transactionHash;
          }
          if(CURRENT_NETWORK === 'Rinkeby'){
            data.blockInfo = "https://rinkeby.etherscan.io/tx/"+event.transactionHash;
          }
          if(CURRENT_NETWORK === 'Mainnet'){
            data.blockInfo = "https://etherscan.io/tx/"+event.transactionHash;
          }
          
          data.validFrom = resp["3"];
          data.timestamp = resp["5"];
          data.owner = owner["1"];
          data.ownerAddress = owner["0"];
          data.name = resp["1"];
          data.ipfsFile = "https://ipfs.io/ipfs/"+hash;
          return data;
        }
      }
    } 
  }

  const verifiedUser = async () => {
    if(state.account){
      let x = await state.contracts.signer.methods.getOwnerInformation(state.account).call();
      return x[2];
    } 
  }

  const uploadFile = async (promotion, fileHash, validFrom, validTo) => {
    if(state.account){
      return await state.contracts.signer.methods.uploadFile(promotion, fileHash, validFrom, validTo).send({from: state.account});
    } 
  }

  const requestVerification = async (companyName) => {
    if(state.account){
      return await state.contracts.signer.methods.requestVerification(companyName).send({from: state.account});
    } 
  }

  const getVerifications = async () => {
    if(await isOwner() && state.account){
      let allRequest = []
      let allEvents = await state.contracts.signer.getPastEvents('userVerificationRequest', {fromBlock: DEPLOY_BLOCK, toBlock: 'latest'})
      for (const element of allEvents) {
        let event = element.returnValues
        let resp = await state.contracts.signer.methods.getOwnerInformation(event.owner).call();
        let data = {
          name:resp["1"],
          valid:resp["2"],
          account:resp["0"],
          timestamp:event.timestamp
        }
        allRequest.push(data)
      }
      return allRequest;
    } 
  }

  const verificate = async (address) => {
    console.log("llega")
    console.log(`address`, address)
    if(await isOwner() && state.account){
      const tx = await state.contracts.signer.methods.verify(address).send({from: state.account});
      console.log(`tx`, tx)
      return tx;
    } 
  }

  const unverificate = async (address) => {
    if(await isOwner() && state.account){
      const tx = await state.contracts.signer.methods.unverify(address).send({from: state.account});
      console.log(`tx`, tx)
      return tx;
    } 
  }

  const getAllFiles = async () => {
    if(state.contracts.signer && state.account){
      let allFiles = [];
      let allEvents = await state.contracts.signer.getPastEvents('createFile', {fromBlock: DEPLOY_BLOCK, toBlock: 'latest'})
      for (const event of allEvents) {
        let file = event.returnValues;
        if(file.validTo * 1000 >= Date.now()){
          let resp = await getInformation(file.fileHash)
          let owner = await state.contracts.signer.methods.getOwnerInformation(resp.ownerAddress).call()
          if(CURRENT_NETWORK === 'BSC_Testnet'){
            file.blockInfo = "https://testnet.bscscan.com/tx/"+event.transactionHash;
          }
          if(CURRENT_NETWORK === 'BSC'){
            file.blockInfo = "https://bscscan.com/tx/"+event.transactionHash;
          }
          if(CURRENT_NETWORK === 'Rinkeby'){
            file.blockInfo = "https://rinkeby.etherscan.io/tx/"+event.transactionHash;
          }
          if(CURRENT_NETWORK === 'Mainnet'){
            file.blockInfo = "https://etherscan.io/tx/"+event.transactionHash;
          }
          
          file.validFrom = resp.validFrom;
          file.timestamp = resp.timestamp;
          file.owner = owner["1"];
          file.ownerAddress = owner["0"];
          file.name = resp.name;
          file.ipfsFile = "https://ipfs.io/ipfs/"+file.fileHash;
          allFiles.push(file);
        }
      }
      return allFiles;
    }
  }

  const transferOwnership = async (address) => {
    if(await isOwner() && state.account){
      await state.contracts.signer.methods.transferOwner(address).send({from: state.account});
    } 
  }

  useEffect(() => {
    if(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")){
      connectWeb3();
    }else{
      connectWeb3Lite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Web3Context.Provider
      value={{
        ...state,
        web3,
        connectWeb3,
        logout,
        isOwner,
        getInformation,
        uploadFile,
        requestVerification,
        verificate,
        unverificate,
        getAllFiles,
        transferOwnership,
        verifiedUser,
        getVerifications
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
