import React, { useState, useEffect, useContext }  from "react";
import { Row, Col, Modal, Form, Spinner } from "react-bootstrap";
import { Link } from 'react-router-dom';
import search from '../assets/search.svg';
import logo from '../assets/logo.png';
import logoW from '../assets/logo-white.png';
import Swal from 'sweetalert2'
import { Web3Context } from "../web3";

export default function Header(props) {
  const { connectWeb3, account, logout, isOwner, verifiedUser } = useContext(Web3Context);

  const [auth, setAuth] = useState(false);
  const [owner, setOwner] = useState("");
  const [add, setAdd] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showResponsiveMenu, setShowResponsiveMenu] = useState(false);
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
      <Row className="header-container mx-0">
        <Col sm={2} className="super-center">
          <Link to="/">
            HOME
          </Link>
        </Col>
        <Col sm={5} className="super-center" style={{justifyContent: 'flex-start'}}>
        </Col>
        <Col sm={5} className="super-center" style={{justifyContent: 'flex-end'}}>
          <Link to="/verify" className="mx-2">
            Verify
          </Link>
          {(!verified) && <>
            <Link to="/ask" className="mx-2">
              Ask for verification
            </Link>
          </>}
          {(auth || verified) && <>
            <Link to="/upload" className="mx-2">
              Upload
            </Link>
          </>}
          {auth && <>
            <Link to="/verifications" className="mx-2">
              Verifications
            </Link>
          </>}
          <div className="p-0 mx-3">
            {account ? 
              <button className="platform-button" onClick={logout}>Logout</button>
            :
              <button className="platform-button" onClick={connectWeb3}>Sign in</button>
            }
          </div>
        </Col>
      </Row>
    </>
  );
}
