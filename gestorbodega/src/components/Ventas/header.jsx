import { useState, useEffect } from "react";
import useControl from "../../hooks/useControl";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import imagenn from "../../img/logon.webp";
import { Link } from "react-router-dom";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";

const Header = () => {
  const { logout, usuario, jsonlogin } = useControl();

  const onClickLogout = () => {
    logout(jsonlogin.id);
  };
  const cargo = jsonlogin.id_cargo;
  const baseURL = process.env.REACT_APP_BASE_URL;
  const baseURLWithoutHttp = baseURL.replace("http://", "");
  useEffect(() => {
    const socket = new WebSocket(
      `ws://${baseURLWithoutHttp}ventas/ws/notificaciones/`
    );

    // Escuchar mensajes entrantes
    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log(data);
    };

    // Manejar la desconexión
    socket.onclose = function () {
      // Puedes agregar lógica aquí para manejar la reconexión si es necesario
    };
  }, []);

  return (
    <div>
      <Navbar
        data-bs-theme="dark"
        expand="lg"
        className="justify-content-between  nav-color"
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
              <i
                className="pi pi-bell p-overlay-badge icon-notification mx-2"
                style={{ fontSize: "1.5rem" }}
              >
                <Badge
                  value="5"
                  severity="secondary"
                  className="badge-notification"
                />
              </i>
            </div>
            <Nav className="mr-sm-2">
              <NavDropdown id="basic-nav-dropdown" title="Reportes ">
                {cargo === 9 ? ( /* Si es el cargo de recepcion */
                  <>
                    <NavDropdown.Item as={Link} to="/home_anunciamiento">
                      Anunciamiento
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/tabla_turno">
                      Tabla de turno
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/solicitud_cambio_receptor">
                 Cambio Receptor
                    </NavDropdown.Item>
                  </>
                ) : (
                  <>
                    <NavDropdown.Item as={Link} to="/reporte">
                      Crear solicitud
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/lista">
                      Listar Solicitudes
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/historico_solicitudes">
                      Historico Solicitudes
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
              <i className="bi-person-circle mi-icono p-2"></i>
              <NavDropdown id="basic-nav-dropdown" title={usuario}>
                <NavDropdown.Item href="#action/3.2">
                  Configuracion
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3" onClick={onClickLogout}>
                  Cerrar Sesion
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
