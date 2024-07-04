
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import AdminConductores from "./Conductores/adminConductores";
import AdminVehiculos from "./Vehiculos/adminVehiculos";
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const Admin = () => {
    const [componenteActual, setComponenteActual] = useState(null);
    const cargarComponente1 = () => {
        setComponenteActual('Componente1');
    };
    const cargarComponente2 = () => {
        setComponenteActual('Componente2');
    };
    return (<>
        <Container fluid="md">
            <Row className="d-flex justify-content-between mb-3" xs={12}>
                <Col xs={6} className="d-flex justify-content-center align-items-center">
                    <Button variant="dark" size="mg"  onClick={cargarComponente1}>Administracion de Conductores</Button>
                </Col>
                <Col xs={6} className="d-flex justify-content-center align-items-center">
                    <Button variant="dark" size="mg"  onClick={cargarComponente2}>Administracion de Vehiculos</Button>
                </Col>
            </Row>
        </Container>
        <Container fluid="md">
            {componenteActual === 'Componente1' && <AdminConductores />}
            {componenteActual === 'Componente2' && <AdminVehiculos />}
        </Container>
    </>);
}

export default Admin;