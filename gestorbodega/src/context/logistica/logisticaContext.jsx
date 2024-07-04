import { useState, createContext, useMemo } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";
import { format } from "date-fns";

const ContextLogistico = createContext();

const LogisticaProvider = ({ children }) => {
  const { usuario } = useControl();
  const [conductores, setconductores] = useState({});
  const [vehiculos, setvehiculos] = useState({});
  const [archivos, setarchivos] = useState({});
  const [almacenes, setalmacenes] = useState({});
  const [solicitudes, setSolicitudes] = useState({});

  const getCurrentDateTime = () => {
    const now = new Date();
    // Formato: YYYY-MM-DD HH:MM:SS
    const formattedDate = format(now, "yyyy-MM-dd HH:mm:ss");
    return formattedDate;
  };

  const crearConductor = async (data, token) => {
    try {
      const formData = new FormData();
      formData.append("numero_documento", data.numero_documento);
      formData.append("categoria_autorizada", data.categoria_autorizada);
      formData.append("nombres", data.nombres);
      formData.append("apellidos", data.apellidos);
      formData.append("tipo_de_documento", data.tipo_de_documento);
      formData.append("vigencia", data.vigencia);
      formData.append("docCedula", data.docCedula);
      formData.append("docLicencia", data.docLicencia);
      formData.append("docParafiscales", data.docParafiscales);
      formData.append("creado_por", usuario);
      const result = await Swal.fire({
        title: `¿Esta seguro de crear a ${data.nombres} ${data.apellidos}?`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
      });
      if (result.isConfirmed) {
        const response = await clienteAxios.post(
          "logistica/conductores/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          return Swal.fire({
            icon: "error",
            title: "Hubo un error" + { response },
          });
        }

        if (response.status == 200) {
          Swal.fire({
            title: "Muy bien",
            text: "Conductor registrado con exito",
            icon: "success",
          });
          return true;
        }
      }
    } catch (error) {
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
          window.location.reload();
        });
      }
    }
  };

  const crearVehiculo = async (data, token) => {
    try {
      const formData = new FormData();
      formData.append("placa", data.placa);
      formData.append("fecha_vencimiento_soat", data.fecha_vencimiento_soat);
      formData.append(
        "fecha_vencimiento_impuesto",
        data.fecha_vencimiento_impuesto
      );
      formData.append(
        "fecha_vencimiento_tecnico_mecanica",
        data.fecha_vencimiento_tecnico_mecanica
      );
      formData.append(
        "numero_licencia_transito",
        data.numero_licencia_transito
      );
      formData.append("docSoat", data.docSoat);
      formData.append("docTenicomecanica", data.docTenicomecanica);
      formData.append("docLicencia", data.docLicencia);
      formData.append("docLicenciadetransito", data.docLicenciadetransito);
      formData.append("creado_por", usuario);
      const result = await Swal.fire({
        title: `¿Esta seguro de registrar el vehiculo con placas ${data.placa}?`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
      });
      if (result.isConfirmed) {
        const response = await clienteAxios.post(
          "logistica/vehiculos/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          return Swal.fire({
            icon: "error",
            title: "Hubo un error" + { response },
          });
        }

        if (response.status == 200) {
          Swal.fire({
            title: "Muy bien",
            text: "Vehiculo registrado con exito",
            icon: "success",
          });
          return true;
        }
      }
    } catch (error) {
      if (error.request.status === 409) {
        Swal.fire({
          icon: "error",
          title: "¡Vehículo ya registrado!",
          text: "El vehículo que intentas registrar ya existe en el sistema. Por favor, verifica la placa y asegúrate de que no esté duplicada.",
          confirmButtonColor: "#ff0033",
          cancelButtonColor: "#ff0033",
          confirmButtonText: "Ok",
        });
        return false;
      }
      if (error.request.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor " + error.response.data.error,
          text: "Error en la peticion",
        });
        return false;
      }
      if (error.request.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Sesión Finalizada",
          text: error.message,
        }).then(() => {
          // Recargar la página
          window.location.reload();
        });
        return false;
      }
      return false;
    }
  };

  const obtenerConductores = async (token) => {
    try {
      const response = await clienteAxios.get(
        "logistica/obtener-conductores/",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      if (response.status !== 200) {
        return false;
      } else {
        setconductores(data);
        return data;
      }
    } catch (error) {
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
          window.location.reload();
        });
      }
    }
  };

  const obtenerVehiculos = async (token) => {
    try {
      const response = await clienteAxios.get("logistica/obtener-vehiculos/", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      if (response.status !== 200) {
        return false;
      } else {
        setvehiculos(data);
        return data;
      }
    } catch (error) {
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
          window.location.reload();
        });
      }
    }
  };

  const obtenerArchivos = async (token, numero_de_documento) => {
    try {
      const datos = {
        numero_documento: numero_de_documento,
      };
      const response = await clienteAxios.post(
        "logistica/buscar_archivos/",
        datos,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setarchivos(data);
      return true;
    } catch (error) {
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
          window.location.reload();
        });
      }
    }
  };

  const obtenerArchivosPlaca = async (token, placa) => {
    try {
      const datos = {
        placa: placa,
      };
      const response = await clienteAxios.post(
        "logistica/buscar_archivos_placa/",
        datos,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setarchivos(data);
      return true;
    } catch (error) {
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
          window.location.reload();
        });
      }
    }
  };

  const obtenerAlmacenes = async (token) => {
    try {
      const response = await clienteAxios.get("logistica/obtener-almacenes/", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setalmacenes(data);
      return data;
    } catch (error) {
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
          window.location.reload();
        });
      }
    }
  };

  const enviarCorreo = async (token, cedula, placa, almacen) => {
    try {
      const datos = {
        placa: placa,
        cedula: cedula,
        correo: almacen,
      };
      const response = await clienteAxios.post(
        "logistica/enviar-correo/",
        datos,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        return Swal.fire({
          icon: "error",
          title: "Hubo un error" + { response },
        });
      }

      if (response.status == 200) {
        Swal.fire({
          title: "Muy bien",
          text: "Correo enviado",
          icon: "success",
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
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
          window.location.reload();
        });
      }
      if (error.request.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Error Interno del Servidor",
          text: "Se ha producido un error inesperado en el servidor. Por favor, intente nuevamente más tarde o contacte a nuestro equipo de soporte.",
        }).then(() => {
          // Opcional: Redireccionar a una página de error o realizar otra acción
        });
      }
    }
  };

  const actualizarConductor = async (
    datosctualizados,
    id_conductor,
    token,
    usuario
  ) => {
    try {
      const formData = new FormData();
      for (const key in datosctualizados) {
        if (datosctualizados.hasOwnProperty(key)) {
          formData.append(key, datosctualizados[key]);
        }
      }
      const fechaActual = getCurrentDateTime();
      formData.append("fecha_actualizacion", fechaActual);
      formData.append("actualizado_por", usuario);
      const url = "logistica/actualizar-conductor/" + id_conductor + "/";
      const response = await clienteAxios.patch(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status == 200) {
        Swal.fire({
          title: "¡Actualización de conductor completada!",
          text: "Actualización realizada correctamente",
          icon: "success",
        });
        return true;
      }
    } catch (error) {
      if (error.message == "Network Error") {
        Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor ",
          text: error.message,
        });
        return false;
      }
      if (error.request.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Sesión Finalizada",
          text: error.message,
        }).then(() => {
          window.location.reload();
        });
        return false;
      }
    }
  };

  const actualizarVehiculo = async (datosctualizados, id_vehiculo, token) => {
    try {
      const formData = new FormData();
      for (const key in datosctualizados) {
        if (datosctualizados.hasOwnProperty(key)) {
          formData.append(key, datosctualizados[key]);
        }
      }
      const fechaActual = getCurrentDateTime();
      formData.append("fecha_actualizacion", fechaActual);
      formData.append("actualizado_por", usuario);
      const url = "logistica/actualizar-vehiculo/" + id_vehiculo + "/";
      const response = await clienteAxios.patch(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status == 200) {
        Swal.fire({
          title: "¡Actualización del vehiculo completada!",
          text: "Actualización realizada correctamente",
          icon: "success",
        });
        return true;
      }
    } catch (error) {
      if (error.message == "Network Error") {
        Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor ",
          text: error.message,
        });
        return false;
      }
      if (error.request.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Sesión Finalizada",
          text: error.message,
        }).then(() => {
          window.location.reload();
        });
        return false;
      }
    }
  };

  const eliminarConductor = async (id_conductor, token) => {
    try {
      const fechaActual = getCurrentDateTime();
      const data = {
        fecha_eliminacion: fechaActual,
        eliminado_por: usuario,
      };

      const url = "logistica/eliminar-conductor/" + id_conductor + "/";
      const response = await clienteAxios.delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      });
      if (response.status == 204) {
        Swal.fire({
          title: "Conductor eliminado correctamente",
          text: "Eliminación realizada correctamente",
          icon: "success",
        });
        return true;
      }
    } catch (error) {
      if (error.message == "Network Error") {
        Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor ",
          text: error.message,
        });
        return false;
      }
      if (error.request.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Sesión Finalizada",
          text: error.message,
        }).then(() => {
          window.location.reload();
        });
        return false;
      }
    }
  };

  const eliminarVehiculo = async (id_vehiculo, token) => {
    try {
      const fechaActual = getCurrentDateTime();
      const data = {
        fecha_eliminacion: fechaActual,
        eliminado_por: usuario,
      };
      const url = "logistica/eliminar-vehiculo/" + id_vehiculo + "/";
      const response = await clienteAxios.delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      });
      if (response.status == 204) {
        Swal.fire({
          title: "Vehiculo eliminado correctamente",
          text: "Eliminación realizada correctamente",
          icon: "success",
        });
        return true;
      }
    } catch (error) {
      if (error.message == "Network Error") {
        Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor ",
          text: error.message,
        });
        return false;
      }
      if (error.request.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Sesión Finalizada",
          text: error.message,
        }).then(() => {
          window.location.reload();
        });
        return false;
      }
    }
  }; 

  const contextValue = useMemo(() => {
    return {
      crearConductor,
      crearVehiculo,
      obtenerConductores,
      obtenerVehiculos,
      obtenerArchivos,
      obtenerAlmacenes,
      enviarCorreo,
      obtenerArchivosPlaca,
      actualizarConductor,
      eliminarConductor,
      actualizarVehiculo,
      eliminarVehiculo,
      conductores,
      vehiculos,
      archivos,
    };
  }, [
    crearConductor,
    crearVehiculo,
    obtenerConductores,
    obtenerVehiculos,
    obtenerArchivos,
    obtenerAlmacenes,
    enviarCorreo,
    obtenerArchivosPlaca,
    actualizarConductor,
    eliminarConductor,
    actualizarVehiculo,
    eliminarVehiculo,
    conductores,
    vehiculos,
    archivos,
  ]);

  return (
    <ContextLogistico.Provider value={contextValue}>
      {children}
    </ContextLogistico.Provider>
  );
};

export { ContextLogistico, LogisticaProvider };
