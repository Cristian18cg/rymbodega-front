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
import useControl_Contrato_Activo from "../../hooks/useControl_Contrato_Activo";
import useControl_Documentos_Retiro from "../../hooks/useControl_Documentos_Retiro";
import useControl_DocumentosIngreso from "../../hooks/useControl_DocumentosIngreso";
const Header = () => {
  const navigate = useNavigate();
  const { logout, usuario, jsonlogin } = useControl();
  const [visible, setVisible] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [registros2, setRegistros2] = useState([]);
  const [registros3, setRegistros3] = useState([]);
  const [notificacion, setNotificacion] = useState([]);
  const [notificacion2, setNotificacion2] = useState([]);
  const [notificacion3, setNotificacion3] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
 
  const {
    RegistrosNotificacionIngreso,
    notificacionDocIngreso,
    setfiltoGlobalIngreso,
    RegistrosComentarios
  } = useControl_DocumentosIngreso();

  const {
    RegistrosNotificacionActivo,
    notificacionDocActivos,
    setfiltroGlobal,
    RegistrosComentariosActivo,
  } = useControl_Contrato_Activo();

  const {
    RegistrosNotificacionRetiro,
    notificacionDocRetiro,
    setfiltroGlobalRetiro,
    RegistrosComentariosRetiro
  } = useControl_Documentos_Retiro();
  const baseURL = process.env.REACT_APP_BASE_URL
  const baseURLWithoutHttp = baseURL.replace('http://', '');
  useEffect(() => {
    const socket = new WebSocket(
      `ws://${baseURLWithoutHttp}gestion_humana/ws/notificaciones/`
    );

    // Escuchar mensajes entrantes
    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      const tipo_registro = data?.datos?.data[0]?.tipo_registro
      switch (data?.tipo) {
        case "ingreso":
          if(tipo_registro === 'AC'){
            RegistrosComentarios()
          }
          setRegistros(data.datos);
          break;
        case "activo":
          if(tipo_registro === 'AC'){
            RegistrosComentariosActivo()
          }
          setRegistros2(data.datos);
          break;
        case "retiro":
          if(tipo_registro === 'AC'){
            RegistrosComentariosRetiro()
          }
          setRegistros3(data.datos);
          break;
        default:
          break;
      }
     

      // Aquí puedes manejar la lógica para actualizar tu interfaz de usuario con los datos recibidos
    };

    // Manejar la desconexión
    socket.onclose = function () {
      // Puedes agregar lógica aquí para manejar la reconexión si es necesario
    };
  }, []);

  useEffect(() => {
    setRegistros(notificacionDocIngreso);
    setRegistros2(notificacionDocActivos);
    setRegistros3(notificacionDocRetiro);
  }, [notificacionDocIngreso, notificacionDocActivos, notificacionDocRetiro]);

  const onClickLogout = () => {
    logout(jsonlogin.id);
    navigate("/");
  };

  const delayedRequest = debounce(() => {
    RegistrosNotificacionActivo();
    RegistrosNotificacionRetiro();
    RegistrosNotificacionIngreso();
  }, 500);

  useEffect(() => {
    delayedRequest();
  }, []);

  useEffect(() => {
    const buscarRegistrosingreso = () => {
      const mensajes = [];
      registros?.data.forEach((elemento) => {
        // Formatear el mensaje para este elemento
        const mensajeFormateado = `Descripción: ${elemento.descripcion_registro}, Hora: ${elemento.hora_registro}\n Responsable: ${elemento.nombre_responsable}`;
        // Crear un objeto con el mensaje formateado y asignarlo a la clave 'notificacion'
        const mensajeObjeto = {
          notificacion: mensajeFormateado,
          documento: elemento.colaborador_numero_documento,
        };
        // Agregar este objeto al array de mensajes
        mensajes.push(mensajeObjeto);
      });
      setNotificacion(mensajes);
    };

    if (registros?.data !== undefined) {
      buscarRegistrosingreso();
    }

    const buscarRegistrosactivo = () => {
      const mensajes = [];

      registros2?.data.forEach((elemento) => {
        // Formatear el mensaje para este elemento
        const mensajeFormateado = `Descripción: ${elemento.descripcion_registro}, Hora: ${elemento.hora_registro}\n Responsable: ${elemento.nombre_responsable}`;
        // Crear un objeto con el mensaje formateado y asignarlo a la clave 'notificacion'
        const mensajeObjeto = {
          notificacion: mensajeFormateado,
          documento: elemento.colaborador_numero_documento,
        };
        // Agregar este objeto al array de mensajes
        mensajes.push(mensajeObjeto);
      });
      setNotificacion2(mensajes);
    };

    if (registros2?.data !== undefined) {
      buscarRegistrosactivo();
    }

    const buscarRegistrosRetiro = () => {
      const mensajes = [];
      registros3?.data.forEach((elemento) => {
        // Formatear el mensaje para este elemento
        const mensajeFormateado = `Descripción: ${elemento.descripcion_registro}, Hora: ${elemento.hora_registro}\n Responsable: ${elemento.nombre_responsable}`;
        // Crear un objeto con el mensaje formateado y asignarlo a la clave 'notificacion'
        const mensajeObjeto = {
          notificacion: mensajeFormateado,
          documento: elemento.colaborador_numero_documento,
        };
        // Agregar este objeto al array de mensajes
        mensajes.push(mensajeObjeto);
      });
      setNotificacion3(mensajes);
    };
    if (registros3?.data !== undefined) {
      buscarRegistrosRetiro();
    }
    // Llama a la función asincrónica para obtener los datos
  }, [registros, registros2, registros3]);

  const headernotificaciones = () => {
    return (
      <div className="bg-black">
        <i className="pi pi-bell "> </i> Notificaciones
      </div>
    );
  };

  const itemRenderer = (item, itemIndex) => (
    <a
      className="p-menuitem-link flex align-items-center a-menu"
      onClick={() => {
        setActiveIndex(itemIndex);
      }}
    >
      <img
        alt={item.name}
        src={require(`../../img/gestion_humana/carpeta_activo/${item.image}`)}
        style={{ width: "20px" }}
      />
      <span className="font-bold texto-menu">{item.name}</span>
    </a>
  );
  const items = [
    {
      name: "Documentos de ingreso",
      image: "2.png",
      template: (item) => itemRenderer(item, 0),
    },
    {
      name: "Documentos Activo",
      image: "7.png",
      template: (item) => itemRenderer(item, 1),
    },
    {
      name: "Documentos Retiro",
      image: "7.png",
      template: (item) => itemRenderer(item, 2),
    },
  ];
  const calcularregisto = () => {
    if (
      registros === undefined ||
      registros2 === undefined ||
      registros3 === undefined
    ) {
      return 0; // Si alguna de las constantes es undefined, retornar 0
    }
    let numeronotificaciones =
      registros.total +
      registros2.total +
      registros3.total;

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
                    className="pi pi-bell p-overlay-badge icon-notification mx-2"
                    style={{ fontSize: "1.5rem" }}
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    <Badge
                      value={calcularregisto()}
                      severity="secondary"
                      className="badge-notification"
                    ></Badge>
                  </i>
                </div>
                <NavDropdown id="basic-nav-dropdown" title="Gestión Documental">
                  <NavDropdown title="Documentos ingreso">
                    <NavDropdown.Item as={Link} to="/agregar_documento">
                      <i className="pi pi-user-plus" /> Agregar colaborador
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/lista_colaboradores">
                      <i className="pi pi-folder-open" /> Lista documentos
                      ingreso
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown
                    id="basic-nav-dropdown"
                    title="Documentos contrato activo"
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/crear_carpeta_contrato_activo"
                    >
                      <i className="pi pi-folder" /> Crear carpeta
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/lista_documentos_activo">
                      <i className="pi pi-folder-open" /> Lista documentos
                      activo
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown
                    id="basic-nav-dropdown"
                    title="Documentos de retiro"
                  >
                    <NavDropdown.Item as={Link} to="/crear_carpeta_doc_retiro">
                      <i className="pi pi-folder" /> Crear carpeta de retiro
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/lista_documentos_retiro">
                      <i className="pi pi-folder-open" /> Lista documentos
                      retiro
                    </NavDropdown.Item>
                  </NavDropdown>
                  <div>
                    <p
                      onClick={() => {
                        navigate("/log_registros");
                      }}
                      className="nav-link p-nav-link"
                    >
                      Log de eventos
                    </p>
                    <p
                      onClick={() => {
                        navigate("/colaboradores");
                      }}
                      className="nav-link  p-nav-link"
                      title="Lista colaboradores general"
                    >
                      Lista colaboradores general
                    </p>
                  </div>
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
              <TabMenu
                model={items}
                activeIndex={activeIndex}
                onTabChange={(e) => {
                  setActiveIndex(e.index);
                }}
                className="tab-menu-gestion"
              />
              {activeIndex === 0 ? (
                <ListBox
                  filter
                  value={notificacion.documento}
                  onChange={(e) => {
                    navigate("/lista_colaboradores");
                    setfiltoGlobalIngreso(e.value.documento);
                    setVisible(false);
                  }}
                  options={notificacion}
                  optionLabel="notificacion"
                  className="list-notification mt-1"
                />
              ) : activeIndex === 1 ? (
                <ListBox
                  filter
                  value={notificacion2.documento}
                  onChange={(e) => {
                    setfiltroGlobal(e.value.documento);
                    navigate("/lista_documentos_activo");
                    setVisible(false);
                  }}
                  options={notificacion2}
                  optionLabel="notificacion"
                  className="list-notification mt-1"
                />
              ) : activeIndex === 2 ? (
                <ListBox
                  filter
                  value={notificacion3.documento}
                  onChange={(e) => {
                    setfiltroGlobalRetiro(e.value.documento);
                    navigate("/lista_documentos_retiro");
                    setVisible(false);
                  }}
                  options={notificacion3}
                  optionLabel="notificacion"
                  className="list-notification mt-1"
                />
              ) : (
                <></>
              )}
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
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  <Badge
                    value={calcularregisto()}
                    severity="secondary"
                    className="badge-notification"
                  ></Badge>
                </i>
                <NavDropdown id="basic-nav-dropdown" title="Gestion documental">
                  <NavDropdown title="Documentos ingreso">
                    <NavDropdown.Item as={Link} to="/agregar_documento">
                      <i className="pi pi-user-plus" /> Agregar colaborador
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/lista_colaboradores">
                      <i className="pi pi-folder-open" /> Lista documentos
                      ingreso
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown
                    id="basic-nav-dropdown"
                    title="Documentos contrato activo"
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/crear_carpeta_contrato_activo"
                    >
                      <i className="pi pi-folder" /> Crear carpeta
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/lista_documentos_activo">
                      <i className="pi pi-folder-open" /> Lista documentos
                      activo
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown
                    id="basic-nav-dropdown"
                    title="Documentos de retiro"
                  >
                    <NavDropdown.Item as={Link} to="/crear_carpeta_doc_retiro">
                      <i className="pi pi-folder" /> Crear carpeta de retiro
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/lista_documentos_retiro">
                      <i className="pi pi-folder-open" /> Lista documentos
                      retiro
                    </NavDropdown.Item>
                  </NavDropdown>
                  <p
                    onClick={() => {
                      navigate("/log_registros");
                    }}
                    className="nav-link "
                  >
                    Log de eventos
                  </p>
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
            <Sidebar
              visible={visible}
              onHide={() => setVisible(false)}
              className="side-noti"
              header={headernotificaciones()}
            >
              <TabMenu
                model={items}
                activeIndex={activeIndex}
                onTabChange={(e) => {
                  setActiveIndex(e.index);
                }}
                className="tab-menu-gestion"
              />
              {activeIndex === 0 ? (
                <ListBox
                  filter
                  value={notificacion.documento}
                  onChange={(e) => {
                    navigate("/lista_colaboradores");
                    setfiltoGlobalIngreso(e.value.documento);
                    setVisible(false);
                  }}
                  options={notificacion}
                  optionLabel="notificacion"
                  className="list-notification mt-1"
                />
              ) : activeIndex === 1 ? (
                <ListBox
                  filter
                  value={notificacion2.documento}
                  onChange={(e) => {
                    setfiltroGlobal(e.value.documento);
                    navigate("/lista_documentos_activo");
                    setVisible(false);
                  }}
                  options={notificacion2}
                  optionLabel="notificacion"
                  className="list-notification mt-1"
                />
              ) : activeIndex === 2 ? (
                <ListBox
                  filter
                  value={notificacion3.documento}
                  onChange={(e) => {
                    setfiltroGlobalRetiro(e.value.documento);
                    navigate("/lista_documentos_retiro");
                    setVisible(false);
                  }}
                  options={notificacion3}
                  optionLabel="notificacion"
                  className="list-notification mt-1"
                />
              ) : (
                <></>
              )}
            </Sidebar>
          </Container>
        </Navbar>
      )}
    </>
  );
};

export default Header;
