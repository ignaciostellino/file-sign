import { useState, useContext } from "react";
import { Web3Context } from "../../web3";
import ipfs from "../../utils/ipfs";
import Swal from "sweetalert2";
import moment from 'moment';

const VerifyLogic = () => {
  const { account, getInformation } = useContext(Web3Context);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);

  const onDropDoc = files => {
    if (files.length === 1) {
      setFileName(files[0].name)
      var reader = new FileReader();
      reader.readAsArrayBuffer(files[0]);
      reader.onloadend = () => {
        setFile(Buffer(reader.result));
      };
    }
  }

  const addToIpfs = async (content) => {
    console.log("adding to IPFS...");
    const added = await ipfs.add(content, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    return added.cid.toString();
  };

  const verify = async () => {
    if(account){
      if(!file){
        Swal.fire(
          'Empty field',
          '',
          'error'
        )
        return;
      }
      try {
        const ipfsHash = await addToIpfs(file);
        let resp = await getInformation(ipfsHash)
        console.log(`resp`, resp)
        Swal.fire({
          title:'Este documento está registrado en la blockchain',
          html:`por ${resp.owner}, ${moment(resp.timestamp*1000).format('DD/MM/YY')} <br/> <a href="${resp.blockInfo}">enlace</a>`,
          icon:'success'
        })
        return;
      } catch (error) {
        if(error.message.includes("execution reverted: File not found")){
          Swal.fire(
            'Este documento no está registrado en la blockchain',
            '',
            'error'
          )
          return;
        }else{
          Swal.fire(
            'Error desconocido',
            '',
            'error'
          )
          return;
        }
      }
    }else{
      console.log("connect your wallet")
    }
  };

  return {
    file,
    fileName,
    onDropDoc,
    verify
  }
}

export default VerifyLogic;