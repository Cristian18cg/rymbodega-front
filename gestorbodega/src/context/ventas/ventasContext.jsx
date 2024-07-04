import { useState, createContext, useMemo } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";
import { format } from "date-fns";

const ContextVenta = createContext();

const VentasProvider = ({ children }) => {
  const { token } = useControl();
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesNit, setSolicitudesNit] = useState([]);
  const [modalremisiones, setModalRemisiones] = useState(false);
  const [filtroGlobal, setfiltroGlobal] = useState("");
  const [solicitudesBus, setsolicitudesBus] = useState([]);
  const [auxiliares, setauxiliares] = useState([]);
  const [ListaTurno, setListaTurno] = useState([]);
  const [indexAnunciamiento, setindexAnunciamiento] = useState(0);  
  const [documentosRemisiones, setdocumentosRemisiones] = useState([])

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
      timer: 5000,
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

  const crearSolicitud = async (
    totalSolicitudes,
    token,
    transportadoras,
    personasAutorizadas
  ) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro de crear las siguientes solicitudes?",
        html: `
          <p>Una vez creada, no podrás revertir los cambios.</p>
          <p><strong>Solicitudes:</strong> ${totalSolicitudes}</p>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, crear solicitud",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) {
        const solicitudCompleta = {
          solicitudes: totalSolicitudes,
          transportadoras: transportadoras,
          personasAutorizadas: personasAutorizadas,
        };
        const response = await clienteAxios.post(
          "ventas/crear_solicitud/",
          JSON.stringify(solicitudCompleta),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 201) {
          Swal.fire({
            title: "Muy bien",
            text: "Solicitud registrada con exito",
            icon: "success",
          });
          return true;
        }
        if (response.status !== 200) {
          return Swal.fire({
            icon: "error",
            title: "Hubo un error" + { response },
          });
        }
      }
    } catch (error) {
      if (error.request.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Solicitud ya registrada",
          text: "Ya existe una solicitud con el mismo número. Por favor, verifica la información ingresada e intenta nuevamente.",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#d33",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        return false;
      }
      if (error.request.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Conductor ya registrado!",
          text: "El conductor que intentas registrar ya existe en el sistema. Por favor, verifica el numero de documento y asegúrate de que no esté registrado.",
          confirmButtonColor: "#ff0033",
          cancelButtonColor: "#ff0033",
          confirmButtonText: "Ok",
        });
        return false;
      }
      if (error.message == "Network Error") {
        return Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor ",
          text: error.message,
        });
      }
      if (error.request.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Sesión Finalizada",
          text: error.message,
        }).then(() => {
          // Recargar la página
          // window.location.reload();
        });
      }
    }
  };

  const obtenerSolicitudeNit = async (nit) => {
    console.log(nit);
    try {
      const response = await clienteAxios.post(
        "ventas/listar_solicitudes_nit/",
        { nit: nit },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      const data = response.data;
      const solicitudes = {};
      solicitudes[nit] = data;
      setSolicitudesNit((prevState) => ({
        ...prevState,
        ...solicitudes,
      }));
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };

  const obtenerSolicitudes = async (token, consultaAlmacen) => {
    try {
      const response = await clienteAxios.post(
        "ventas/listar_solicitudes/",
        consultaAlmacen,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response;
      setSolicitudes(data);
      setSolicitudesNit([])
      return data;
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        const { status, data } = error.response;

        if (status === 401) {
          // Error de autenticación
          Swal.fire({
            icon: "error",
            title: "Sesión Finalizada",
            text:
              data.message ||
              "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          }).then(() => {
            window.location.reload();
          });
        } else if (status === 500) {
          // Error del servidor
          Swal.fire({
            icon: "error",
            title: "Error del Servidor",
            text:
              data.message ||
              "Ha ocurrido un error en el servidor. Por favor, inténtalo de nuevo más tarde.",
          });
        } else {
          // Otros códigos de estado de error
          Swal.fire({
            icon: "error",
            title: "Error de respuesta del servidor",
            text: `${status}: ${
              data.message ||
              "Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde."
            }`,
          });
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        Swal.fire({
          icon: "error",
          title: "Error de solicitud",
          text: "No se pudo establecer conexión con el servidor. Por favor, verifica tu conexión a Internet e inténtalo de nuevo.",
        });
      } else {
        // Algo pasó al configurar la solicitud que activó un error
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.message ||
            "Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.",
        });
      }

      // Opcionalmente, puedes lanzar el error para manejarlo en otro lugar
    }
  };

  const actualizarEstadoSolicitud = async (
    id_solicitud,
    estado,
    token,
    selectpersonalAux
  ) => {
    try {
      const cambioEstado = {
        id_solicitud: id_solicitud,
        estado: estado,
        encargado: selectpersonalAux,
      };
      console.log("cambioEstado :: : . " + cambioEstado);
      const response = await clienteAxios.patch(
        "ventas/actualizar_estados/",
        cambioEstado,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Muy bien",
          text: "Cambio de estado registrado con exito",
          icon: "success",
        });
        return true;
      }
      if (response.status !== 200) {
        return Swal.fire({
          icon: "error",
          title: "Hubo un error" + { response },
        });
      }
      return true;
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        const { status, data } = error.response;

        if (status === 401) {
          // Error de autenticación
          Swal.fire({
            icon: "error",
            title: "Sesión Finalizada",
            text:
              data.message ||
              "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          }).then(() => {
            window.location.reload();
          });
        } else if (status === 500) {
          // Error del servidor
          Swal.fire({
            icon: "error",
            title: "Error del Servidor",
            text:
              data.message ||
              "Ha ocurrido un error en el servidor. Por favor, inténtalo de nuevo más tarde.",
          });
        } else {
          // Otros códigos de estado de error
          Swal.fire({
            icon: "error",
            title: "Error de respuesta del servidor",
            text: `${status}: ${
              data.message ||
              "Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde."
            }`,
          });
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        Swal.fire({
          icon: "error",
          title: "Error de solicitud",
          text: "No se pudo establecer conexión con el servidor. Por favor, verifica tu conexión a Internet e inténtalo de nuevo.",
        });
      } else {
        // Algo pasó al configurar la solicitud que activó un error
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.message ||
            "Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.",
        });
      }
      // Opcionalmente, puedes lanzar el error para manejarlo en otro lugar
      throw error;
    }
  };

  const subirRemisiones = async (
    numero_solicitud,
    usuario,
    Archivos,
    estado
  ) => {
    const tokenDeAcceso = token;
    try {
      const formData = new FormData();
      formData.append("usuario", usuario);
      formData.append("numero_solicitud", numero_solicitud);
      formData.append("estado", estado);
      for (const key in Archivos) {
        if (Archivos[key]) {
          formData.append(key, Archivos[key]);
        }
      }

      const response = await clienteAxios.post(
        "ventas/subir_remisiones/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );

      setModalRemisiones(false);
      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      // Puedes devolver cualquier respuesta que necesites manejar en el componente principal
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };

  const FuncionErrorToken = (error) => {
    if (error.response?.status === 401) {
      window.location.reload();
      showError("Tu token se vencio, por favor vuelve a iniciar sesión.");
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.error
    ) {
      showError(error.response.data.error);
    } else {
      showError("Ha ocurrido un error!");
    }
  };

  const ObtenerPersonal = async (token, id_cargo) => {
    try {
      console.log("id cargo ___ - _" + id_cargo);
      const jsonData = {
        id_cargo: id_cargo,
      };
      const response = await clienteAxios.post(
        "ne/obtener_personal/",
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response;
      setauxiliares(data);
      return data;
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        const { status, data } = error.response;
      }
    }
  };

  const archivosRemisionesApi = async (url) => {
    try {
      console.log(token);
      console.log(url);
      const jsonData = {
        ruta_carpeta: url,
      };
      const response = await clienteAxios.post("ventas/listar_contenido_carpeta/", 
      jsonData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setdocumentosRemisiones(response.data.archivos)
      return true;
    }catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        const { status, data } = error.response;
      }
    }
  };

  const buscarSolicitudes = async (nit, fechas) => {
    try {
      const response = await clienteAxios.post(
        "ventas/buscar_solicitudes_por_nit/",
        { nit: nit, fechas: fechas },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.lenght === 0) {
        showError(
          "No se encontraron solicitudes en estas fechas: " +
            fechas.datetime.toISOString()
        );
      } else {
        showSuccess(`Solicitudes encontradas de este cliente: ${nit}`);
        setsolicitudesBus(response.data);
      }
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
    
  };

  const crearAnunciamiento = async (nit, numero_documento, Transportadora) => {
    try {
      const response = await clienteAxios.post(
        "ventas/anunciar_llegada/",
        {
          nit: nit,
          numero_documento: numero_documento,
          transportadora: Transportadora,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.message) {
        Swal.fire({
          icon: "success",
          title: response.data.message,
          showConfirmButton: false,
          timer: 8000,
        });
        setindexAnunciamiento(0);
      } else {
        showError(`Ha ocurrido un error.`);
      }
    } catch (error) {
      const audio = new Audio("/error.mp3");
      audio.play();
      setindexAnunciamiento(0);
      console.log(error);

      if (error) {
        FuncionErrorToken(error);
      }
    }
  };

  const ListarTurnos = async () => {
    console.log("se ejecuto");
    try {
      const response = await clienteAxios.post(
        "ventas/listar_solicitudes_pantalla/",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        // Establece la nueva lista de turnos directamente con los datos recibidos
        setListaTurno(response.data);
        const audio = new Audio("/turno.mp3");
        audio.play();
      }
    } catch (error) {
      console.log(error);
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };

  const contextValue = useMemo(() => {
    return {
      solicitudesNit,
      setSolicitudesNit,
      obtenerSolicitudeNit,
      ObtenerPersonal,
      solicitudes,
      filtroGlobal,
      modalremisiones,
      subirRemisiones,
      auxiliares,
      crearSolicitud,
      crearAnunciamiento,
      obtenerSolicitudes,
      actualizarEstadoSolicitud,
      setModalRemisiones,
      documentosRemisiones,
      archivosRemisionesApi,
      buscarSolicitudes,
      solicitudesBus,
      setsolicitudesBus,

      ListaTurno,
      setListaTurno,
      ListarTurnos,
      indexAnunciamiento, setindexAnunciamiento,
    };
  }, [
    solicitudes,
    filtroGlobal,
    modalremisiones,
    solicitudesNit,
    setSolicitudesNit,
    ObtenerPersonal,
    documentosRemisiones,
    crearSolicitud,
    obtenerSolicitudes,
    actualizarEstadoSolicitud,
    setModalRemisiones,
    subirRemisiones,
    auxiliares,
    crearAnunciamiento,
    buscarSolicitudes,
    solicitudesBus,
    setsolicitudesBus,

    ListarTurnos,
    ListaTurno,
    setListaTurno,
    indexAnunciamiento, setindexAnunciamiento,
    archivosRemisionesApi,
    buscarSolicitudes
  ]);

  return (
    <ContextVenta.Provider value={contextValue}>
      {children}
    </ContextVenta.Provider>
  );
};

export { ContextVenta, VentasProvider };
