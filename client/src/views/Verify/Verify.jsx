import React, {useEffect} from "react";
import { Link } from 'react-router-dom';
import { Row, Col, Form } from "react-bootstrap";
import Dropzone from "react-dropzone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// COMPONENTS
import Header from "../../components/Header";
import VerifyLogic from './VerifyLogic';

const Verify = () => {
  const {
    file,
    fileName,
    onDropDoc,
    verify
  } = VerifyLogic();
  
  return (
    <div className="container-app">
      <Header/>
      <Row className="main-container">
        <Col sm={5} className="mx-auto my-5 p-0 text-center" style={{backgroundColor: '#F8F9FA', border: '1px solid grey', borderRadius: "4px", height: 'fit-content'}}>
          <Dropzone onDrop={acceptedFiles => onDropDoc(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <Row className="super-center" style={{height: '20vh', width: '90%', margin: '5%', backgroundColor: 'white', border: '1px dashed grey', cursor: 'pointer', borderRadius: "4px"}} {...getRootProps()}>
                <input {...getInputProps()} />
                {!file && (
                  <>
                    <Col sm={12} className="super-center">
                      {window.innerWidth < 768 ? "Touch for upload file":"Drag & Drop your file"}
                    </Col>
                  </>
                )}
                {fileName}
              </Row>
            )}
          </Dropzone>
          <button className="mx-auto" onClick={verify}>Verify</button>
        </Col>
      </Row>
    </div>
  );
}

export default Verify;