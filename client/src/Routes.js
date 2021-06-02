import React, { useState, useEffect, useContext} from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Ask from "./views/Ask/Ask.jsx";
import Dashboard from "./views/Dashboard/Dashboard.jsx";
import Upload from "./views/Upload/Upload.jsx";
import Verifications from "./views/Verifications/Verifications.jsx";
import Verify from "./views/Verify/Verify.jsx";
import { Web3Context } from "./web3";

const Routes = () => {
  const { account, isOwner, verifiedUser } = useContext(Web3Context);

  const [auth, setAuth] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    isOwner().then(resp => {
      setAuth(resp)
    });
    verifiedUser().then(resp => {
      setVerified(resp)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <>
      <BrowserRouter>
        <Switch> 
          {(auth || verified) && <Route exact path="/upload" component={Upload}/>}
          {(auth) && <Route exact path="/verifications" component={Verifications}/>}
          {(!verified) && <Route exact path="/ask" component={Ask}/>}
          <Route exact path="/verify" component={Verify}/>
          <Route exact path="/" component={Dashboard}/>
          
          <Route exact component={Dashboard}/>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default Routes;
