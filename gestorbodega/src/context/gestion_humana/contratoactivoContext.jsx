import { useState, createContext, useEffect, useMemo } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import ListaDocumentosActivo from "../../components/Gestion_Humana/documentos_activo/ListaDocumentosActivo";
import useControl from '../../hooks/useControl'
const CarpetaArctivoContextControl = createContext();

const CarpetaActivoPovider = ({ children }) => {
  const { token } = useControl();
  const [colaboradores, setColaboradores] = useState([]);
  const [errorColabActivo, seterrorColabActivo] = useState(null);
  const [logregistroActivo, setlogregistroActivo] = useState([]);
  const [colaboradoresActivo, setcolaboradoresActivo] = useState([]);
  const [respuestaCrearCarpeta, setrespuestaCrearCarpeta] = useState();
  const [respuestaAprobar, setrespuestaAprobar] = useState([""]);
  const [archivosActivo, setarchivosActivo] = useState([]);
  const [archivosInducciones, setarchivosInducciones] = useState([]);
  const [archivosOtros, setarchivosOtros] = useState([]);
  const [archivosExamenes, setarchivosExamenes] = useState([]);
  const [archivosActaEntrega, setarchivosActaEntrega] = useState([]);
  const [archivosFunciones, setarchivosFunciones] = useState([]);
  const [archivosNovedades, setarchivosNovedades] = useState([]);
  const [archivosProcesos, setarchivosProcesos] = useState([]);
  const [archivosDotaciones, setarchivosDotaciones] = useState([]);
  const [registoComentarioValor, setregistoComentarioValor] = useState([]);
  const [filtroGlobal, setfiltroGlobal] = useState("");
  const [vista, setVista] = useState(0);
  const [datosGrafica1, setdatosGrafica1] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [visibleCargarArchivos, setVisibleCargarArchivos] = useState("");
  const [visibleComentarios, setvisibleComentarios] = useState(false);
  const [visibleCargarArchivosNuevos, setvisibleCargarArchivosNuevos] =
    useState(false);
  const [notificacionDocActivos, setNotificacionDocActivos] = useState([]);

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
  const ListarColabActivo = async () => {
    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.get(
        "gestion_humana/listar_colaboradores_activo/",
        {
          headers: {
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      if (response.status === 401) {
        showError("tu token se vencio");
      }
      setcolaboradoresActivo(response.data);
    } catch (error) {
      if (error.response.status === 401) {
        showError("Tu token se vencio, por favor vuelve a iniciar sesión.");
      }
      console.error("Error al obtener los colaboradores:", error);
      seterrorColabActivo(
        "Error al obtener los colaboradores con carpeta documentos activo:",
        error
      );
    }
  };
  const ListarColab = async () => {
    setColaboradores();
    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.get(
        "gestion_humana/listar_colaboradores/",
        {
          headers: {
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      if (response.status === 401) {
        showError("tu token se vencio");
      }
      setColaboradores(response.data);
    } catch (error) {
      FuncionErrorToken(error);
      console.error("Error al obtener los colaboradores:", error);
      // Aquí puedes manejar el error como desees, por ejemplo, mostrando una notificación al usuario.
    }
  };

  const CrearCarpetaActivo = async (datos, archivos, otros_archivos) => {
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
      Object.values(otros_archivos.archi_inducciones).forEach((archivo) => {
        formData.append("archi_inducciones[]", archivo);
      });
      Object.values(otros_archivos.archi_dotacion).forEach((archivo) => {
        formData.append("archi_dotacion[]", archivo);
      });
      Object.values(otros_archivos.archi_disciplinarios).forEach((archivo) => {
        formData.append("archi_disciplinarios[]", archivo);
      });
      Object.values(otros_archivos.archi_cartaresponsabilidad).forEach(
        (archivo) => {
          formData.append("archi_cartaresponsabilidad[]", archivo);
        }
      );
      Object.values(otros_archivos.archivos_novedades).forEach((archivo) => {
        formData.append("archivos_novedades[]", archivo);
      });
      Object.values(otros_archivos.archi_examenes).forEach((archivo) => {
        formData.append("archi_examenes[]", archivo);
      });
      Object.values(otros_archivos.archi_otros).forEach((archivo) => {
        formData.append("archi_otros[]", archivo);
      });
      Object.values(otros_archivos.archi_funciones).forEach((archivo) => {
        formData.append("archi_funciones[]", archivo);
      });
      const response = await clienteAxios.post(
        "gestion_humana/crear_carpeta_activo/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setfiltroGlobal(datos.documento);
      setrespuestaCrearCarpeta(response.status);
      ListarColab();
      datosDocumentosIngreso();
      ListarColabActivo();
    } catch (error) {
      FuncionErrorToken(error);
    }
  };
  /* Buscar archivos generales */
  const BuscarArchivosActivo = async (numeroDocumento, activar) => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.post(
        `gestion_humana/buscar_archivos_activo/`,
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
      setarchivosActivo((prevState) => ({
        ...prevState,
        ...archi,
      }));
      if(!activar) {
        showSuccess(
          `Busqueda de archivos exitosa de la carpeta contrato activo.`
        );
      }
    
    } catch (error) {
      if (error.response.status === 401) {
        showError("Tu token se vencio, por favor vuelve a iniciar sesión.");
      }
      console.error("Error al buscar archivos:", error);
      showError(error.response.data.error);
    }
  };
  /* aprobar archivos generales */
  const aprobarArchivoActivo = async (nombreArchivo, documento, user) => {
    setfiltroGlobal(documento);
    const nombre_campo = obtenerCampoEspecifico(nombreArchivo);
    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.post(
        `gestion_humana/aprobar_archivo_activo/`,
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
      ListarColabActivo();
      datosDocumentosIngreso();
      setrespuestaAprobar(response.data);
    } catch (error) {
      console.error(error);
      FuncionErrorToken(error);
    }
  };

  const eliminarArchivoActivo = async (
    nombreArchivo,
    ruta,
    documento,
    user
  ) => {
    
    const nombre_campo = obtenerCampoEspecifico(nombreArchivo);
    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.post(
        `gestion_humana/Eliminar_archivo_doc_activos/`,
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

      const newar = archivosActivo[documento].filter(
        (archivo) => archivo.nombre_archivo !== nombreArchivo
      );
      archivosActivo[documento] = newar;
      ListarColabActivo();

      showSuccess(
        `Has eliminado este archivo ${user} -> archivo: ${nombreArchivo}`
      );
      setfiltroGlobal(documento);
      datosDocumentosIngreso();
    } catch (error) {
      FuncionErrorToken(error);
    }
  };

  const subirArchivoActivo = async (
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
        `gestion_humana/nuevo_archivo_doc_activo/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      
      setVisibleCargarArchivos(false);
      setfiltroGlobal(documento);
      ListarColabActivo();
      datosDocumentosIngreso();
      BuscarArchivosActivo(documento, true);
      if(response){
      showSuccess(response.data.message); }
    } catch (error) {
      if (error){
        FuncionErrorToken(error);
      }
    }
  };
  /* Traer archivos de subcarpetas */
  const SubcarpetasArchivos = async (
    numeroDocumento,
    nombre_subcarpeta,
    activar
  ) => {
   const tokenDeAcceso = token
    try {
      const Archivos = {};
      switch (nombre_subcarpeta) {
        case "inducciones_y_reinducciones":
          if (!archivosInducciones[numeroDocumento] || activar) {
            const response = await clienteAxios.post(
              `gestion_humana/buscar_archivos_subcarpeta/`,
              {
                numero_documento: numeroDocumento,
                nombre_subcarpeta: nombre_subcarpeta,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${tokenDeAcceso}`,
                },
              }
            );
            const data = response.data;
            Archivos[numeroDocumento] = data.archivos_encontrados;
            setarchivosInducciones((prevState) => ({
              ...prevState,
              ...Archivos,
            }));
            if (!activar) {
              showSuccess(
                `Busqueda de archivos exitosa de cartas de inducciones y reinducciones.`
              );
            }
          }

          break;
        case "cartas_de_responsabilidad":
          if (!archivosActaEntrega[numeroDocumento] || activar) {
            const response = await clienteAxios.post(
              `gestion_humana/buscar_archivos_subcarpeta/`,
              {
                numero_documento: numeroDocumento,
                nombre_subcarpeta: nombre_subcarpeta,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${tokenDeAcceso}`,
                },
              }
            );
            const data = response.data;
            Archivos[numeroDocumento] = data.archivos_encontrados;
            setarchivosActaEntrega((prevState) => ({
              ...prevState,
              ...Archivos,
            }));
            if (!activar) {
              showSuccess(
                `Busqueda de archivos exitosa de cartas de responsablidad.`
              );
            }
          }

          break;
        case "dotaciones_y_epp":
          if (!archivosDotaciones[numeroDocumento] || activar) {
            const response = await clienteAxios.post(
              `gestion_humana/buscar_archivos_subcarpeta/`,
              {
                numero_documento: numeroDocumento,
                nombre_subcarpeta: nombre_subcarpeta,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${tokenDeAcceso}`,
                },
              }
            );
            const data = response.data;
            Archivos[numeroDocumento] = data.archivos_encontrados;
            setarchivosDotaciones((prevState) => ({
              ...prevState,
              ...Archivos,
            }));
            if (!activar) {
              showSuccess(`Busqueda de archivos exitosa de examenes medicos.`);
            }
          }

          break;

        case "examenes_medicos":
          if (!archivosExamenes[numeroDocumento] || activar) {
            const response = await clienteAxios.post(
              `gestion_humana/buscar_archivos_subcarpeta/`,
              {
                numero_documento: numeroDocumento,
                nombre_subcarpeta: nombre_subcarpeta,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${tokenDeAcceso}`,
                },
              }
            );
            const data = response.data;
            Archivos[numeroDocumento] = data.archivos_encontrados;
            setarchivosExamenes((prevState) => ({
              ...prevState,
              ...Archivos,
            }));
            if (!activar) {
              showSuccess(`Busqueda de archivos exitosa de examenes medicos.`);
            }
          }

          break;

        case "novedades":
          if (!archivosNovedades[numeroDocumento] || activar) {
            const response = await clienteAxios.post(
              `gestion_humana/buscar_archivos_subcarpeta/`,
              {
                numero_documento: numeroDocumento,
                nombre_subcarpeta: nombre_subcarpeta,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${tokenDeAcceso}`,
                },
              }
            );
            const data = response.data;
            Archivos[numeroDocumento] = data.archivos_encontrados;
            setarchivosNovedades((prevState) => ({
              ...prevState,
              ...Archivos,
            }));
            if (!activar) {
              showSuccess(`Busqueda de archivos exitosa de novedades.`);
            }
          }

          break;
        case "funciones_perfilcargo":
          if (!archivosFunciones[numeroDocumento] || activar) {
            const response = await clienteAxios.post(
              `gestion_humana/buscar_archivos_subcarpeta/`,
              {
                numero_documento: numeroDocumento,
                nombre_subcarpeta: nombre_subcarpeta,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${tokenDeAcceso}`,
                },
              }
            );
            const data = response.data;
            Archivos[numeroDocumento] = data.archivos_encontrados;

            setarchivosFunciones((prevState) => ({
              ...prevState,
              ...Archivos,
            }));
            if (!activar) {
              showSuccess(`Busqueda de archivos exitosa de funciones.`);
            }
          }

          break;
        case "otros":
          if (!archivosOtros[numeroDocumento] || activar) {
            const response = await clienteAxios.post(
              `gestion_humana/buscar_archivos_subcarpeta/`,
              {
                numero_documento: numeroDocumento,
                nombre_subcarpeta: nombre_subcarpeta,
              },
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
            if (!activar) {
              showSuccess(`Busqueda de archivos exitosa de otros archivos.`);
            }
          }

          break;

        case "procesos_disciplinarios":
          if (!archivosProcesos[numeroDocumento] || activar) {
            const response = await clienteAxios.post(
              `gestion_humana/buscar_archivos_subcarpeta/`,
              {
                numero_documento: numeroDocumento,
                nombre_subcarpeta: nombre_subcarpeta,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${tokenDeAcceso}`,
                },
              }
            );
            const data = response.data;
            Archivos[numeroDocumento] = data.archivos_encontrados;
            setarchivosProcesos((prevState) => ({
              ...prevState,
              ...Archivos,
            }));
            if (!activar) {
              showSuccess(
                `Busqueda de archivos procesos disciplinarios exitosa .`
              );
            }
          }
          break;
        // Agrega más casos según sea necesario
        default:
          return null; // Devuelve algo por defecto si el valor de vista no coincide con ningún caso
      }
    } catch (error) {
      FuncionErrorToken(error);
      console.error("Error al buscar archivos:", error);
    }
  };

  const eliminarArchivoSubcarpeta = async (
    nombreArchivo,
    documento,
    user,
    nombre_subcarpeta
  ) => {
    const campo = obtenerCampoEspecifico2(nombre_subcarpeta);
    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.post(
        `gestion_humana/eliminar_archivos_subcarpeta/`,
        {
          nombreArchivo: nombreArchivo,
          documento: documento,
          usuario: user,
          nombre_subcarpeta: nombre_subcarpeta,
          campo: campo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );

      ListarColabActivo();
      setfiltroGlobal(documento);
      const nombre = nombreArchivo;
      switch (nombre_subcarpeta) {
        case "inducciones_y_reinducciones":
          const nuevoArray = archivosInducciones[documento].filter(
            (arch) => arch.nombre_archivo !== nombre
          );
          archivosInducciones[documento] = nuevoArray;

          break;
        case "cartas_de_responsabilidad":
          const nuevoArray2 = archivosActaEntrega[documento].filter(
            (arch) => arch.nombre_archivo !== nombre
          );
          archivosActaEntrega[documento] = nuevoArray2;
          break;
        case "dotaciones_y_epp":
          const nuevoArray3 = archivosDotaciones[documento].filter(
            (arch) => arch.nombre_archivo !== nombre
          );
          archivosDotaciones[documento] = nuevoArray3;

          break;
        case "examenes_medicos":
          const nuevoArray4 = archivosExamenes[documento].filter(
            (arch) => arch.nombre_archivo !== nombre
          );
          archivosExamenes[documento] = nuevoArray4;

          break;
        case "novedades":
          const nuevoArray5 = archivosNovedades[documento].filter(
            (arch) => arch.nombre_archivo !== nombre
          );
          archivosNovedades[documento] = nuevoArray5;

          break;
        case "otros":
          const nuevoArray6 = archivosOtros[documento].filter(
            (arch) => arch.nombre_archivo !== nombre
          );
          archivosOtros[documento] = nuevoArray6;

          break;
        case "funciones_perfilcargo":
          const nuevoArray7 = archivosFunciones[documento].filter(
            (arch) => arch.nombre_archivo !== nombre
          );
          archivosFunciones[documento] = nuevoArray7;

          break;

        case "procesos_disciplinarios":
          const nuevoArray8 = archivosProcesos[documento].filter(
            (arch) => arch.nombre_archivo !== nombre
          );
          archivosProcesos[documento] = nuevoArray8;
          break;
        default:
          return null; // Devuelve algo por defecto si el valor de vista no coincide con ningún caso
      }
      showSuccess(response.data.message);
      datosDocumentosIngreso();
    } catch (error) {
      FuncionErrorToken(error);
    }
  };
  const subirArchivoSubcarpeta = async (
    documento,
    user,
    archivo,
    nombre_subcarpeta
  ) => {
    const formData = new FormData();
    formData.append("documento", documento);
    formData.append("usuario", user);
    formData.append("archivo", archivo);
    formData.append("nombre_subcarpeta", nombre_subcarpeta);

    const campo = obtenerCampoEspecifico2(nombre_subcarpeta);
    formData.append("campo", campo);
    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.post(
        `gestion_humana/nuevo_archivo_subcarpeta/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      SubcarpetasArchivos(documento, nombre_subcarpeta, true);
      ListarColabActivo();
      setfiltroGlobal(documento);
      showSuccess(response.data.message);
      datosDocumentosIngreso();
    } catch (error) {
      FuncionErrorToken(error);
    }
  };

  const ActualizarDescripcionActivos = async (
    numeroDocumento,
    usuario,
    descripcion
  ) => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.post(
        `gestion_humana/actualizar_novedad_doc_activos/`,
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
      showSuccess(`${response.data.message}`);
      setfiltroGlobal(numeroDocumento);
    } catch (error) {
      console.error("Error al actualizar descripcion:", error);
      FuncionErrorToken(error);
    }
  };
  const RegistrosComentariosActivo = async () => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.get(
        `gestion_humana/registros_comentarios_activo/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setregistoComentarioValor(response.data);
    } catch (error) {
      FuncionErrorToken(error);
      console.error("Error al obtener registros:", error);
    }
  };
  const datosDocumentosIngreso = async () => {
    try {
     const tokenDeAcceso = token
      const response = await clienteAxios.get(
        `gestion_humana/datos_por_campo/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setdatosGrafica1(response.data);
    } catch (error) {
      FuncionErrorToken(error);
      console.error("Error al actualizar descripcion:", error);
    }
  };
  const LogRegistroActivo = async () => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.get(
        `gestion_humana/log_registros_activo/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );

      setlogregistroActivo(response.data);
    } catch (error) {
      console.error("Error al obtener registros:", error);
      FuncionErrorToken(error);
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
  const obtenerCampoEspecifico = (nombreArchivo) => {
    // Lista de campos en el modelo
    const campos = [
      "eps_archivo_estado",
      "arl_archivo_estado",
      "ccf_archivo_estado",
      "contratodetrabajo_archivo_estado",
      "autorizacionmanejodatos_archivo_estado",
      "acuerdoconfidencialidad_archivo_estado",
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
  const obtenerCampoEspecifico2 = (nombreArchivo) => {
    // Lista de campos en el modelo
    switch (nombreArchivo) {
      case "cartas_de_responsabilidad":
        return "cartaresponsabilidad_num_archivos";
      case "examenes_medicos":
        return "examenesmedicos_num_archivos";
      case "inducciones_y_reinducciones":
        return "inducciones_num_archivos";
      case "novedades":
        return "novedades_num_archivos";
      case "otros":
        return "otro_num_archivos";
      case "procesos_disciplinarios":
        return "procesosdiciplinarios_num_archivos";
      case "dotaciones_y_epp":
        return "dotacion_num_archivos";
      case "funciones_perfilcargo":
        return "funciones_num_archivos";
      default:
        return null;
    }
    // Iterr sobre los campos para verificar si el nombreArchivo coincide
  };
  const RegistrosNotificacionActivo = async () => {
   const tokenDeAcceso = token
    try {
      const response = await clienteAxios.get(
        `gestion_humana/registros_notificacion_activo/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAcceso}`,
          },
        }
      );
      setNotificacionDocActivos(response.data);
    } catch (error) {
      console.error("Error al obtener registros:", error);
      showError(error.response.data.error);
    }
  };

  const contextValue = useMemo(() => {
    return {
      eliminarArchivoActivo,
      ListarColabActivo,
      ListarColab,
      aprobarArchivoActivo,
      CrearCarpetaActivo,
      BuscarArchivosActivo,
      subirArchivoActivo,
      SubcarpetasArchivos,
      setVisibleCargarArchivos,
      setarchivosInducciones,
      setBusqueda,
      setfiltroGlobal,
      setrespuestaCrearCarpeta,
      setarchivosActivo,
      setVista,
      setarchivosProcesos,
      setarchivosNovedades,
      setarchivosActaEntrega,
      setarchivosExamenes,
      setarchivosOtros,
      setarchivosDotaciones,
      eliminarArchivoSubcarpeta,
      subirArchivoSubcarpeta,
      setvisibleCargarArchivosNuevos,
      ActualizarDescripcionActivos,
      setvisibleComentarios,
      setregistoComentarioValor,
      RegistrosComentariosActivo,
      datosDocumentosIngreso,
      setdatosGrafica1,
      setlogregistroActivo,
      LogRegistroActivo,
      setarchivosFunciones,
      RegistrosNotificacionActivo,
      setNotificacionDocActivos,
      notificacionDocActivos,
      archivosFunciones,
      logregistroActivo,
      datosGrafica1,
      registoComentarioValor,
      visibleComentarios,
      visibleCargarArchivosNuevos,
      vista,
      archivosProcesos,
      archivosNovedades,
      archivosActaEntrega,
      archivosExamenes,
      archivosOtros,
      archivosDotaciones,
      archivosInducciones,
      visibleCargarArchivos,
      filtroGlobal,
      respuestaAprobar,
      colaboradores,
      respuestaCrearCarpeta,
      colaboradoresActivo,
      errorColabActivo,
      archivosActivo,
      busqueda,
    };
  }, [
    setarchivosInducciones,
    subirArchivoActivo,
    setVisibleCargarArchivos,
    eliminarArchivoActivo,
    setfiltroGlobal,
    setarchivosActivo,
    ListarColabActivo,
    ListarColab,
    aprobarArchivoActivo,
    CrearCarpetaActivo,
    BuscarArchivosActivo,
    setBusqueda,
    setrespuestaCrearCarpeta,
    setVista,
    SubcarpetasArchivos,
    setarchivosProcesos,
    setarchivosNovedades,
    setarchivosOtros,
    setarchivosDotaciones,
    setarchivosExamenes,
    eliminarArchivoSubcarpeta,
    subirArchivoSubcarpeta,
    setvisibleCargarArchivosNuevos,
    ActualizarDescripcionActivos,
    setvisibleComentarios,
    setregistoComentarioValor,
    RegistrosComentariosActivo,
    datosDocumentosIngreso,
    setdatosGrafica1,
    setlogregistroActivo,
    LogRegistroActivo,
    setarchivosFunciones,
    RegistrosNotificacionActivo,
    setNotificacionDocActivos,
    notificacionDocActivos,
    archivosFunciones,
    datosGrafica1,
    logregistroActivo,
    registoComentarioValor,
    visibleComentarios,
    visibleCargarArchivosNuevos,
    vista,
    archivosProcesos,
    archivosNovedades,
    archivosOtros,
    archivosDotaciones,
    archivosExamenes,
    archivosInducciones,
    visibleCargarArchivos,
    respuestaAprobar,
    busqueda,
    filtroGlobal,
    colaboradores,
    colaboradoresActivo,
    respuestaCrearCarpeta,
    errorColabActivo,
    archivosActivo,
  ]);

  return (
    <CarpetaArctivoContextControl.Provider value={contextValue}>
      {children}
    </CarpetaArctivoContextControl.Provider>
  );
};

export { CarpetaArctivoContextControl, CarpetaActivoPovider };
