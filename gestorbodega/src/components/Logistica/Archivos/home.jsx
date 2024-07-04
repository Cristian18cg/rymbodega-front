import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Registrarconductor from "./Conductores/registrarConductor";
import RegistrarVehiculo from "./Vehiculos/registrarVehiculo"
import Admin from "./Admin";
import AdminConductores from "./Conductores/adminConductores";
import AdminVehiculos from "./Vehiculos/adminVehiculos";


const Home = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeComponent, setActiveComponent] = useState();
    const handleButtonClick = (componentName) => {
        setActiveComponent(componentName);
    };

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'conductor':
                return <AdminConductores />;
            case 'vehiculo':
                return <AdminVehiculos />;
            default:
                return null;
        }
    };



    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="justify-content-between col-12 container-fluid ">
            <Container>
                <Row>
                    <Col xs={12} className="d-flex justify-content-center">
                        <button className="btn" onClick={toggleVisibility}>
                            MENU
                            <i className="bi bi-list ml-2"></i>
                        </button>
                    </Col>
                </Row>
            </Container>
            {isVisible && (
                <Container fluid="md">
                    <Row className="d-flex justify-content-between  mb-3" xs={12}>
                        <Col xs={6} className="d-flex justify-content-center align-items-center">
                            <Button onClick={() => handleButtonClick('conductor')} variant="dark" size="mg">Administrar Conductores</Button>
                        </Col>
                        <Col xs={6} className="d-flex justify-content-center align-items-center">
                            <Button onClick={() => handleButtonClick('vehiculo')} variant="dark" size="mg">Administrar Vehiculo</Button>
                        </Col>
                    </Row>
                </Container>
            )}
            <Col>
                
                {renderActiveComponent()}
            </Col>
        </div>
    );
}

export default Home;