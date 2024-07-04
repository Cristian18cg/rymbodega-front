import useControl from "../../hooks/useControl";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import imagenn from "../../img/logon.webp";
import { Link } from "react-router-dom";

const Header = () => {
  const { logout, usuario, jsonlogin } = useControl();

  const onClickLogout = () => {
    logout(jsonlogin.id);
  };

  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      expand="lg"
      className="justify-content-between"
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
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav className="mr-sm-2">
            <NavDropdown id="basic-nav-dropdown" title="Sistemas">
              <NavDropdown.Item as={Link} to="/usuarios">
                Usuarios
              </NavDropdown.Item>
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
  );
};

export default Header;
