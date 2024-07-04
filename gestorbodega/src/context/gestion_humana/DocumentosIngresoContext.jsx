import { useState, createContext, useMemo } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControl_Contrato_Activo from "../../hooks/useControl_Contrato_Activo";
import useControl from "../../hooks/useControl";
const DocumentosIngresoContextControl = createContext();

const CarpetaIngresoPovider = ({ children }) => {
  const { token } = useControl();
  const { datosDocumentosIngreso } = useControl_Contrato_Activo();
  const [logregistroIngreso, setlogRegistroIngreso] = useState([]);
  const [ListaColaboradores, setListaColaboradores] = useState([]);
  const [ListaColaboradoresGeneral, setListaColaboradoresGeneral] = useState(
    []
  );
  const [ListaEmpleados, setListaEmpleados] = useState([]);
  const [visibleComentarios, setvisibleComentarios] = useState(false);
  const [filtoGlobalIngreso, setfiltoGlobalIngreso] = useState("");
  const [visibleCargarArchivos, setvisibleCargarArchivos] = useState(false);
  const [visibleCargarOtrosArchivos, setvisibleCargarOtrosArchivos] =
    useState(false);
  const [respuestaCrearCarpeta, setrespuestaCrearCarpeta] = useState("");

  const [badgeComentarios, setbadgeComentarios] = useState([]);
  const [notificacionDocIngreso, setNotificacionDocIngreso] = useState([]);
  const [archivosIngreso, setarchivosIngreso] = useState([]);
  const [otrosarchivosIngreso, setotrosarchivosIngreso] = useState([]);

  /* Toast de eventos con error */
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
  /* Toast de eventos con exito */
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
  /* Traemos todos los registros que hay en carpeta de ingreso */
  const LogRegistroIngreso = async () => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.get(
        `gestion_humana/log_registros_ingreso/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      /* Actualizamos la variable con la respuesta */
      setlogRegistroIngreso(response.data);
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Traemos toda la lista de colaboradores con carpeta de ingreso */
  const ListarColab = async () => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.get(
        "gestion_humana/listar_colaboradores/",
        {
          headers: {
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setListaColaboradores(response.data); // Puedes devolver cualquier respuesta que necesites manejar en el componente principal
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Funcion de actualizar descripcion de documentos de ingreso */
  const ActualizarDescripcion = async (
    numeroDocumento,
    usuario,
    descripcion
  ) => {
   const tokenDeAcceso = token
    try {
      /* Peticion de actualizar enviamos los datos necesarios */
      const response = await clienteAxios.post(
        `gestion_humana/actualizar_novedad/`,
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
      ListarColab();
      setfiltoGlobalIngreso(numeroDocumento);
      /* Mensaje de exito */
      showSuccess(response.data.message);
      setvisibleComentarios(false);
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Funcion de subir archivos principales faltantes */
  const subirArchivo = async (nombreArchivo, documento, user, archivo) => {
    const formData = new FormData();
    const Archivo = obtenerCampoEspecifico(nombreArchivo);
    formData.append("nombreArchivo", Archivo);
    formData.append("documento", documento);
    formData.append("usuario", user);
    formData.append(Archivo, archivo);

    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.post(
        `gestion_humana/nuevo_archivo/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      BuscarArchivos(documento);
      showSuccess(response.data.message);
      setvisibleCargarArchivos(false);
      ListarColab();
      setfiltoGlobalIngreso(documento);
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Funcion de crear carpeta de ingreso */
  const CrearCarpeta = async (datos, archivos, otrosArchivos) => {
   const tokenDeAcceso = token
    try {
      const formData = new FormData();
      formData.append("nombre", datos.nombre);
      formData.append("apellidos", datos.apellidos);
      formData.append("documento", datos.documento);
      formData.append("tipoDocumento", datos.tipoDocumento);
      formData.append("cargo", datos.cargo);
      formData.append("primer_empleo", datos.esPrimeraVez);
      formData.append("estadoColaborador", datos.EstadoColaborador);
      formData.append("descripcion", datos.descripcion);
      formData.append("usuario", datos.user);
      for (const key in archivos) {
        if (archivos[key]) {
          formData.append(key, archivos[key]);
        }
      }
      for (const key in otrosArchivos) {
        if (otrosArchivos[key]) {
          formData.append(key, otrosArchivos[key]);
        }
      }

      const response = await clienteAxios.post(
        "gestion_humana/crear_carpeta/",
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
        timer: 1500,
      });
      ListarColab();
      setfiltoGlobalIngreso(datos.documento);
      setrespuestaCrearCarpeta(200);
      datosDocumentosIngreso();
      // Puedes devolver cualquier respuesta que necesites manejar en el componente principal
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Actualizar todos los nuevos comentarios */
  const RegistrosComentarios = async () => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.get(
        `gestion_humana/registros_comentarios/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setbadgeComentarios(response.data);
    } catch (error) {
      console.error("Error al obtener registros:", error);
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };

  /* Funcion de buscar los archivos de ingreso */
  const BuscarArchivos = async (numeroDocumento) => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.post(
        `gestion_humana/buscar_archivos/`,
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
      setarchivosIngreso((prevState) => ({
        ...prevState,
        ...archi,
      }));
    } catch (error) {
      console.error("Error al buscar archivos:", error);
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Funcion de obtener aprobar archivos */
  const aprobarArchivo = async (nombreArchivo, documento, user) => {
    const nombre_campo = obtenerCampoEspecifico(nombreArchivo);
    try {
     const tokenDeAcceso = token
      await clienteAxios.post(
        `gestion_humana/aprobar_archivo/`,
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
      ListarColab();
      setfiltoGlobalIngreso(documento);
      showSuccess(
        `Has aprobado este archivo ${user} -> archivo: ${nombreArchivo}`
      );
      BuscarArchivos(documento);
    } catch (error) {
      console.error(error);
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Funcion de eliminar archivos de ingreso */
  const eliminarArchivo = async (
    nombreArchivo,
    ruta,
    documento,
    user,
    archivo
  ) => {
    const nombre_campo = obtenerCampoEspecifico(nombreArchivo);

    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.post(
        `gestion_humana/Eliminar_archivo/`,
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
      const nombre = archivo.nombre_archivo;

      const newar = archivosIngreso[documento].filter(
        (archivo) => archivo.nombre_archivo !== nombre
      );
      archivosIngreso[documento] = newar;

      ListarColab();
      setfiltoGlobalIngreso(documento);
      showSuccess(
        `Has eliminado este archivo ${user} -> archivo: ${archivo.nombre_archivo}`
      );
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /*funcion notificacion  */
  const RegistrosNotificacionIngreso = async () => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.get(
        `gestion_humana/registros_notificacion/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setNotificacionDocIngreso(response.data);
    } catch (error) {
      if (error.response.status === 401) {
        window.location.reload();
      }
      console.error("Error al obtener registros:", error);
      FuncionErrorToken(error);
    }
  };
  /* Buscar los archivos en subcarpeta */
  const OtrosArchivos = async (numeroDocumento, NombreCompleto, activar) => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.post(
        `gestion_humana/buscar_otros_archivos/`,
        { numero_documento: numeroDocumento },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );

      const archi = {};
      archi[numeroDocumento] = response.data.archivos_encontrados;
      setotrosarchivosIngreso((prevState) => ({
        ...prevState,
        ...archi,
      }));
      if (!activar) {
        showSuccess(`Busqueda exitosa otros archivos de: ${NombreCompleto}`);
      }
    } catch (error) {
      console.error("Error al buscar archivos:", error);
      FuncionErrorToken(error);
    }
  };
  /* Funcion de eliminar en subcarpeta de otros archivos */
  const eliminarotroArchivo = async (
    nombreArchivo,
    documento,
    user,
    archivo
  ) => {
    try {
     const tokenDeAcceso = token
      await clienteAxios.post(
        `gestion_humana/eliminar_otro_archivo/`,
        { nombreArchivo: nombreArchivo, documento: documento, usuario: user },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );

      const nombre = nombreArchivo;
      const nuevoArray = otrosarchivosIngreso[documento].filter(
        (arch) => arch.nombre_archivo !== nombre
      );

      // Actualizar el objeto con el nuevo array filtrado
      otrosarchivosIngreso[documento] = nuevoArray;
      ListarColab();
      showSuccess(`Eliminacion  exitosa de:  ${nombreArchivo}`);
    } catch (error) {
      console.error(error);
      FuncionErrorToken(error);
    }
  };
  /* Funcion de cargar mas archivos en otros  */
  const subirotroArchivo = async (documento, user, archivo) => {
    const formData = new FormData();

    formData.append("documento", documento);
    formData.append("usuario", user);
    formData.append("archivo", archivo);
    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.post(
        `gestion_humana/nuevo_otro_archivo/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      OtrosArchivos(documento, " ", true);
      showSuccess(response.data.message);
      setvisibleCargarOtrosArchivos(false);
    } catch (error) {
      FuncionErrorToken(error);
    }
  };
  /* funcion para traer todos los empleados */
  const ListarEmpleadosNacional = async (numeroDocumento) => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.post(
        `gestion_humana/lista_empleado/`,
        { numero_documento: numeroDocumento },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setListaEmpleados(response.data);
    } catch (error) {
      console.error("Error al buscar archivos:", error);
      FuncionErrorToken(error);
    }
  };

  /* Lista colaboradores general */
  const ListarColaboradoresGeneral = async () => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.get(
        "gestion_humana/listarcolaboradores/",
        {
          headers: {
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setListaColaboradoresGeneral(response.data); // Puedes devolver cualquier respuesta que necesites manejar en el componente principal
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };

  const ActualizarInfoColaboradores = async (data, usuario) => {
   const tokenDeAcceso = token
    data["usuario"] = usuario;
    try {
      const response = await clienteAxios.post(
        "gestion_humana/actualizarinfocolab/",
        data,
        {
          headers: {
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      ListarColaboradoresGeneral();
      showSuccess(response?.data?.message);
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Obtener campos especificos de la base de datos segun el archivo */
  const obtenerCampoEspecifico = (nombreArchivo) => {
    // Lista de campos en el modelo
    const campos = [
      "certificacioneslaborales_archivo_estado",
      "cedula_archivo_estado",
      "hojadevida_archivo_estado",
      "afp_archivo_estado",
      "eps_archivo_estado",
      "certificadocuenta_archivo_estado",
      "antecedentesjudiciales_archivo_estado",
      "certificacionesdeestudio_archivo_estado",
      "pruebaconocimiento_archivo_estado",
      "pruebapsicotecnicas_archivo_estado",
      "examenmedico_archivo_estado",
      "actaentrega_archivo_estado",
      "poligrafo_archivo_estado",
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
  /* Funcion de error de token general */
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
      logregistroIngreso,
      ListaColaboradores,
      visibleComentarios,
      filtoGlobalIngreso,
      visibleCargarArchivos,
      respuestaCrearCarpeta,
      badgeComentarios,
      archivosIngreso,
      notificacionDocIngreso,
      otrosarchivosIngreso,
      visibleCargarOtrosArchivos,
      ListaEmpleados,
      ListaColaboradoresGeneral,
      ActualizarInfoColaboradores,
      ListarColaboradoresGeneral,
      setListaColaboradoresGeneral,
      ListarEmpleadosNacional,
      setListaEmpleados,
      setvisibleCargarOtrosArchivos,
      subirotroArchivo,
      eliminarotroArchivo,
      setotrosarchivosIngreso,
      OtrosArchivos,
      RegistrosNotificacionIngreso,
      setNotificacionDocIngreso,
      eliminarArchivo,
      aprobarArchivo,
      setarchivosIngreso,
      BuscarArchivos,
      setbadgeComentarios,
      RegistrosComentarios,
      setrespuestaCrearCarpeta,
      CrearCarpeta,
      setvisibleCargarArchivos,
      subirArchivo,
      setfiltoGlobalIngreso,
      ActualizarDescripcion,
      setvisibleComentarios,
      setListaColaboradores,
      ListarColab,
      setlogRegistroIngreso,
      LogRegistroIngreso,
    };
  }, [
    logregistroIngreso,
    ListaColaboradores,
    visibleComentarios,
    filtoGlobalIngreso,
    visibleCargarArchivos,
    respuestaCrearCarpeta,
    badgeComentarios,
    archivosIngreso,
    notificacionDocIngreso,
    otrosarchivosIngreso,
    visibleCargarOtrosArchivos,
    ListaEmpleados,
    ListaColaboradoresGeneral,
    ActualizarInfoColaboradores,
    ListarColaboradoresGeneral,
    setListaColaboradoresGeneral,
    ListarEmpleadosNacional,
    setListaEmpleados,
    setvisibleCargarOtrosArchivos,
    subirotroArchivo,
    eliminarotroArchivo,
    setotrosarchivosIngreso,
    OtrosArchivos,
    RegistrosNotificacionIngreso,
    setNotificacionDocIngreso,
    eliminarArchivo,
    aprobarArchivo,
    setarchivosIngreso,
    BuscarArchivos,
    setbadgeComentarios,
    RegistrosComentarios,
    CrearCarpeta,
    setvisibleCargarArchivos,
    subirArchivo,
    setfiltoGlobalIngreso,
    ActualizarDescripcion,
    setvisibleComentarios,
    setListaColaboradores,
    ListarColab,
    setlogRegistroIngreso,
    LogRegistroIngreso,
  ]);

  return (
    <DocumentosIngresoContextControl.Provider value={contextValue}>
      {children}
    </DocumentosIngresoContextControl.Provider>
  );
};

export { DocumentosIngresoContextControl, CarpetaIngresoPovider };
