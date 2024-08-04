import { useState, createContext, useEffect, useMemo } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";
const PedidosContextControl = createContext();

const PedidosPovider = ({ children }) => {
  const { token, usuario } = useControl();
  const [archivosProveedor, setarchivosProveedor] = useState([]);
  const [archivosOtros, setarchivosOtros] = useState([]);
  const [archivosObsoletos, setarchivosObsoletos] = useState([]);
  const [resCrearColaborador, setresCrearColaborador] = useState("");
  const [ListadoProveedores, setListadoProveedores] = useState("");
  const [filtroGlobalCompras, setfiltroGlobalCompras] = useState("");
  const [vistatabla, setvistatabla] = useState(0);
  const [visibleNovedades, setvisibleNovedades] = useState(false);
  const [visibleCargarArchivos, setvisibleCargarArchivos] = useState(false);
  const [visibleCargarOtros, setvisibleCargarOtros] = useState(false);
  const [visibleActualizarArchivos, setvisibleActualizarArchivos] = useState(
    false
  );
  const [comentariosActualizacion, setcomentariosActualizacion] = useState([]);
  const [notificaciones, setnotificaciones] = useState([]);
  const [datosGrafica, setdatosGrafica] = useState([]);
  const [logRegistroCompras, setlogRegistroCompras] = useState([]);
  const showError = (error) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 5000,
      background: "#f3f2e8f1",
      color: "black",
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: error ? error : "¡Ha ocurrido un error!",
      buttonsStyling: false,
    });
  };
  const showSuccess = (mensaje) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      background: "#f3f2e8",
      color: "black",
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: mensaje ? mensaje : "",
      buttonsStyling: false,
    });
  };
  /* Funcion para listar los proveedores */
  const listarProveedores = async () => {
    try {
      const tokenDeAcceso = token;
      const response = await clienteAxios.get("compras/lista_proveedores/", {
        headers: {
          Authorization: `Bearer ${tokenDeAcceso}`,
        },
      });

      setListadoProveedores(response.data);
    } catch (error) {
      FuncionErrorToken(error);
      console.error("Error al obtener los colaboradores:", error);
      // Aquí puedes manejar el error como desees, por ejemplo, mostrando una notificación al usuario.
    }
  };
  /* Funcion de crear carpeta de ingreso */
  const CrearEntregador = async (datos) => {
    const tokenDeAcceso = token;
    try {
      const formData = new FormData();

      formData.append("nombres", datos.nombre);
      formData.append("documento", datos.documento);
      formData.append("Vehiculo", datos.tipoVehiculo);
      formData.append("apellidos", datos.apellidos);
      formData.append("usuario", usuario);

      const response = await clienteAxios.post(
        "pedidos/crear_entregador/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 2000,
      });
      setresCrearColaborador("Yes")
    } catch (error) {
      window.scrollTo(0, 0);

      if (error) {
        FuncionErrorToken(error);
      }
    }
  };

  /* Funcion de error de token general */
  const FuncionErrorToken = (error) => {
    if (error?.response?.status === 401) {
      window.location.reload();
      showError("Tu token se vencio, por favor vuelve a iniciar sesión.");
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.error
    ) {
      showError(error?.response?.data.error);
    } else {
      showError("Ha ocurrido un error!");
    }
  };

  const ActualizarProveedor = async (data, usuario) => {
    const tokenDeAcceso = token;
    data["usuario"] = usuario;

    try {
      const response = await clienteAxios.post(
        "compras/actualizarproveedor/",
        data,
        {
          headers: {
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      listarProveedores();
      showSuccess(response?.data?.message);
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  const contextValue = useMemo(() => {
    return {
      setresCrearColaborador,
      CrearEntregador,
      resCrearColaborador ,
    };
  }, [resCrearColaborador, CrearEntregador, setresCrearColaborador]);

  return (
    <PedidosContextControl.Provider value={contextValue}>
      {children}
    </PedidosContextControl.Provider>
  );
};

export { PedidosContextControl, PedidosPovider };
