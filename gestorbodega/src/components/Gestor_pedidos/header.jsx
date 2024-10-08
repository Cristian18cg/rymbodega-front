import useControl from "../../hooks/useControl";
import { Sidebar } from "primereact/sidebar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import imagenn from "../../img/icono.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Badge } from "primereact/badge";
import { useState, useEffect } from "react";
import { ListBox } from "primereact/listbox";
import { TabMenu } from "primereact/tabmenu";
import { debounce } from "lodash";
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

  const onClickLogout = () => {
    navigate("/");
    logout(jsonlogin.id);
  };

  /* 

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



  

  const delayedRequest = debounce(() => {
/*     RegistrosNotificacionActivo();
    RegistrosNotificacionRetiro();
    RegistrosNotificacionIngreso(); */
  /*   }, 500); */

  /*   useEffect(() => {
    delayedRequest();
  }, []); */

  /*   useEffect(() => {
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
  }, [registros, registros2, registros3]); */

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
      registros.total + registros2.total + registros3.total;

    if (isNaN(numeronotificaciones)) {
      return 0; // Si la suma es NaN, retornar 0
    }
    return numeronotificaciones;
  };
  return (
    <>
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
            alt="imagen rym logo"
            width="auto"
            height="80"
            onClick={() => {
              navigate("/");
            }}
          />
          <h1 className="text-light">Gestor bodega rym</h1>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            className="justify-content-end"
            id="basic-navbar-nav"
          >
            <Nav className="mr-sm-2 align-items-center">
              <div className="align-items-center  ">
                {/* icono home */}
                <i
                  className="pi pi-home icon-notification "
                  style={{ fontSize: "1.5rem" }}
                  onClick={() => {
                    navigate("/");
                  }}
                ></i>
                {/* icono campana */}

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
              <NavDropdown id="basic-nav-dropdown" title="Entregas">
                <NavDropdown.Item as={Link} to="/crear/entregador">
                  <i className="pi pi-user-plus" /> Crear entregador
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/lista/entregas">
                  <i className="pi pi-car " /> Lista entregas
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/lista/historico_entregas">
                  <i className="pi pi-address-book " /> Historico entregas
                </NavDropdown.Item>
              </NavDropdown>
              {/* Woocomerce */}
              <NavDropdown id="basic-nav-dropdown" title="Woocomerce">
                <NavDropdown.Item as={Link} to="/woocomerce/productos">
                  <i className="pi pi-shopping-bag" /> Productos
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/woocomerce/pedidos">
                  <i className="pi pi-car" /> Pedidos
                </NavDropdown.Item>
              </NavDropdown>
              {/* worldoffice */}
              <NavDropdown id="basic-nav-dropdown" title="World Office">
                <NavDropdown.Item as={Link} to="/worldoffice/productos">
                  <i className="pi pi-shopping-bag" /> Productos WO
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/worldoffice/terceros">
                  <i className="pi pi-user" /> Terceros WO
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/worldoffice/ventas">
                  <i className="pi pi-car" /> Ventas api WO
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
          {/* <Sidebar
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
            </Sidebar> */}
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
