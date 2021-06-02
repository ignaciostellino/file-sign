import React, {useEffect} from "react";
import { Link } from 'react-router-dom';
import { Row, Col, Form } from "react-bootstrap";
import Dropzone from "react-dropzone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// COMPONENTS
import Header from "../../components/Header";
import AskLogic from './AskLogic';

const Ask = () => {
  const {
    name,
    setName,
    makeAsk
  } = AskLogic();
  
  return (
    <div className="container-app">
      <Header/>
      <Row className="main-container">
        <Col sm={5} className="mx-auto text-center">
          <Form className="my-5">
            <Form.Group as={Row}>
              <Form.Label column sm="12">
                <span style={{fontSize: '1rem', fontWeight: 600, lineHeight: '1.5'}}>Business Name</span>
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
          </Form>
          <button className="mx-auto" onClick={makeAsk}>Request</button>
        </Col>
      </Row>
    </div>
  );
}

export default Ask;