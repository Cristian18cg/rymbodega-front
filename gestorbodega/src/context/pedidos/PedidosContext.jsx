import { useState, createContext, useEffect, useMemo } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";
const PedidosContextControl = createContext();

const PedidosPovider = ({ children }) => {
  const { token, usuario } = useControl();
  const [resCrearColaborador, setresCrearColaborador] = useState("");
  const [ListadoEntregadores, setListadoEntregadores] = useState("");
  const [Pedidos, setPedidos] = useState("");
  const [EntregadoresTotal, setEntregadoresTotal] = useState("");
  const [VisibleRuta, setVisibleRuta] = useState(false);
  const [VisibleRutaEntregador, setVisibleRutaEntregador] = useState(false);

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
  /* Funcion para listar las rutas por entregador del dia */
  const Listar_entregadores_rutas = async () => {
    try {
      const tokenDeAcceso = token;
      const response = await clienteAxios.get("pedidos/lista_entregadores/", {
        headers: {
          Authorization: `Bearer ${tokenDeAcceso}`,
        },
      });
      console.log(response.data);
      setListadoEntregadores(response.data);
    } catch (error) {
      FuncionErrorToken(error);
      console.error("Error al obtener los colaboradores:", error);
      // Aquí puedes manejar el error como desees, por ejemplo, mostrando una notificación al usuario.
    }
  };
  /* Funcion para listar los proveedores */
  const Listar_entregadores = async () => {
    try {
      const tokenDeAcceso = token;
      const response = await clienteAxios.get(
        "pedidos/lista_entregadores_total/",
        {
          headers: {
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setEntregadoresTotal(response.data);
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
      setresCrearColaborador("Yes");
    } catch (error) {
      window.scrollTo(0, 0);

      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Funcion de crear carpeta de ingreso */
  const CrearPedido = async (datos, pedidos) => {
    const tokenDeAcceso = token;
    try {
      const formData = new FormData();

      formData.append("nombres", datos.nombre);
      formData.append("documento", datos.documento);
      formData.append("Vehiculo", datos.tipoVehiculo);
      formData.append("Acompañante", datos.acompañante);
      formData.append("Acompañado", datos.acompanado);
      formData.append("usuario", usuario);
      formData.append("pedidos", JSON.stringify(pedidos));
      const response = await clienteAxios.post(
        "pedidos/crear_pedido/",
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
        timer: 3000,
      });
      setVisibleRuta(false);
      Listar_entregadores_rutas();
    } catch (error) {
      window.scrollTo(0, 0);

      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Funcion para listar los pedidos por documento */
  const Listar_pedidos = async (documento) => {
    try {
      const tokenDeAcceso = token;
      const response = await clienteAxios.get(
        `pedidos/pedidos_por_entregador/?documento=${documento}`,
        {
          headers: {
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setPedidos(response.data);
    } catch (error) {
      FuncionErrorToken(error);
      // Aquí puedes manejar el error como desees, por ejemplo, mostrando una notificación al usuario.
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

  const contextValue = useMemo(() => {
    return {
      VisibleRutaEntregador,
      setVisibleRutaEntregador,
      VisibleRuta,
      setVisibleRuta,
      setresCrearColaborador,
      CrearEntregador,
      CrearPedido,
      EntregadoresTotal,
      setEntregadoresTotal,
      resCrearColaborador,
      ListadoEntregadores,
      setListadoEntregadores,
      Listar_entregadores,
      Listar_entregadores_rutas,
      Listar_pedidos,
      Pedidos,
    setPedidos
    };
  }, [
    VisibleRutaEntregador,
    setVisibleRutaEntregador,
    EntregadoresTotal,
    setEntregadoresTotal,
    VisibleRuta,
    setVisibleRuta,
    Listar_entregadores,
    CrearPedido,
    resCrearColaborador,
    CrearEntregador,
    setresCrearColaborador,
    ListadoEntregadores,
    setListadoEntregadores,
    Listar_pedidos,
    Pedidos,
    setPedidos
  ]);

  return (
    <PedidosContextControl.Provider value={contextValue}>
      {children}
    </PedidosContextControl.Provider>
  );
};

export { PedidosContextControl, PedidosPovider };
