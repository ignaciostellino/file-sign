import React, {useEffect} from "react";
import { Link } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";
import moment from 'moment';

// COMPONENTS
import Header from "../../components/Header";
import VerificationsLogic from './VerificationsLogic';

const Verifications = () => {
  const {
    requests,
    getData,
    makeVerification, 
    unmakeVerification
  } = VerificationsLogic();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div className="container-app">
      <Header/>
      <Row className="main-container">
        <Col sm={8} className="mx-auto">
            {requests?.map((element, index)=>(
             <Row key={index}>
               <Col>
                <p>{element.name}</p>
               </Col>
               <Col>
                <p>{element.account}</p>
               </Col>
               <Col>
               <p>{moment(element.timestamp*1000).format('DD/MM/YY')}</p>
               </Col>
               <Col>
               <p>Verified: {element.valid ? 'Si' : 'No'}</p>
               </Col>
               <Col>
                <button onClick={ element.value ? ()=>makeVerification(element.account) : ()=>unmakeVerification(element.account) }>{ !element.value ? "Verify" : "Unverify"}</button>
               </Col>
             </Row>
            ))}
        </Col>
      </Row>
    </div>
  );
}

export default Verifications;