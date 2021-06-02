import React, {useEffect} from "react";
import { Link } from 'react-router-dom';
import { Row, Col, Form } from "react-bootstrap";
import Dropzone from "react-dropzone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// COMPONENTS
import Header from "../../components/Header";
import UploadLogic from './UploadLogic';

const Upload = () => {
  const {
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
  } = UploadLogic();
  
  return (
    <div className="container-app">
      <Header/>
      <Row className="main-container">
        <Col sm={5} className="mx-auto text-center">
          <Form className="my-5">
            <Form.Group as={Row}>
              <Form.Label column sm="12">
                <span style={{fontSize: '1rem', fontWeight: 600, lineHeight: '1.5'}}>Promotion title</span>
              </Form.Label>
              <Col sm="12" className="align-self-center">
                <Form.Control
                  type="text"
                  value={name}
                  style={{backgroundColor: '#F8F9FA', height: '48px', borderRadius: '4px'}}
                  onChange={(e) => setName(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="6" style={{textAlign: 'center'}}>
                <span style={{fontSize: '1rem', fontWeight: 600, lineHeight: '1.5'}}>Start Date</span>
              </Form.Label>
              <Form.Label column sm="6" style={{textAlign: 'center'}}>
                <span style={{fontSize: '1rem', fontWeight: 600, lineHeight: '1.5'}}>End Date</span>
              </Form.Label>
              <Col sm="6" className="align-self-center" style={{textAlign: 'center'}}>
                <DatePicker className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} />
              </Col>
              <Col sm="6" className="align-self-center" style={{textAlign: 'center'}}>
                <DatePicker className="form-control" selected={endDate} onChange={(date) => setEndDate(date)} />
              </Col>
            </Form.Group>
          </Form>
          <button className="mx-auto" onClick={makeUpload}>Upload promotion</button>
        </Col>

        <Col sm={5} className="mx-auto my-5 p-0" style={{backgroundColor: '#F8F9FA', border: '1px solid grey', borderRadius: "4px", height: 'fit-content'}}>
          <Dropzone onDrop={acceptedFiles => onDropDoc(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <Row className="super-center" style={{height: '20vh', width: '90%', margin: '5%', backgroundColor: 'white', border: '1px dashed grey', cursor: 'pointer', borderRadius: "4px"}} {...getRootProps()}>
                <input {...getInputProps()} />
                {!file && (
                  <>
                    <Col sm={12} className="super-center mt-auto">
                    </Col>
                    <Col sm={12} className="super-center">
                      {window.innerWidth < 768 ? "Touch for upload file":"Drag & Drop your file"}
                    </Col>
                  </>
                )}
                {fileName}
              </Row>
            )}
          </Dropzone>
        </Col>
      </Row>
    </div>
  );
}

export default Upload;