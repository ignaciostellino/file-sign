import { useState, useContext } from "react";
import { Web3Context } from "../../web3";
import Swal from "sweetalert2";

const AskLogic = () => {
  const { account, requestVerification } = useContext(Web3Context);
  const [name, setName] = useState("");

  const makeAsk = async () => {
    if(account){
      if(name === "" ){
        Swal.fire(
          'Empty field',
          '',
          'error'
        )
        return;
      }

      let resp = await requestVerification(name)
      console.log(`resp`, resp)
    }else{
      console.log("connect your wallet")
    }
  };

  return {
    name,
    setName,
    makeAsk
  }
}

export default AskLogic;