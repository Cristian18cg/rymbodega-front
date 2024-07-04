import { useState, createContext, useEffect, useMemo } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";
const ComprasContextControl = createContext();

const ComprasPovider = ({ children }) => {
  const { token } = useControl();
  const [archivosProveedor, setarchivosProveedor] = useState([]);
  const [archivosOtros, setarchivosOtros] = useState([]);
  const [archivosObsoletos, setarchivosObsoletos] = useState([]);
  const [resCrearCarpeta, setresCrearCarpeta] = useState("");
  const [ListadoProveedores, setListadoProveedores] = useState("");
  const [filtroGlobalCompras, setfiltroGlobalCompras] = useState("");
  const [vistatabla, setvistatabla] = useState(0);
  const [visibleNovedades, setvisibleNovedades] = useState(false);
  const [visibleCargarArchivos, setvisibleCargarArchivos] = useState(false);
  const [visibleCargarOtros, setvisibleCargarOtros] = useState(false);
  const [visibleActualizarArchivos, setvisibleActualizarArchivos] =
    useState(false);
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
  const CrearCarpetaProveedor = async (datos, archivos, otrosArchivos) => {
    const tokenDeAcceso = token;
    try {
      const formData = new FormData();
      formData.append("nombre", datos.nombre);
      formData.append("documento", datos.documento);
      formData.append("tipo_proveedor", datos.tipoProveedor);
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
        "compras/crear_carpeta_proveedor/",
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
      listarProveedores();
      setfiltroGlobalCompras(datos.documento);
      setresCrearCarpeta(200);
      /* datosDocumentosIngreso(); */
      // Puedes devolver cualquier respuesta que necesites manejar en el componente principal
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Funcion de subir archivos principales faltantes */
  const subirArchivo = async (
    nombreArchivo,
    documento,
    user,
    archivo,
    NombreProveedor,
    numero_carpeta
  ) => {
    const formData = new FormData();
    formData.append("nombreArchivo", nombreArchivo);
    formData.append("documento", documento);
    formData.append("usuario", user);
    formData.append("numeroCarpeta", numero_carpeta);
    formData.append(nombreArchivo, archivo);

    try {
      const tokenDeAcceso = token;
      const response = await clienteAxios.post(
        `compras/nuevo_archivo/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );

      switch (numero_carpeta) {
        case 0:
          BuscarArchivos(documento, NombreProveedor, 0);
          listarProveedores();
          setvisibleCargarArchivos(false);
          break;
        case 1:
          BuscarArchivos(documento, NombreProveedor, 1);
          setvisibleCargarOtros(false);
          break;
      }
      showSuccess(response.data.message);
      setfiltroGlobalCompras(documento);
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Funcion de actualizar archivos */
  const actualizarArchivo = async (
    field,
    documento,
    user,
    archivo,
    NombreProveedor
  ) => {
    const formData = new FormData();
    formData.append("nombreArchivo", field.nombre_archivo);
    formData.append("urlArchivo", field.ruta_completa);
    formData.append("documento", documento);
    formData.append("usuario", user);
    formData.append("nuevoArchivo", archivo);
    try {
      const tokenDeAcceso = token;
      const response = await clienteAxios.post(
        `compras/actualizar_archivo/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      BuscarArchivos(documento, NombreProveedor, 0);
      BuscarArchivos(documento, NombreProveedor, 2);
      showSuccess(response.data.message);
      setvisibleActualizarArchivos(false);
      setfiltroGlobalCompras(documento);
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Funcion para traer archivos principales */
  const BuscarArchivos = async (
    numeroDocumento,
    nombreproveedor,
    numero_carpeta
  ) => {
    const tokenDeAcceso = token;
    try {
      const response = await clienteAxios.post(
        `compras/buscar_archivos/`,
        {
          numero_documento: numeroDocumento,
          nombreproveedor: nombreproveedor,
          numero_carpeta: numero_carpeta,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      const data = response.data;

      const archi = {};
      switch (numero_carpeta) {
        case 0:
          archi[numeroDocumento] = data.archivos_encontrados;
          setarchivosProveedor((prevState) => ({
            ...prevState,
            ...archi,
          }));
          break;
        case 1:
          archi[numeroDocumento] = data.archivos_encontrados;
          setarchivosOtros((prevState) => ({
            ...prevState,
            ...archi,
          }));
          break;
        case 2:
          archi[numeroDocumento] = data.archivos_encontrados;
          setarchivosObsoletos((prevState) => ({
            ...prevState,
            ...archi,
          }));
          break;
      }
    } catch (error) {
      console.error("Error al buscar archivos:", error);
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
    archivo,
    numero_carpeta
  ) => {
    try {
      const tokenDeAcceso = token;
      const response = await clienteAxios.post(
        `compras/Eliminar_archivo/`,
        {
          nombreArchivo: nombreArchivo,
          ruta: ruta,
          documento: documento,
          usuario: user,
          numero_carpeta: numero_carpeta,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      const nombre = archivo.nombre_archivo;
      switch (numero_carpeta) {
        case 0:
          const newar = archivosProveedor[documento].filter(
            (archivo) => archivo.nombre_archivo !== nombre
          );
          archivosProveedor[documento] = newar;
          listarProveedores();
          setfiltroGlobalCompras(documento);
          break;
        case 1:
          const newar2 = archivosOtros[documento].filter(
            (archivo) => archivo.nombre_archivo !== nombre
          );
          archivosOtros[documento] = newar2;
          setfiltroGlobalCompras("");
          setfiltroGlobalCompras(documento);
          break;
        case 2:
          const newar3 = archivosObsoletos[documento].filter(
            (archivo) => archivo.nombre_archivo !== nombre
          );
          archivosObsoletos[documento] = newar3;
          setfiltroGlobalCompras("");
          setfiltroGlobalCompras(documento);

          break;
      }
      showSuccess(response.data.message);
    } catch (error) {
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /* Funcion para actualizar descripcion */
  const ActualizarDescripcion = async (
    numeroDocumento,
    usuario,
    descripcion
  ) => {
    const tokenDeAcceso = token;
    try {
      const response = await clienteAxios.post(
        `compras/actualizar_novedad/`,
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
      setfiltroGlobalCompras(numeroDocumento);
      listarProveedores();
    } catch (error) {
      console.error("Error al actualizar descripcion:", error);
      FuncionErrorToken(error);
    }
  };
  /* Actualizar todos los nuevos comentarios */
  const RegistrosComentarios = async () => {
    const tokenDeAcceso = token;
    try {
      const response = await clienteAxios.get(
        `compras/registros_comentarios/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setcomentariosActualizacion(response.data);
    } catch (error) {
      console.error("Error al obtener registros:", error);
      if (error) {
        FuncionErrorToken(error);
      }
    }
  };
  /*funcion notificacion  */
  const Notificaciones = async () => {
    const tokenDeAcceso = token;
    try {
      const response = await clienteAxios.get(
        `compras/registros_notificacion/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setnotificaciones(response.data);
    } catch (error) {
      console.error("Error al obtener registros:", error);
      FuncionErrorToken(error);
    }
  };
  /* Funcion de graficas */
  const datosProveedores = async () => {
    try {
      const tokenDeAcceso = token;
      const response = await clienteAxios.get(
        `compras/datos_graficas/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setdatosGrafica(response.data);
    } catch (error) {
      FuncionErrorToken(error);
      console.error("Error al actualizar descripcion:", error);
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
    /* Traemos todos los registros que hay en carpeta de ingreso */
    const LogRegistroCompras = async () => {
      const tokenDeAcceso = token
       try {
         const response = await clienteAxios.get(
           `compras/log_registros_compras/`,
           {
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${tokenDeAcceso}`,
             },
           }
         );
         /* Actualizamos la variable con la respuesta */
         setlogRegistroCompras(response.data);
       } catch (error) {
         if (error) {
           FuncionErrorToken(error);
         }
       }
     };
  const ActualizarProveedor = async (data, usuario) => {
    const tokenDeAcceso = token
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
      listarProveedores()
       showSuccess(response?.data?.message);
     } catch (error) {
       if (error) {
         FuncionErrorToken(error);
       }
     }
   };
  const contextValue = useMemo(() => {
    return {
      resCrearCarpeta,
      ListadoProveedores,
      filtroGlobalCompras,
      visibleCargarArchivos,
      archivosProveedor,
      visibleActualizarArchivos,
      vistatabla,
      archivosOtros,
      archivosObsoletos,
      visibleCargarOtros,
      visibleNovedades,
      comentariosActualizacion,
      notificaciones,
      datosGrafica,
      logRegistroCompras,
     setlogRegistroCompras,
      LogRegistroCompras,
      ActualizarProveedor,
      setdatosGrafica,
      datosProveedores,
      setnotificaciones,
      Notificaciones,
      RegistrosComentarios,
      setcomentariosActualizacion,
      ActualizarDescripcion,
      setvisibleNovedades,
      setvisibleCargarOtros,
      setarchivosObsoletos,
      setarchivosOtros,
      setvistatabla,
      actualizarArchivo,
      setvisibleActualizarArchivos,
      eliminarArchivo,
      setarchivosProveedor,
      BuscarArchivos,
      subirArchivo,
      setvisibleCargarArchivos,
      setfiltroGlobalCompras,
      listarProveedores,
      setListadoProveedores,
      setresCrearCarpeta,
      CrearCarpetaProveedor,
    };
  }, [
    resCrearCarpeta,
    ListadoProveedores,
    filtroGlobalCompras,
    visibleCargarArchivos,
    archivosProveedor,
    visibleActualizarArchivos,
    vistatabla,
    archivosOtros,
    archivosObsoletos,
    visibleCargarOtros,
    visibleNovedades,
    comentariosActualizacion,
    notificaciones,
    datosGrafica,
    logRegistroCompras,
     setlogRegistroCompras,
    LogRegistroCompras,
    ActualizarProveedor,
    setdatosGrafica,
    datosProveedores,
    setnotificaciones,
    Notificaciones,
    RegistrosComentarios,
    setcomentariosActualizacion,
    setvisibleNovedades,
    setvisibleCargarOtros,
    setarchivosObsoletos,
    setarchivosOtros,
    setvistatabla,
    actualizarArchivo,
    setvisibleActualizarArchivos,
    eliminarArchivo,
    setarchivosProveedor,
    BuscarArchivos,
    subirArchivo,
    setvisibleCargarArchivos,
    setfiltroGlobalCompras,
    listarProveedores,
    setListadoProveedores,
    setresCrearCarpeta,
    CrearCarpetaProveedor,
  ]);

  return (
    <ComprasContextControl.Provider value={contextValue}>
      {children}
    </ComprasContextControl.Provider>
  );
};

export { ComprasContextControl, ComprasPovider };
