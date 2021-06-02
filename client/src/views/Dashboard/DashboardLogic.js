import { useState, useEffect, useContext } from "react";
import { Web3Context } from "../../web3";

const DashboardLogic = () => {
  const { account, getAllFiles } = useContext(Web3Context);

  const [files, setFiles] = useState([])

  const getData = async () => {
    setFiles(await getAllFiles())
  }

  useEffect(() => {
    getData();
  }, [account])

  return {
    files,
    getData
  }
}

export default DashboardLogic;