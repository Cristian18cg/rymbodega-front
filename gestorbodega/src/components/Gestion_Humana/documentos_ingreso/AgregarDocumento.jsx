import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { Empleado } from "../../../actions/Gestion_Humana/archivos";
import Swal from "sweetalert2";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { AutoComplete } from "primereact/autocomplete";
import { Button as PrimeButton } from "primereact/button";
import useControl from "../../../hooks/useControl";
import useControl_DocumentosIngreso from "../../../hooks/useControl_DocumentosIngreso";
import { debounce } from "lodash";
import { Message } from "primereact/message";

/* import { useHistory } from 'react-router-dom'; */

const Agregardocumento = () => {
  const { dataadicional, usuario } = useControl();
  const [infoAdicional, setinfoadicional] = useState({
    tipoDoc: [],
  });
  const [precolaborador_seleccionado, presetcolaborador_seleccionado] =
    useState(null);
  const {
    CrearCarpeta,
    respuestaCrearCarpeta,
    setrespuestaCrearCarpeta,
    ListarEmpleadosNacional,
    ListaEmpleados,
    ListarColab,
    ListaColaboradores,
  } = useControl_DocumentosIngreso();
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [documento, setDocumento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [documentoBus, setDocumentoBus] = useState("");
  const [cargo, setCargo] = useState("");
  const [esPrimeraVez, setEsPrimeraVez] =
    useState(false); /* si es su primer empleo */
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [EstadoColaborador, setestadoColaborador] = useState("");
  const [errores, setErrores] = useState({});
  const [encontrado, setEncontrado] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);
  const toast = useRef(null);
  const [archivos, setArchivos] = useState({
    cedula: null,
    hojadevida: null,
    afp: null,
    eps: null,
    certificadoCuenta: null,
    antecedentesJudiciales: null,
    certificacionesdeEstudio: null,
    examenMedico: null,
    pruebaConocimiento: null,
    pruebaPsicotecnicas: null,
    certificacionesLaborales: null,
    actaentrega: null,
    poligrafo: null,
  });
  const [Props, setProps] = useState([]);
  const fileUploadRef = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const [visibleMensaje, setvisibleMensaje] = useState(false);
  const [otros_archivos, setotros_archivos] = useState({});
  const [filtrarColab, setfiltrarColab] = useState(null);
  const [button_elegir, setbutton_elegir] = useState(true);
  const opcionesColaboradorEstado = [
    { value: "", label: "Seleccionar" },
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
    { value: "REINTEGRO", label: "Reintegro" },
  ];
  const [errorMessage, setErrorMessage] = useState(true);

  /* Inicia la pagina al cargar y reinicia filtros */
  const delayedRequest = debounce(() => {
    if (Array.isArray(ListaEmpleados) && ListaEmpleados.length === 0) {
      ListarEmpleadosNacional();
    }

    if (Array.isArray(ListaColaboradores) && ListaColaboradores.length === 0) {
      ListarColab();
    }
  }, 500)
  useEffect(() => {
    delayedRequest()
  }, []);
  useEffect(() => {
    setinfoadicional(dataadicional);
  }, [infoAdicional]);

  useEffect(() => {
    if (respuestaCrearCarpeta === 200) {
      presetcolaborador_seleccionado("");
      setNombre("");
      setestadoColaborador("");
      setApellidos("");
      setDocumento("");
      setTipoDocumento("");
      setArchivos("");
      setCargo("");
      setEsPrimeraVez(false);
      setDocumentoBus("");
      setTotalSize(0);
      setDescripcion("");
      setEncontrado(false);
      setotros_archivos("");
      const camposArchivo = document.querySelectorAll('input[type="file"]');
      camposArchivo.forEach((campo) => {
        campo.value = "";
      });

      const boton = document.querySelector(".custom-cancel-btn");
      if (boton) {
        boton.click(); // Desencadena un evento de clic en el botón
      } else {
        console.error("El botón no se encontró en el DOM.");
      }
      window.scrollTo(0, 0);
      // Manejar éxito, redireccionar o mostrar un mensaje de éxito
      setrespuestaCrearCarpeta("");
    }
  }, [respuestaCrearCarpeta]);

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
  /* Toast de mensajes fallidos */
  const showError = (error) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
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
  /* Buscar colaboradores */
  const search = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filtrarColab;
      if (!event.query.trim().length || filtrarColab === null) {
        // Si el evento de búsqueda está vacío o no se ha seleccionado ningún filtro
        _filtrarColab = ListaEmpleados.filter((empleado) => {
          if (
            empleado.documento_identificacion &&
            typeof empleado.documento_identificacion === "string"
          ) {
            // Verificar si el documento_identificacion del empleado no existe en ListaColaboradores
            const docIdentificacion = empleado.documento_identificacion;
            const empleadoExiste = ListaColaboradores.some(
              (colaborador) =>
                colaborador.numero_documento === docIdentificacion
            );
            return !empleadoExiste;
          }
          return false;
        });
      } else {
        // Si hay un término de búsqueda y se ha seleccionado un filtro
        _filtrarColab = ListaEmpleados.filter((empleado) => {
          if (
            empleado.documento_identificacion &&
            typeof empleado.documento_identificacion === "string"
          ) {
            // Verificar si el documento_identificacion del empleado comienza con el valor proporcionado
            const docIdentificacion = empleado.documento_identificacion;
            const query = event.query.toLowerCase();

            // Filtrar solo si no existe un colaborador con el mismo documento en ListaColaboradores
            const empleadoExiste = ListaColaboradores.some(
              (colaborador) =>
                colaborador.numero_documento === docIdentificacion
            );
            return (
              empleado.documento_identificacion.startsWith(query) &&
              !empleadoExiste
            );
          }
          return false;
        });
      }
      setfiltrarColab(_filtrarColab);
    }, 250);
  };
  /* Valida si ya tiene creado carpeta de ingreso */
  const validar = (valor) => {
    presetcolaborador_seleccionado(valor);
    let _validar = ListaEmpleados.filter((empleado) => {
      if (
        empleado.documento_identificacion &&
        typeof empleado.documento_identificacion === "string"
      ) {
        // Verificar si el documento_identificacion del empleado comienza con el valor proporcionado
        return empleado.documento_identificacion.startsWith(
          valor.documento_identificacion
        );
      }
      return false;
    });
    if (_validar.length === 1 && typeof valor === "object" && valor !== null) {
      setbutton_elegir(false);
      setDocumento(valor.documento_identificacion);
      setNombre(valor.nombre_empleado.replace(/�/g, "Ñ"));
      setCargo(valor.descripcion_cargo.replace(/�/g, "Ñ"));
      setApellidos(valor.apellido_empleado.replace(/�/g, "Ñ"));
      setEncontrado(true);
      setestadoColaborador(valor.estado_empleado);
      setErrorMessage(null);
    } else {
      setbutton_elegir(true);
      if (_validar.length !== 1) {
        setErrorMessage("Selecciona una de las opciones.");
      } else {
        setErrorMessage("El valor ingresado no corresponde a un colaborador.");
      }
    }
  };
  const limpiar = () => {
    setfiltrarColab(null);
    presetcolaborador_seleccionado("");
    setApellidos("");
    setNombre("");
    setCargo("");
    setDocumento("");
    setDocumentoBus("");
    setEncontrado(false);
    setestadoColaborador("");
    setTipoDocumento("");
  };

  /* Template de las opciones de empleado */
  const itemTemplate2 = (item) => {
    return (
      <div className="flex align-items-center">
        <div>
          <p>
            <strong>Numero de documento:</strong>{" "}
            {item.documento_identificacion}<br /> <strong>Nombre:</strong>{" "}
            {item.nombre_empleado} {item.apellido_empleado}
            <br /> <strong>Cargo:</strong> {item.descripcion_cargo}
          </p>
        </div>
      </div>
    );
  };

  const handleArchivoChange = (index, event) => {
    const newArchivos = { ...archivos }; // Crear una copia del objeto archivos
    newArchivos[index] = event.target.files[0]; // Modificar la copia
    setArchivos(newArchivos); // Actualizar el estado con la copia modificada
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    // Validar campos
    const erroresTemp = {};
    // Validar nombre
    if (!cargo.trim()) {
      erroresTemp.cargo = "El cargo es requerido";
    }
    if (!nombre.trim()) {
      erroresTemp.nombre = "El nombre es requerido";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
      erroresTemp.nombre = "El nombre solo puede contener letras";
    }
    // Validar apellidos
    if (!apellidos.trim()) {
      erroresTemp.apellidos = "Los apellidos son requeridos";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(apellidos)) {
      erroresTemp.apellidos = "Los apellidos solo pueden contener letras";
    }
    // Validar documento
    if (!documento.trim()) {
      erroresTemp.documento = "El documento es requerido";
    } else if (documento.length < 6 || documento.length > 15) {
      erroresTemp.documento = "El documento debe tener entre 6 y 15 numeros";
    }
    if (!tipoDocumento.trim()) {
      erroresTemp.tipoDocumento = "El tipo de documento es requerido";
    }
    if (!EstadoColaborador.trim()) {
      erroresTemp.estadoColaborador = "El estado del colaborador es requerido";
    }

    setErrores(erroresTemp); //asignamos los mensajes al error temporal
    if (form.checkValidity() === false || Object.keys(erroresTemp).length > 0) {
      // Si hay errores, no se envía el formulario.
      showError(
        `No se ha podido crear el colaborador debido a errores en los campos o campos incompletos.`
      );

      event.stopPropagation();
      setValidated(true);
      return;
    }
    if (totalSize === 0) {
      setotros_archivos({});
    }
    try {
      const user = usuario;
      CrearCarpeta(
        {
          nombre,
          apellidos,
          documento,
          tipoDocumento,
          EstadoColaborador,
          user,
          esPrimeraVez,
          cargo,
          descripcion,
        },
        archivos,
        otros_archivos
      );
    } catch (error) {
      window.scrollTo(0, 0);
      showError("Ah ocurrido un error al crear la carpeta: \n" + error);
      // Manejar errores de solicitud
      console.error("Error al guardar datos y archivos:", error);
      // Manejar el error en el componente principal si es necesario
    }
  };

  const onTemplateRemove = (file, callback) => {
    // Crear un nuevo objeto sin el archivo que deseamos eliminar
    const nuevosOtrosArchivos = { ...otros_archivos };
    delete nuevosOtrosArchivos[file.name];

    // Actualizar el estado con el nuevo objeto de otros archivos
    setotros_archivos(nuevosOtrosArchivos);
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onTemplateSelect = (e) => {
    const archivo = e.files[e.files.length - 1];
    const archivoNombre = archivo.name;

    if (archivo.type === "application/pdf") {
      // Verificar si el nombre del archivo ya está presente en otros_archivos

      if (otros_archivos.hasOwnProperty(archivoNombre)) {
        showError(`El archivo ya ha sido cargado previamente.`);
      } else {
        // Calcular el nuevo tamaño total sumando el tamaño de los archivos existentes
        let nuevoTotalSize = totalSize + archivo.size;

        // Verificar si el nuevo tamaño excede el límite
        if (nuevoTotalSize > 10240000) {
          showError(
            `El archivo "${archivoNombre}" excede el tamaño máximo permitido.`
          );
        } else {
          // Crear una copia del objeto otros_archivos y agregar el nuevo archivo
          const newotrosArchivos = { ...otros_archivos };
          newotrosArchivos[archivoNombre] = archivo;
          setotros_archivos(newotrosArchivos);
          // Mostrar mensaje de éxito
          showSuccess(`Se ha subido a otros archivos: ${archivoNombre}`);
          setTotalSize(nuevoTotalSize);
        }
      }
    } else {
      // Mostrar error si el archivo no es un PDF
      showError(
        `${usuario} -> ${archivoNombre} no es un archivo PDF, no será cargado. \n Elimina y vuelve a cargar un archivo ".pdf " por favor.`
      );
    }
  };
  const onTemplateUpload = (e) => {
    let _totalSize = 0;
    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
  };
  const onTemplateClear = () => {
    setotros_archivos([]);
    setTotalSize(0);
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;
    const value = totalSize / 100000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}

        {cancelButton}
        <div className="flex align-items-center gap-3 ml-4">
          <span>{formatedValue} / 10 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };
  const itemTemplate = (file, props) => {
    return (
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <div className="d-flex align-items-center" style={{ width: "40%" }}>
          <i
            className="pi pi-file-pdf p-3"
            style={{ color: "red", fontSize: "1em" }}
          ></i>
          <span className="flex flex-column text-left ml-4">
            {file.name}
            <small style={{ marginLeft: "6px" }}>
              {new Date().toLocaleDateString()}
            </small>
          </span>
        </div>
        <div className="d-flex align-items-center">
          <Tag
            value={props.formatSize}
            severity="warning"
            className="px-3 py-2"
          />
          <PrimeButton
            type="button"
            icon="pi pi-times"
            className="p-button-outlined p-button-rounded p-button-danger ml-2"
            onClick={() => {
              onTemplateRemove(file, props.onRemove);
            }}
          />
        </div>
      </div>
    );
  };
  const emptyTemplate = (event) => {
    return (
      <div className="align-items-center flex-column  justify-content-center">
        <i
          className="pi pi-file-pdf p-3"
          style={{
            fontSize: "3em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1em", color: "var(--text-color-secondary)" }}
          className="mx-2 "
        >
          Arrastra un archivo aquí para cargarlo. Solo puedes cargar un archivo
          a la vez.
        </span>
      </div>
    );
  };
  const chooseOptions = {
    icon: "pi pi-fw pi-file-pdf",
    iconOnly: true,
    className: "custom-choose-btn",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-upload",
    iconOnly: true,
    className: "custom-upload-btn",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className: "custom-cancel-btn",
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-1  mx-md-5 mx-lg-5 mx-1 mb-2">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {visibleMensaje && (
          <Message
            className="mb-2"
            style={{ fontSize: "14px" }}
            text="*Si el colaborador ya está en la base de datos, puedes ingresar su número de documento para autocompletar los campos.*"
          />
        )}
        <Card className=" d-flex align-items-center card-gestion ">
          <Card.Header className=" mb-1  card-gestion-header">
            <h4>
              <strong>Formulario creación colaborador</strong>
            </h4>
          </Card.Header>

          <Card.Body className="border-top card-gestion-body mb-2">
            <Row className=" mb-3 ml-4">
              <Col xs={12} md={10} lg={10} className="mb-3">
                <AutoComplete
                  placeholder="Escribe un numero de documento"
                  className="autocompletecrear w-100"
                  field="documento_identificacion"
                  value={precolaborador_seleccionado}
                  completeMethod={search}
                  suggestions={filtrarColab}
                  onChange={(e) => {
                    validar(e.value);
                  }}
                  itemTemplate={itemTemplate2}
                  dropdown
                />
                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}
              </Col>

              <Col xs={12} md={2} lg={2} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="boton"
                  className="form-control-gestion boton-check"
                >
                  <Button
                    style={{ minWidth: "100%!important" }}
                    className="button-cancel p-button p-component button-gestion w-100 "
                    onClick={limpiar}
                  >
                    Limpiar
                  </Button>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3 ">
              <Col xs={12} md={6} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="nombre"
                  className="form-control-gestion"
                >
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Nombres colaborador"
                    className="mb-1 "
                  >
                    <Form.Control
                      disabled={encontrado}
                      required
                      type="text"
                      placeholder="Nombres colaborador"
                      value={nombre}
                      onChange={(e) => {
                        let value = e.target.value
                          .toUpperCase()
                          .replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, ""); // Permitir solo letras y letras con tildes
                        value = value.replace(/�/g, "Ñ");
                        setNombre(value);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {`Error: ${errores.nombre}`}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="apellidos"
                  className="form-control-gestion"
                >
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Apellidos colaborador"
                    className="mb-1 "
                  >
                    <Form.Control
                      disabled={encontrado}
                      className="form-control-gestion"
                      required
                      type="text"
                      placeholder="Apellidos colaborador"
                      value={apellidos}
                      onChange={(e) => {
                        let value = e.target.value
                          .toUpperCase()
                          .replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜÑñ\s]/g, "");
                        value = value.replace(/�/g, "Ñ"); // Permitir solo letras y letras con tildes
                        setApellidos(value);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {`Error: ${errores.apellidos}`}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3 ">
              <Col xs={12} md={6} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="tipoDocumento"
                  className="form-control-gestion"
                >
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Tipo de documento"
                    className="mb-1"
                  >
                    <Form.Select
                      className="form-control-gestion"
                      required
                      aria-label="Default select example"
                      value={tipoDocumento}
                      onChange={(e) => {
                        setTipoDocumento(e.target.value);
                      }}
                    >
                      <option value="">Seleccione...</option>
                      {infoAdicional.tipoDoc &&
                        infoAdicional.tipoDoc.map((tipoDocumento) => (
                          <option
                            key={tipoDocumento.id_tipo_documento}
                            value={tipoDocumento.abreviacion}
                          >
                            {tipoDocumento.nombre_tipo_documento}
                          </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {`Error: ${errores.tipoDocumento}`}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="documento"
                  className="form-control-gestion"
                >
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Numero de documento"
                    className="mb-1"
                  >
                    <Form.Control
                      disabled={encontrado}
                      required
                      type="text"
                      placeholder="Numero documento"
                      value={documento}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/, ""); // Eliminar todo lo que no sea dígito
                        // Limitar la longitud a un mínimo de 8 y un máximo de 10 caracteres
                        if (value.length >= 6 && value.length <= 15) {
                          setDocumento(value);
                          setError(false); // Restablecer el estado de error si el valor es válido
                        } else {
                          setDocumento(value);
                          setError(true); // Establecer el estado de error si el valor no es válido
                        }
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {`Error: ${errores.documento}`}
                    </Form.Control.Feedback>
                  </FloatingLabel>

                  {error && (
                    <p style={{ color: "#dc3545", fontSize: "14px" }}>
                      El número de documento debe tener entre 6 y 15 dígitos
                      maximo.
                    </p>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3 ">
              <Col xs={12} md={5} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="Cargo"
                  className="form-control-gestion"
                >
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Cargo"
                    className="mb-1"
                  >
                    <Form.Control
                      disabled={encontrado}
                      required
                      className="form-control-gestion"
                      placeholder="Cargo"
                      type="text"
                      value={cargo}
                      onChange={(e) => {
                        let value = e.target.value
                          .toUpperCase()
                          .replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜ\s]/g, "");
                        value = value.replace(/�/g, "Ñ"); // Permitir solo letras y letras con tildes
                        setCargo(value);
                      }}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {`Error: ${errores.cargo}`}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
              <Col xs={12} md={5} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="estadoEmpleado"
                  className="form-control-gestion"
                >
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Estado del colaborador"
                    className="mb-1"
                  >
                    <Form.Control
                      disabled={encontrado}
                      className="form-control-gestion"
                      required
                      as="select"
                      value={EstadoColaborador}
                      onChange={(e) => {
                        setestadoColaborador(e.target.value);
                      }}
                    >
                      {opcionesColaboradorEstado.map((opcion) => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {`Error: ${errores.estadoColaborador}`}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>

              <Col xs={12} md={2} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="primeraVez"
                  className="form-control-gestion boton-check"
                >
                  <Form.Check // prettier-ignore
                    type="switch"
                    checked={esPrimeraVez}
                    id="primeraVez"
                    label="Empleo por primera vez"
                    onChange={() => {
                      setEsPrimeraVez(!esPrimeraVez);
                    }}
                  />

                  <Form.Control.Feedback type="invalid">
                    {`Error: ${errores.primeraVez}`}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card className="mt-2 card-gestion ">
          <Card.Header className=" mb-1 card-gestion-header">
            <h4>
              <strong> Archivos de ingreso </strong>
            </h4>
          </Card.Header>
          <Card.Body className="border-top card-gestion-body">
            <Row className="mb-3">
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoHojaDeVida"
                  className="mt-2 form-control-gestion"
                >
                  <Form.Label>Hoja de Vida Actualizada</Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("hojadevida", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoCedula"
                  className="mt-2 form-control-gestion"
                >
                  <Form.Label>
                    Documento de Identidad (Ampliada al 150%)
                  </Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("cedula", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoEps"
                  className="mt-2 form-control-gestion"
                >
                  <Form.Label>Certificado de afiliación de EPS</Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("eps", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3  ">
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoAfp"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Certificado de afiliación de la AFP</Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("afp", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoCertificadoLaboral"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Certificaciones Laborales</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("certificacionesLaborales", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoExpedienteJudicial"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Antecedentes judiciales</Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("antecedentesJudiciales", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3  ">
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="pruebaPsicotecnicas"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Pruebas de ingreso psicotecnicas </Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("pruebaPsicotecnicas", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="pruebaConocimiento"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Pruebas de ingreso conocimiento</Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("pruebaConocimiento", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="certificacionesdeEstudio"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Certificaciones de estudio</Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("certificacionesdeEstudio", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3  ">
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="examenMedico"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Examen medico ocupacional de ingreso</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("examenMedico", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoCertificadoCuenta"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>
                    Certificado de apertura de cuenta / cuenta activa
                  </Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("certificadoCuenta", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoPoligrafo"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Resultado poligrafo</Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("poligrafo", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={6} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoActaEntrega"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Acta de entrega</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("actaentrega", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6} lg={6} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="descripcion"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Comentarios</Form.Label>

                  <Form.Control
                    style={{ minHeight: "150px" }}
                    placeholder="Por favor, ingrese cualquier novedad relacionada con algun archivo..."
                    as="textarea"
                    className="form-control-gestion"
                    value={descripcion}
                    onChange={(e) => {
                      setDescripcion(e.target.value);
                    }}
                  />
                </Form.Group>
              </Col>

              <h3>Otros archivos</h3>
              <p>
                *Estos archivos deben tener su nombre ya formateado
                (nombreArchivo_documentoColaborador.pdf).
              </p>
              <p>*No cargues archivos con el mismo nombre.</p>
              <Tooltip
                target=".custom-choose-btn"
                content="Choose"
                position="bottom"
              />
              <Tooltip
                target=".custom-upload-btn"
                content="Upload"
                position="bottom"
              />
              <Tooltip
                target=".custom-cancel-btn"
                content="Clear"
                position="bottom"
              />
              <FileUpload
                ref={fileUploadRef}
                name="demo[]"
                multiple
                accept=".pdf*"
                maxFileSize={10000000}
                onUpload={onTemplateUpload}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
                className="form-control-gestion"
              /* onBeforeUpload={otrosArchivos} */
              /*  onProgress={otrosArchivos} */
              />
            </Row>
            {/* <Button type="submit" style={{maxWidth:"40%", width:"40%"}}>Agregar estudio</Button> */}
            <div className="text-center mb-3">
              <Button
                type="submit"
                className="p-button p-component p-button-outlined button-gestion"
              >
                Enviar
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
};

export default Agregardocumento;
