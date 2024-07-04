import { useState, createContext, useEffect, useMemo } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControlCarpetaActivo from "../../hooks/useControl_Contrato_Activo";
import useControl from '../../hooks/useControl'
const DocumentosRetiroContextControl = createContext();
const CarpetaRetiroPovider = ({ children }) => {
  const { token } = useControl();
  const [busquedaCrearCarpeta, setBbusquedaCrearCarpeta] = useState(true);
  const [colaboradoresRetiro, setcolaboradoresRetiro] = useState([]);
  const [filtroGlobalRetiro, setfiltroGlobalRetiro] = useState("");
  const [respuestaCrearCarpetaRetiro, setrespuestaCrearCarpetaRetiro] =
    useState();
  const [vistaretiro, setvistaretiro] = useState(0);
  const [respuestaAprobar, setrespuestaAprobar] = useState("");
  const [visibleCargarArchivosRetiro, setvisibleCargarArchivosRetiro] =
  useState(false);
  const [visibleCargarOtrosRetiro, setvisibleCargarOtrosRetiro] =
  useState(false);
  const [archivosOtros, setarchivosOtros] = useState([]);
  const [archivosRetiro, setarchivosRetiro] = useState([]);
  const { ListarColab } = useControlCarpetaActivo();
  const [registoComentarioValor, setregistoComentarioValor] = useState([]);
  const [visibleComentarios, setvisibleComentarios] = useState(false);
  const [logregistroRetiro, setlogregistroRetiro] = useState([]);
  const [notificacionDocRetiro, setNotificacionDocRetiro] = useState([]);

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
  const crear_carpeta_retiro = async (datos, archivos, otros_archivos) => {
   const tokenDeAcceso = token
    try {
      const formData = new FormData();
      formData.append("documento", datos.documento);
      formData.append("descripcion", datos.descripcion);
      formData.append("usuario", datos.user);
      for (const key in archivos) {
        if (archivos[key]) {
          formData.append(key, archivos[key]);
        }
      }
      Object.values(otros_archivos).forEach((archivo) => {
        formData.append("archi_otros[]", archivo);
      });

      const response = await clienteAxios.post(
        "gestion_humana/crear_carpeta_retiro/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      if (response?.status === 200) {
        setfiltroGlobalRetiro(datos.documento);
        setrespuestaCrearCarpetaRetiro(response.status);
        ListarColab();
        setBbusquedaCrearCarpeta(true);
        showSuccess(`${datos.user} se ha creó con exito la carpeta de retiro.`);
      }
      // Puedes devolver cualquier respuesta que necesites manejar en el componente principal
    } catch (error) {
      if (error.response.status === 401) {
        showError("Tu token se vencio, por favor vuelve a iniciar sesión.");
      }
      if (error.response && error.response.data && error.response.data.error) {
        showError(error.response.data.error);
      } else {
        showError("Error al conectarse al servidor.", error);
      }
    }
  };
  const ListarColabRetiro = async () => {
    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.get(
        "gestion_humana/listar_colaboradores_retiro/",
        {
          headers: {
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      if (response.status === 401) {
        showError("tu token se vencio");
      }
      setcolaboradoresRetiro(response.data);
    } catch (error) {
      console.error("Error al obtener los colaboradores:", error);
      FuncionErrorToken(error);
    }
  };
  const BuscarArchivosRetiro = async (numeroDocumento, activar) => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.post(
        `gestion_humana/buscar_archivos_retiro/`,
        { numero_documento: numeroDocumento },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      const data = response.data;
      const archi = {};
      archi[numeroDocumento] = data.archivos_encontrados;
      setarchivosRetiro((prevState) => ({
        ...prevState,
        ...archi,
      }));
      if (!activar) {
        showSuccess(`Busqueda de carpeta retiro exitosa`);
      }
    } catch (error) {
      FuncionErrorToken(error);
    }
  };
  const subirArchivoRetiro = async (
    nombreArchivo,
    documento,
    user,
    archivo
  ) => {
    const formData = new FormData();
    const Archivo = obtenerCampoEspecifico(nombreArchivo);
    formData.append("nombreArchivo", Archivo);
    formData.append("documento", documento);
    formData.append("usuario", user);
    formData.append(Archivo, archivo);

    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.post(
        `gestion_humana/nuevo_archivo_doc_retiro/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setvisibleCargarArchivosRetiro(false);
      BuscarArchivosRetiro(documento, true);
      setfiltroGlobalRetiro(documento);
      ListarColabRetiro();
      showSuccess(response?.data?.message);
    } catch (error) {
      FuncionErrorToken(error);
    }
  };
  const aprobarArchivoRetiro = async (nombreArchivo, documento, user) => {
    setfiltroGlobalRetiro(documento);
    const nombre_campo = obtenerCampoEspecifico(nombreArchivo);
    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.post(
        `gestion_humana/aprobar_archivo_retiro/`,
        {
          nombreArchivo: nombreArchivo,
          nombre_campo: nombre_campo,
          documento: documento,
          usuario: user,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      ListarColabRetiro();
      /* graficas datosDocumentosIngreso(); */
      setrespuestaAprobar(response.data);

      BuscarArchivosRetiro(documento, true);
    } catch (error) {
      FuncionErrorToken(error);
    }
  };
  const eliminarArchivoRetiro = async (
    nombreArchivo,
    ruta,
    documento,
    user,
    archivo
  ) => {
    setfiltroGlobalRetiro(documento);
    const nombre_campo = obtenerCampoEspecifico(nombreArchivo);
    try {
     const tokenDeAcceso = token
      await clienteAxios.post(
        `gestion_humana/Eliminar_archivo_doc_retiro/`,
        {
          nombreArchivo: nombreArchivo,
          ruta: ruta,
          nombre_campo: nombre_campo,
          documento: documento,
          usuario: user,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      ListarColabRetiro();
      /* GRafica  datosDocumentosIngreso(); */

      const nombre = archivo.nombre_archivo;

      const newar = archivosRetiro[documento].filter(
        (archivo) => archivo.nombre_archivo !== nombre
      );
      archivosRetiro[documento] = newar;
      showSuccess(
        `Has eliminado este archivo ${user} -> archivo: ${nombreArchivo}`
      );
    } catch (error) {
      FuncionErrorToken(error);
    }
  };
  const OtrosArchivosRetiro = async (numeroDocumento, activar) => {
   const tokenDeAcceso = token
    try {
      const Archivos = {};
      if (!archivosOtros[numeroDocumento] || activar) {
        const response = await clienteAxios.post(
          `gestion_humana/buscar_otros_archivos_retiro/`,
          { numero_documento: numeroDocumento },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenDeAcceso}`,
            },
          }
        );
        const data = response.data;
        Archivos[numeroDocumento] = data.archivos_encontrados;
        setarchivosOtros((prevState) => ({
          ...prevState,
          ...Archivos,
        }));
      }
      if (!activar) {
        showSuccess(`Busqueda de otros archivos de retiro exitosa.`);
      }
    } catch (error) {
      console.error("Error al buscar archivos:", error);
      FuncionErrorToken(error);
    }
  };
  const subirotroArchivoRetiro = async (documento, user, archivo) => {
    const formData = new FormData();

    formData.append("documento", documento);
    formData.append("usuario", user);
    formData.append("archivo", archivo);
    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.post(
        `gestion_humana/nuevo_otro_archivo_retiro/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      OtrosArchivosRetiro(documento, true);
      setfiltroGlobalRetiro(documento);
      showSuccess(response.data.message);
    } catch (error) {
      FuncionErrorToken(error);
    }
  };
  const eliminarotroArchivoRetiro = async (nombreArchivo, documento, user,archivo) => {
    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.post(
        `gestion_humana/eliminar_otro_archivo_retiro/`,
        { nombreArchivo: nombreArchivo, documento: documento, usuario: user },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      const nombre = archivo.nombre_archivo
      const nuevoArray = archivosOtros[documento].filter(
        (arch) => arch.nombre_archivo !== nombre
      );
      // Actualizar el objeto con el nuevo array filtrado
      archivosOtros[documento] = nuevoArray;
      showSuccess(response.data.message);
    } catch (error) {
      console.error(error);
      FuncionErrorToken(error);
    }
  };
  const RegistrosComentariosRetiro = async () => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.get(
        `gestion_humana/registros_comentarios_retiro/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setregistoComentarioValor(response.data);
      
    } catch (error) {
      console.error("Error al obtener registros:", error);
      FuncionErrorToken(error);
    }
  };
  const ActualizarDescripcionRetiro = async (
    numeroDocumento,
    usuario,
    descripcion
  ) => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.post(
        `gestion_humana/actualizar_novedad_doc_retiro/`,
        {
          numero_documento: numeroDocumento,
          usuario: usuario,
          descripcion: descripcion,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      showSuccess(response.data.message);
      setfiltroGlobalRetiro(numeroDocumento);
      ListarColabRetiro();

    } catch (error) {
      console.error("Error al actualizar descripcion:", error);
      FuncionErrorToken(error);
    }
  };
  const LogRegistroRetiro = async () => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.get(
        `gestion_humana/log_registros_retiro/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );

      setlogregistroRetiro(response.data);
    } catch (error) {
      FuncionErrorToken(error);
    }
  };
  const RegistrosNotificacionRetiro = async () => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.get(
        `gestion_humana/registros_notificacion_retiro/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setNotificacionDocRetiro(response.data);
    } catch (error) {
      FuncionErrorToken(error);
    }
  };
  const obtenerCampoEspecifico = (nombreArchivo) => {
    // Lista de campos en el modelo
    const campos = [
      "cartaRenuncia_archivo_estado",
      "entregaPuesto_archivo_estado",
      "pazysalvo_archivo_estado",
      "liquidacion_archivo_estado",
      "certificadoLaboraldeRetiro_archivo_estado",
      "certificadoretiroCesantias_archivo_estado",
      "entregaActivos_archivo_estado",
      "examenesMedicosdeEgreso_archivo_estado",
      "entrevistadeRetiro_archivo_estado",
      "aceptacionRenuncia_archivo_estado",
    ];
    // Iterar sobre los campos para verificar si el nombreArchivo coincide
    for (const campo of campos) {
      if (nombreArchivo.toLowerCase().includes(campo.split("_")[0])) {
        return campo;
      } else if (nombreArchivo.includes(campo.split("_")[0])) {
        return campo;
      }
    }

    // Si no coincide con ninguno, devolver null o algún valor indicativo
    return null;
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
  const contextValue = useMemo(() => {
    return {
      busquedaCrearCarpeta,
      colaboradoresRetiro,
      filtroGlobalRetiro,
      respuestaCrearCarpetaRetiro,
      visibleCargarArchivosRetiro,
      archivosRetiro,
      vistaretiro,
      respuestaAprobar,
      archivosOtros,
      visibleCargarOtrosRetiro,
      registoComentarioValor,
      visibleComentarios,
      logregistroRetiro,
      notificacionDocRetiro,
      RegistrosNotificacionRetiro,
      setNotificacionDocRetiro,
      LogRegistroRetiro,
      setlogregistroRetiro,
      setvisibleComentarios,
      ActualizarDescripcionRetiro,
      setvisibleCargarOtrosRetiro,
      RegistrosComentariosRetiro,
      eliminarotroArchivoRetiro,
      subirotroArchivoRetiro,
      OtrosArchivosRetiro,
      setarchivosOtros,
      eliminarArchivoRetiro,
      aprobarArchivoRetiro,
      setrespuestaAprobar,
      setvistaretiro,
      BuscarArchivosRetiro,
      subirArchivoRetiro,
      setarchivosRetiro,
      setvisibleCargarArchivosRetiro,
      setrespuestaCrearCarpetaRetiro,
      setfiltroGlobalRetiro,
      ListarColabRetiro,
      setcolaboradoresRetiro,
      setBbusquedaCrearCarpeta,
      crear_carpeta_retiro,
    };
  }, [
    busquedaCrearCarpeta,
    colaboradoresRetiro,
    filtroGlobalRetiro,
    respuestaCrearCarpetaRetiro,
    visibleCargarArchivosRetiro,
    archivosRetiro,
    vistaretiro,
    respuestaAprobar,
    archivosOtros,
    visibleCargarOtrosRetiro,
    registoComentarioValor,
    visibleComentarios,
    logregistroRetiro,
    notificacionDocRetiro,
    RegistrosNotificacionRetiro,
    setNotificacionDocRetiro,
    LogRegistroRetiro,
    setlogregistroRetiro,
    setvisibleComentarios,
    ActualizarDescripcionRetiro,
    RegistrosComentariosRetiro,
    subirotroArchivoRetiro,
    setvisibleCargarOtrosRetiro,
    eliminarotroArchivoRetiro,
    OtrosArchivosRetiro,
    setarchivosOtros,
    eliminarArchivoRetiro,
    aprobarArchivoRetiro,
    setrespuestaAprobar,
    BuscarArchivosRetiro,
    setvistaretiro,
    subirArchivoRetiro,
    setarchivosRetiro,
    setvisibleCargarArchivosRetiro,
    setrespuestaCrearCarpetaRetiro,
    setfiltroGlobalRetiro,
    ListarColabRetiro,
    setcolaboradoresRetiro,
    crear_carpeta_retiro,
    setBbusquedaCrearCarpeta,
  ]);
  return (
    <DocumentosRetiroContextControl.Provider value={contextValue}>
      {children}
    </DocumentosRetiroContextControl.Provider>
  );
};

export { DocumentosRetiroContextControl, CarpetaRetiroPovider };
