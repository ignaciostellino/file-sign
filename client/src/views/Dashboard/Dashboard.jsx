import React, {useEffect} from "react";
import { Link } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";
import moment from 'moment';

// COMPONENTS
import Header from "../../components/Header";
import DashboardLogic from './DashboardLogic';

const Dashboard = () => {
  const {
    files,
    getData
  } = DashboardLogic();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div className="container-app">
      <Header/>
      <Row className="main-container">
        <Col sm={8} className="mx-auto">
          <div id="accordion">
            {files?.map((element, index)=>(
              <div className="card" key={index}>
                <div className="card-header super-center" id={`heading${index}`} style={{justifyContent: 'space-between'}}>
                  <span className="mb-0">
                    <button className="btn btn-link" data-toggle="collapse" data-target={`#collapse${index}`}  aria-expanded="false" aria-controls={`collapse${index}`}>
                      {element.name}
                    </button>
                  </span>
                  <span className="mb-0">
                    {moment(element.validFrom*1000).format('DD/MM/YY')} - {moment(element.validTo*1000).format('DD/MM/YY')}
                  </span>
                </div>

                <div id={`collapse${index}`} className="collapse " aria-labelledby={`heading${index}`} data-parent="#accordion">
                  <div className="card-body font-weight-bold">
                    <p>Empresa: {element.owner} - {element.ownerAddress}</p>
                    <p>Promocion: {element.name}</p>
                    <p>Validez: {moment(element.validFrom*1000).format('DD/MM/YY')} - {moment(element.validTo*1000).format('DD/MM/YY')}</p>
                    <p>Hash documento: {element.fileHash}</p>
                    <p>Fecha almacenado: {moment(element.timestamp*1000).format('DD/MM/YY')}</p>
                    <p><a href={element.blockInfo}>Enlace Explorador Bloques</a></p>
                    <p><a href={element.ipfsFile}>Enlace archivo IPFS</a></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;