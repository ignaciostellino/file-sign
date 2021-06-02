import { useState, useContext } from "react";
import { Web3Context } from "../../web3";
import ipfs from "../../utils/ipfs";
import Swal from "sweetalert2";

const UploadLogic = () => {
  const { account, uploadFile } = useContext(Web3Context);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const makeUpload = async () => {
    if(account){
      if(name === "" || !file || startDate === "" || endDate === ""){
        Swal.fire(
          'Empty field',
          '',
          'error'
        )
        return;
      }

      const ipfsHash = await addToIpfs(file);
      let resp = await uploadFile(name, ipfsHash, parseInt(new Date(startDate).getTime()/1000), parseInt(new Date(endDate).getTime()/1000))
      console.log(`resp`, resp)
    }else{
      console.log("connect your wallet")
    }
  };

  return {
    file,
    fileName,
    name,
    startDate,
    endDate,
    setName,
    onDropDoc,
    setStartDate,
    setEndDate,
    makeUpload
  }
}

export default UploadLogic;