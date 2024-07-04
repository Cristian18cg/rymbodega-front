import useControl from "../../hooks/useControl";
import { Sidebar } from "primereact/sidebar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import imagenn from "../../img/logon.webp";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Badge } from "primereact/badge";
import { useState, useEffect } from "react";
import { ListBox } from "primereact/listbox";
import { TabMenu } from "primereact/tabmenu";
import { debounce } from "lodash";
import useControl_Compras from "../../hooks/useControl_Compras";
const Header = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [notificacion, setNotificacion] = useState([]);
  const { logout, usuario, jsonlogin } = useControl();
  const {
    setcomentariosActualizacion,
    Notificaciones,
    notificaciones,
    setfiltroGlobalCompras,
    setnotificaciones
  } = useControl_Compras();

  
  const onClickLogout = () => {
    logout(jsonlogin.id);
    navigate("/");
  };
  const baseURL = process.env.REACT_APP_BASE_URL;
  const baseURLWithoutHttp = baseURL.replace("http://", "");
  /* web socket para las notificaciones */
  useEffect(() => {
    const socket = new WebSocket(
      `ws://${baseURLWithoutHttp}compras/ws/notificaciones/`
    );

    socket.onopen = function (e) {
    };
    // Escuchar mensajes entrantes
    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data?.mensaje === "Se ha actualizado un comentario") {
        setcomentariosActualizacion(data?.datos);
      }
      if (data?.mensaje === "Se ha actualizado un registro") {
        setnotificaciones(data?.datos);
      }
      // Aquí puedes manejar la lógica para actualizar tu interfaz de usuario con los datos recibidos
    };

    // Manejar la desconexión
    socket.onclose = function (event) {
      if (event.wasClean) {
       
      } else {
        console.error("[close] Connection died");
      }
      // Puedes agregar lógica aquí para manejar la reconexión si es necesario
    };
    socket.onerror = function (error) {
      console.error(`[error] ${error.message}`);
    };
  }, []);
  const delayedRequest = debounce(() => {
    Notificaciones();
  }, 500);

  useEffect(() => {
    delayedRequest();
  }, []);
  useEffect(() => {
    const buscarRegistrosingreso = () => {
      const mensajes = [];
      registros?.data.forEach((elemento) => {
        // Formatear el mensaje para este elemento
        const mensajeFormateado = `${elemento.descripcion_registro} Hora: ${elemento.hora_registro}\n Responsable: ${elemento.nombre_responsable}`;
        // Crear un objeto con el mensaje formateado y asignarlo a la clave 'notificacion'
        const mensajeObjeto = {
          notificacion: mensajeFormateado,
          documento: elemento.numero_documento,
        };
        // Agregar este objeto al array de mensajes
        mensajes.push(mensajeObjeto);
      });
      setNotificacion(mensajes);
    };
    if (registros?.data !== undefined) {
      buscarRegistrosingreso();
    }
    // Llama a la función asincrónica para obtener los datos
  }, [registros]);

  useEffect(() => {
    setRegistros(notificaciones);
  }, [notificaciones]);
  const headernotificaciones = () => {
    return (
      <div className="bg-black">
        <i className="pi pi-bell "> </i> Notificaciones
      </div>
    );
  };
  const calcularregisto = () => {
    if (registros === undefined) {
      return 0; // Si alguna de las constantes es undefined, retornar 0
    }
    let numeronotificaciones = registros.total;

    if (isNaN(numeronotificaciones)) {
      return 0; // Si la suma es NaN, retornar 0
    }
    return numeronotificaciones;
  };
  return (
    <>
      {jsonlogin.id_cargo === 1 ? (
        <Navbar
          sticky="top"
          bg="dark"
          data-bs-theme="dark"
          expand="lg"
          className="justify-content-between bg-black"
        >
          <Container>
            <img
              src={imagenn}
              alt="imagen de nacional de electricos"
              width="auto"
              height="80"
              onClick={() => {
                navigate("/");
              }}
            />
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              className="justify-content-end"
              id="basic-navbar-nav"
            >
              <Nav className="mr-sm-2 align-items-center">
                <div className="align-items-center  ">
                  <i
                    className="pi pi-home icon-notification "
                    style={{ fontSize: "1.5rem" }}
                    onClick={() => {
                      navigate("/");
                    }}
                  ></i>
                  <i
                    className="pi pi-bell p-overlay-badge icon-notification mx-2 cursor-pointer"
                    style={{ fontSize: "1.5rem" }}
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    {" "}
                    <Badge
                      value={calcularregisto()}
                      severity="secondary"
                      className="badge-notification"
                    ></Badge>
                  </i>
                </div>
                <NavDropdown
                  id="basic-nav-dropdown"
                  title="Gestion proveedores"
                >
                  <NavDropdown.Item as={Link} to="/crear_proveedor">
                    <i className="pi pi-user-plus" /> Crear proveedor
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/listar_proveedores">
                    <i className="pi pi-list" /> Lista proveedores
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/log_registro">
                    <i className="pi pi-list-check" /> Log de registros
                  </NavDropdown.Item>
                  
                </NavDropdown>
                <i className="bi-person-circle mi-icono "></i>
                <NavDropdown id="basic-nav-dropdown" title={usuario}>
                  <NavDropdown.Item href="#action/3.2">
                    Configuracion
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/" onClick={onClickLogout}>
                    Cerrar Sesion
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
            <Sidebar
              visible={visible}
              onHide={() => setVisible(false)}
              className="side-noti"
              header={headernotificaciones()}
            >
              <ListBox
              
                filterPlaceholder="Filtrar por tipo, nombre o fecha..."
                filter
                value={notificacion.documento}
                onChange={(e) => {
                  navigate("/listar_proveedores");
                  setfiltroGlobalCompras(e.value.documento);
                  setVisible(false);
                }}
                options={notificacion}
                optionLabel="notificacion"
                className="list-notification mt-1"
              />
            </Sidebar>
          </Container>
        </Navbar>
      ) : (
        <Navbar
          bg="dark"
          data-bs-theme="dark"
          expand="lg"
          className="justify-content-between bg-black"
        >
          <Container>
            <img
              src={imagenn}
              alt="imagen de nacional de electricos"
              width="auto"
              height="80"
              className="d-inline-block align-top img-nav"
              onClick={() => {
                navigate("/");
              }}
            />

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              className="justify-content-end"
              id="basic-navbar-nav"
            >
              <Nav className="mr-sm-2 align-items-center justify-content-center">
                <i
                  className="pi pi-home icon-notification "
                  style={{ fontSize: "1.5rem" }}
                  onClick={() => {
                    navigate("/");
                  }}
                ></i>
                <i
                  className="pi pi-bell p-overlay-badge icon-notification mx-3"
                  style={{ fontSize: "1.5rem" }}
                  onClick={() => {}}
                ></i>
                <NavDropdown
                  id="basic-nav-dropdown"
                  title="Gestion proveedores"
                >
                  <NavDropdown.Item as={Link} to="/crear_proveedor">
                    <i className="pi pi-user-plus" /> Crear proveedor
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/lista_proveedores_productos">
                    <i className="pi pi-user-plus" />
                    Lista proveedores productos
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/lista_proveedores_productos">
                    <i className="pi pi-user-plus" />
                    Lista proveedores servicios
                  </NavDropdown.Item>
                </NavDropdown>

                <i className="bi-person-circle mi-icono p-2"></i>
                <NavDropdown id="basic-nav-dropdown" title={usuario}>
                  <NavDropdown.Item href="/">Configuracion</NavDropdown.Item>
                  <NavDropdown.Item href="/" onClick={onClickLogout}>
                    Cerrar Sesion
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  );
};

export default Header;
