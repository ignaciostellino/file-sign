import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Routes from "./Routes";

import { Web3Provider } from "./web3";

ReactDOM.render(
  <Web3Provider>
    <Routes />
  </Web3Provider>,
  document.getElementById("root")
);