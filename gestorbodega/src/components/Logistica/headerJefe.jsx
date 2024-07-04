import React from "react";
import useControl from "../../hooks/useControl";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import imagenn from "../../img/logon.webp";
import { Link } from "react-router-dom";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";

const HeaderJefe = () => {
    const { logout, usuario, jsonlogin } = useControl();

    const onClickLogout = () => {
        logout(jsonlogin.id); 
      };
  return (
    <div>
          <Navbar

            data-bs-theme="dark"
            expand="lg"
            className="justify-content-between col-12 nav-color"
          >
            <Container>
              <img
                src={imagenn}
                width="auto"
                alt=""
                height="80"
                className="d-inline-block align-top img-nav" 
              />
              <Navbar.Toggle aria-controls="basic-navbar-nav" />

              <Navbar.Collapse
                className="justify-content-end"
                id="basic-navbar-nav"
              >
                <div className="align-items-center  ">
                  <Button
                    icon="pi pi-bell"
                    className="p-button-rounded p-button-warning"
                    aria-label="Notification"
                  >
                    <Badge
                      value="5"
                      severity="secondary"
                      className="badge-notification icon-notification-logistica"
                    />
                  </Button>
                </div>
                <Nav className="mr-sm-2">
                  <NavDropdown
                    id="basic-nav-dropdown"
                    title="Gestion Vehicular"
                  >
                    <NavDropdown.Item as={Link} to="/home">
                      Gestion de Archivos
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/logistica">
                      Gestion de envios
                    </NavDropdown.Item>
                  </NavDropdown>
                  <i className="bi-person-circle mi-icono p-2"></i>
                  <NavDropdown id="basic-nav-dropdown" title={usuario}>
                    <NavDropdown.Item href="#action/3.2">
                      Configuracion
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      href="#action/3.3"
                      onClick={onClickLogout}
                    >
                      Cerrar Sesion
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
  )
}

export default HeaderJefe