import { useState, createContext, useEffect, useMemo } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";
const PedidosContextControl = createContext();

const PedidosPovider = ({ children }) => {
  const { token, usuario } = useControl();
  const [resCrearColaborador, setresCrearColaborador] = useState("");
  const [Pedidos, setPedidos] = useState("");
  const [ultimaRuta, setultimaRuta] = useState("");
  const [ultimaBase, setultimaBase] = useState("");
  const [ListadoEntregadores, setListadoEntregadores] = useState("");
  const [Listahistorico, setListahistorico] = useState("");

  const [EntregadoresTotal, setEntregadoresTotal] = useState("");
  const [VisibleRuta, setVisibleRuta] = useState(false);
  const [Visibleagregar, setVisibleagregar] = useState(false);
  const [VisibleRutaEntregador, setVisibleRutaEntregador] = useState(false);
  const [data, setData] = useState(false);

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
  /* Funcion para obtener ultima ruta */
  const obtener_ruta = async (documento) => {
    try {
      const tokenDeAcceso = token;
      const response = await clienteAxios.get(
        `pedidos/obtener_ruta/?documento=${documento}`,
        {
          headers: {
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      console.log(response.data)
      setultimaRuta(response.data.numero_ruta);
      setultimaBase(response.data.base)
    } catch (error) {
      FuncionErrorToken(error);
      // Aquí puedes manejar el error como desees, por ejemplo, mostrando una notificación al usuario.
    }
  };
  const historico_entregas = async (
    fechaInicio = "",
    fechaFin = "",
    fecha = ""
  ) => {
    try {
      const tokenDeAcceso = token;

      // Construir la URL con parámetros de consulta si están disponibles
      let url = "pedidos/historico_entregadores/";
      const params = new URLSearchParams();

      if (fechaInicio) params.append("fecha_inicio", fechaInicio);
      if (fechaFin) params.append("fecha_fin", fechaFin);
      if (fecha) params.append("fecha", fecha);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await clienteAxios.get(url, {
        headers: {
          Authorization: `Bearer ${tokenDeAcceso}`,
        },
      });
      setListahistorico(response.data);
    } catch (error) {
      FuncionErrorToken(error);
      console.error("Error al obtener los entregadores:", error);
      // Aquí puedes manejar el error como desees, por ejemplo, mostrando una notificación al usuario.
    }
  };
  /* Funcion de crear entregador  */
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
      Listar_entregadores()
    } catch (error) {
      window.scrollTo(0, 0);

      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Funcion de crear pedido */
  const CrearPedido = async (datos, pedidos, agregar) => {
    console.log(pedidos)
    const tokenDeAcceso = token;
    try {
      const formData = new FormData();

      formData.append("nombres", datos.nombre);
      formData.append("documento", datos.documento);
      formData.append("Vehiculo", datos.tipoVehiculo);
      formData.append("Acompañante", datos.acompañante);
      formData.append("Acompañado", datos.acompanado);
      formData.append("agregar", agregar);
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
      if(agregar){
        Listar_pedidos(datos.documento)
        setVisibleagregar(false)
      }
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
  /* Funcion para actualizar informacion del pedido */
  const actualizar_pedidos = async (id, field, dato, documento,efectivo, numeroRuta) => {
    try {
      const tokenDeAcceso = token;
      const response = await clienteAxios.put(
        "pedidos/actualizar_pedido/", // La URL de la API
        {
          id: id,
          campo: field,
          dato: dato,
          usuario: usuario,
          documento: documento,
          efectivo:efectivo,
          numeroRuta:numeroRuta
        },
        {
          headers: {
            Authorization: `Bearer ${tokenDeAcceso}`,
            "Content-Type": "application/json",
          },
        }
      );
      if(efectivo){
        Listar_pedidos(documento)
      }
      Listar_entregadores_rutas();
      showSuccess(response.data.success);
    } catch (error) {
      FuncionErrorToken(error);
      // Aquí puedes manejar el error como desees, por ejemplo, mostrando una notificación al usuario.
    }
  };
  /* Funcion para completar topdos los pedidos de una ruta */
  const completar_ruta = async (ruta, documento) => {
    try {
      const tokenDeAcceso = token;
      const response = await clienteAxios.put(
        "pedidos/completar_ruta/", // La URL de la API
        {
          ruta: ruta,
          usuario: usuario,
          documento: documento,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenDeAcceso}`,
            "Content-Type": "application/json",
          },
        }
      );
      Listar_entregadores_rutas();
      Listar_pedidos(documento);
      showSuccess(response.data.success);
    } catch (error) {
      FuncionErrorToken(error);
      // Aquí puedes manejar el error como desees, por ejemplo, mostrando una notificación al usuario.
    }
  };
  const eliminar_pedido = async (id, documento) => {
    try {
      const tokenDeAcceso = token;
      const response = await clienteAxios.delete(
        `pedidos/eliminar_pedido/`, // La URL de la API
        {
          headers: {
            Authorization: `Bearer ${tokenDeAcceso}`,
            "Content-Type": "application/json",
          },
          data: {
            id: id,
            usuario: usuario,
            documento: documento,
          },
        }
      );
      Listar_entregadores_rutas();
      Listar_pedidos(documento);
      showSuccess(response.data.message); // Asegúrate de usar la clave correcta del mensaje
    } catch (error) {
      FuncionErrorToken(error);
      // Maneja el error según sea necesario
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
      setPedidos,
      actualizar_pedidos,
      data,
      setData,
      completar_ruta,
      eliminar_pedido,
      Listahistorico,
      setListahistorico,
      historico_entregas,
      Visibleagregar, setVisibleagregar,
      ultimaRuta, setultimaRuta,
      obtener_ruta,ultimaBase, setultimaBase
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
    setPedidos,
    actualizar_pedidos,
    data,
    setData,
    completar_ruta,
    eliminar_pedido,
    Listahistorico,
    setListahistorico,
    historico_entregas,
    Visibleagregar,
    setVisibleagregar,
    ultimaRuta, setultimaRuta,
    obtener_ruta,ultimaBase, setultimaBase
  ]);

  return (
    <PedidosContextControl.Provider value={contextValue}>
      {children}
    </PedidosContextControl.Provider>
  );
};

export { PedidosContextControl, PedidosPovider };
