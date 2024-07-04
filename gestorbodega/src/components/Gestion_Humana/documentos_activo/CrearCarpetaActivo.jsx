import React, { useState, useEffect, useRef } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Button as bostButton } from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import useControl from "../../../hooks/useControl";
import useControlCarpetaActivo from "../../../hooks/useControl_Contrato_Activo";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const CrearCarpeta = () => {
  const navigate = useNavigate();

  const { usuario } = useControl();

  const {
    ListarColab,
    colaboradores,
    CrearCarpetaActivo,
    respuestaCrearCarpeta,
    setrespuestaCrearCarpeta,
  } = useControlCarpetaActivo();
  const [colaborador_seleccionado, setcolaborador_seleccionado] =
    useState(null);
  const [precolaborador_seleccionado, presetcolaborador_seleccionado] =
    useState(null);
  const stepperRef = useRef(null);
  const [filtrarColab, setfiltrarColab] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(true);
  const [loading, setLoading] = useState(false);
  const [button_crear, setbutton_crear] = useState(true);
  const [errorMessage, setErrorMessage] = useState(true);
  const [siguiente, setSiguiente] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const [descripcion, setDescripcion] = useState("");
  const [archivos, setArchivos] = useState({
    eps: null,
    arl: null,
    ccf: null,
    contratodeTrabajo: null,
    autorizacionManejoDatos: null,
    acuerdoConfidencialidad: null,
  });
  const fileUploadRef = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const [otros_archivos, setotros_archivos] = useState({});
  const [archi_inducciones, setarchi_inducciones] = useState({});
  const [archi_dotacion, setarchi_dotacion] = useState({});
  const [archi_disciplinarios, setarchi_disciplinarios] = useState({});
  const [archi_cartaresponsabilidad, setarchi_cartaresponsabilidad] = useState(
    {}
  );
  const [archivos_novedades, setarchivos_novedades] = useState({});
  const [archi_examenes, setarchi_examenes] = useState({});
  const [archi_funciones, setarchi_funciones] = useState({});
  const [archi_otros, setarchi_otros] = useState({});
  useEffect(() => {
    if (respuestaCrearCarpeta === 200) {
      setArchivos({
        eps: null,
        arl: null,
        ccf: null,
        contratodeTrabajo: null,
        autorizacionManejoDatos: null,
        acuerdoConfidencialidad: null,
      });
      setActiveIndex(1);
      setBusquedaRealizada(true);
      setcolaborador_seleccionado("");
      presetcolaborador_seleccionado("");
      showSuccess();
      Swal.fire({
        icon: "success",
        title: `Se creo con exito la carpeta de contrato activo de ${colaborador_seleccionado.nombre_colaborador}`,
        showConfirmButton: false,
        timer: 2000,
      });
      setrespuestaCrearCarpeta();
    }
    // Llama a la función asincrónica para obtener los datos
  }, [respuestaCrearCarpeta]);

  const delayedRequest = debounce(() => {
    if (colaboradores?.length === 0) {
      ListarColab();
    }
  }, 500)

  useEffect(() => {
    // Llama a la función asincrónica para obtener los datos
    delayedRequest()
  }, [colaboradores]);

  const load = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
  const confirmarSiguiente = () => {
    Swal.fire({
      title: "¿Estas seguro que quieres seguir?",
      text: "Revisa bien tus archivos, ya que si vuelves se perderá lo que tenias cargado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, quiero seguir!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setSiguiente(true);
      }
    });
  };
  const confirmarVolver = () => {
    Swal.fire({
      title: "¿Estas seguro que quieres volver?",
      text: "Tendras que volver a cargar los archivos anteriores y estos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, quiero volver!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onTemplateClear();
        stepperRef.current.prevCallback();
      }
    });
  };
  /* Parte 1 */
  const search = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filtrarColab;

      if (!event.query.trim().length) {
        _filtrarColab = colaboradores.filter(
          (colaborador) => !colaborador.carpeta_colaborador_activo
        );
      } else {
        _filtrarColab = colaboradores.filter((colaborador) => {
          return (
            colaborador.numero_documento.startsWith(event.query) &&
            !colaborador.carpeta_colaborador_activo
          );
        });
      }

      setfiltrarColab(_filtrarColab);
    }, 250);
  };
  const itemTemplate = (item) => {
    return (
      <div className="flex align-items-center">
        <div>Numero de documento {item.numero_documento}</div>
        <p>
          Nombre: {item.nombre_colaborador} {item.apellidos}
        </p>
      </div>
    );
  };
  const validar = (valor) => {
    presetcolaborador_seleccionado(valor);
    let _validar;
    _validar = colaboradores.filter((colaborador) => {
      return colaborador.numero_documento.toLowerCase().startsWith(valor);
    });
    if (_validar.length === 0 && typeof valor === "object" && valor !== null) {
      setcolaborador_seleccionado(valor);
      setbutton_crear(false);
      setErrorMessage(null);
    } else {
      setbutton_crear(true);
      if (_validar.length !== 0) {
        setErrorMessage("Selecciona una de las opciones.");
      } else {
        setErrorMessage("El valor ingresado no corresponde a un colaborador.");
      }
    }
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
  /* Input 1 */
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
  const itemTemplate1 = (file, props) => {
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
          <Button
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
  const handleArchivoChange = (index, event) => {
    const newArchivos = { ...archivos }; // Crear una copia del objeto archivos
    newArchivos[index] = event.target.files[0]; // Modificar la copia
    setArchivos(newArchivos); // Actualizar el estado con la copia modificada
  };
  const handleSubmit = async () => {
    const documento = colaborador_seleccionado.numero_documento;
    const user = usuario;

    CrearCarpetaActivo({ documento, user, descripcion }, archivos, {
      archi_inducciones,
      archi_dotacion,
      archi_disciplinarios,
      archi_cartaresponsabilidad,
      archivos_novedades,
      archi_examenes,
      archi_otros,
      archi_funciones,
    });
  };
  
  return (
    <div className="tabla-2-gestion">
      {busquedaRealizada ? (
        colaboradores && colaboradores.length !== 0 ? (
          <div className="row mt-5 ">
            <div className="col-md-8 offset-md-3 mx-auto">
              <div className="card text-center">
                <div className="card-header bg-black align-items-center ">
                  <div className="row  ">
                    <div className="col-md-1  col-lg-1">s
                      <Button
                        type="button"
                        icon="pi pi-refresh"
                        label=""
                        outlined
                        className="color-icon"
                        onClick={() => {
                          ListarColab();
                        }}
                      />
                    </div>
                    <div className=" col-md-7 col-lg-7">
                      <h3 className="font-weight-bold header-buscar">
                        BUSCAR COLABORADOR
                      </h3>
                    </div>
                    <div className=" col-md-4 col-lg-4">
                      <Button
                        type="button"
                        iconPos="right"
                        icon="pi pi-arrow-right"
                        label="Lista documentos activo"
                        outlined
                        className="color-icon"
                        onClick={() => {
                          navigate("/lista_documentos_activo");
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="card-body ">
                  <div className="mt-4">
                    <AutoComplete
                      placeholder="Escribe un numero de documento"
                      className="autocompletecrear"
                      field="numero_documento"
                      value={precolaborador_seleccionado}
                      completeMethod={search}
                      suggestions={filtrarColab}
                      onChange={(e) => {
                        validar(e.value);
                      }}
                      itemTemplate={itemTemplate}
                      dropdown
                    />
                    {errorMessage && (
                      <div className="error-message">{errorMessage}</div>
                    )}

                    <div className="text-center mt-3">
                      <Button
                        disabled={button_crear}
                        loading={loading}
                        outlined
                        label={"Crear carpeta colaborador activo"}
                        className="button-gestion"
                        onClick={(e) => {
                          e.preventDefault();
                          setBusquedaRealizada(false);
                          load();
                          showSuccess(
                            `¡Perfecto! has elegido a ${colaborador_seleccionado.nombre_colaborador}`
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex aling-items-center ">
            {" "}
            <ProgressSpinner
              className="spinner"
              fill="var(--surface-ground)"
              strokeWidth="8"
            />
          </div>
        )
      ) : (
        
        <Stepper
          ref={stepperRef}
          style={{ flexBasis: "50rem" }}
          linear={true}
          orientation="vertical"
        >
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
          
          {/* Formulio inicial */}
          <StepperPanel header="Documentos inciales">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center ">
                <Form
                  /* noValidate validated={validated} */ onSubmit={handleSubmit}
                >
                  <Card className="d-flex align-items-center card-gestion p-3">
                    <Card.Header className="mb-1 card-gestion-header d-flex align-items-center">
                      <Button
                        icon={"pi pi-arrow-left"}
                        className="mr-3 btn btn-outline-primary button-oscuro"
                        onClick={() => {
                          setBusquedaRealizada(true);
                          presetcolaborador_seleccionado("");
                          setcolaborador_seleccionado("");
                          setbutton_crear(true);
                          setActiveIndex(1);
                        }}
                        label="Volver "
                      />
                      <h4 className="m-0 flex-grow-1 text-center">
                        Creación carpeta contrato activo
                      </h4>
                    </Card.Header>
                    <Card.Body className="border-top card-gestion-body">
                      <Row className="mb-3 ">
                        <Form.Group
                          as={Col}
                          controlId="nombre"
                          className="form-control-gestion"
                        >
                          <FloatingLabel
                            controlId="floatingInput"
                            label="Nombres colaborador"
                            className="mb-1"
                          >
                            <Form.Control
                              disabled
                              type="text"
                              placeholder="Nombres colaborador"
                              value={
                                colaborador_seleccionado.nombre_colaborador
                              }
                            />
                          </FloatingLabel>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          controlId="apellidos"
                          className="form-control-gestion"
                        >
                          <FloatingLabel
                            controlId="floatingInput"
                            label="Apellidos colaborador"
                            className="mb-1"
                          >
                            <Form.Control
                              disabled
                              className="form-control-gestion"
                              type="text"
                              placeholder="Apellidos colaborador"
                              value={colaborador_seleccionado.apellidos}
                            />
                          </FloatingLabel>
                        </Form.Group>
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
                              disabled
                              type="text"
                              placeholder="Numero documento"
                              value={colaborador_seleccionado.numero_documento}
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Row>
                      <Row className="mb-3 ">
                        {/* EPS archivo */}
                        <Form.Group
                          as={Col}
                          controlId="archivoEps"
                          className="mt-2 form-control-gestion"
                        >
                          <Form.Label>Certicado afiliación de EPS</Form.Label>
                          <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const fileType = e.target.files[0].type;
                              if (fileType == "application/pdf") {
                                handleArchivoChange("eps", e);
                              } else {
                                showError(
                                  "No es un archivo pdf, vuelve a intentar."
                                );
                                e.target.value = "";
                              }
                            }}
                          />
                        </Form.Group>
                        {/* ARL archivo */}
                        <Form.Group
                          as={Col}
                          controlId="archivoArl"
                          className="mt-2 form-control-gestion"
                        >
                          <Form.Label>Certificado afiliación ARL</Form.Label>

                          <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const fileType = e.target.files[0].type;
                              if (fileType == "application/pdf") {
                                handleArchivoChange("arl", e);
                              } else {
                                showError(
                                  "No es un archivo pdf, vuelve a intentar."
                                );
                                e.target.value = "";
                              }
                            }}
                          />
                        </Form.Group>
                        {/* CCF archivo */}
                        <Form.Group
                          as={Col}
                          controlId="archivoCCF"
                          className="mt-2 form-control-gestion"
                        >
                          <Form.Label>
                            Certificado de caja de compensacion familiar (CCF)
                          </Form.Label>

                          <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const fileType = e.target.files[0].type;
                              if (fileType == "application/pdf") {
                                handleArchivoChange("ccf", e);
                              } else {
                                showError(
                                  "No es un archivo pdf, vuelve a intentar."
                                );
                                e.target.value = "";
                              }
                            }}
                          />
                        </Form.Group>
                      </Row>
                      <Row className="mb-3 ">
                        {/* contrato trabajo archivo */}
                        <Form.Group
                          as={Col}
                          controlId="archivocontratodeTrabajo"
                          className="mt-2 form-control-gestion"
                        >
                          <Form.Label>Contrato de trabajo</Form.Label>
                          <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const fileType = e.target.files[0].type;
                              if (fileType == "application/pdf") {
                                handleArchivoChange("contratodeTrabajo", e);
                              } else {
                                showError(
                                  "No es un archivo pdf, vuelve a intentar."
                                );
                                e.target.value = "";
                              }
                            }}
                          />
                        </Form.Group>
                        {/* autorizacionManejoDatos archivo */}
                        <Form.Group
                          as={Col}
                          controlId="archivoAutorizacion"
                          className="mt-2 form-control-gestion"
                        >
                          <Form.Label>
                            Autorizacion manejo y tratamiento de datos
                            personales
                          </Form.Label>
                          <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const fileType = e.target.files[0].type;
                              if (fileType == "application/pdf") {
                                handleArchivoChange(
                                  "autorizacionManejoDatos",
                                  e
                                );
                              } else {
                                showError(
                                  "No es un archivo pdf, vuelve a intentar."
                                );
                                e.target.value = "";
                              }
                            }}
                          />
                        </Form.Group>
                        {/* acuerdoConfidencialidad archivo */}
                        <Form.Group
                          as={Col}
                          controlId="archivoEps"
                          className="mt-2 form-control-gestion"
                        >
                          <Form.Label>Acuerdo de confidencialidad</Form.Label>
                          <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const fileType = e.target.files[0].type;
                              if (fileType == "application/pdf") {
                                handleArchivoChange(
                                  "acuerdoConfidencialidad",
                                  e
                                );
                              } else {
                                showError(
                                  "No es un archivo pdf, vuelve a intentar."
                                );
                                e.target.value = "";
                              }
                            }}
                          />
                        </Form.Group>
                      </Row>
                      <div className="d-flex justify-content-end">
                        <Button
                          label=" Siguiente"
                          icon="pi pi-arrow-right"
                          iconPos="right"
                          className="button-gestion"
                          onClick={(e) => {
                            e.preventDefault();
                            const todosNull = Object.values(archivos).every(
                              (value) => value === null
                            );
                            if (todosNull) {
                              showError(
                                "No has cargado ningun archivo, no podemos continuar"
                              );
                            } else {
                              stepperRef.current.nextCallback();
                            }
                          }}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Form>
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="Sub carpeta -> Archivos inducciones o reinducciones">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <Card className="d-flex align-items-center card-gestion p-3">
                  <Card.Header className="mb-1 card-gestion-header d-flex align-items-center">
                    <h4 className="m-0 flex-grow-1 text-center">
                      Inducciones y reinducciones
                    </h4>
                  </Card.Header>
                  <Card.Body className="border-top card-gestion-body">
                    <p>
                      *Por favor, agrega solo un archivo a la vez, de lo
                      contrario, se generará un error.*{" "}
                    </p>
                    <p>
                      Este archivo quedara en una subcarpeta llamada inducciones
                      y reinducciones
                    </p>
                    <p>
                      {" "}
                      Asegúrate de asignar un nombre clave al archivo, ya que se
                      formateará de la siguiente manera:
                      'inducciones_nombrequeestablezcas_fechadesubida.pdf'.
                    </p>
                   
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
                      itemTemplate={itemTemplate1}
                      emptyTemplate={emptyTemplate}
                      chooseOptions={chooseOptions}
                      uploadOptions={uploadOptions}
                      cancelOptions={cancelOptions}
                      className="form-control-gestion"
                    />
                    <div className="d-flex  justify-content-between">
                      <Button
                        label="Atras"
                        severity="secondary"
                        className="button-oscuro button-gestion"
                        icon="pi pi-arrow-left"
                        onClick={() => {
                          confirmarVolver();
                        }}
                      />
                      <Button
                        label="Siguiente"
                        icon="pi pi-arrow-right"
                        className="button-gestion"
                        iconPos="right"
                        ON
                        onClick={() => {
                          Swal.fire({
                            title: "¿Estas seguro que quieres seguir?",
                            text: "Revisa bien tus archivos, ya que si vuelves se perderá lo que tenias cargado.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sí, quiero seguir!",
                            cancelButtonText: "Cancelar",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              setarchi_inducciones(otros_archivos);
                              stepperRef.current.nextCallback();
                              setotros_archivos({});
                              onTemplateClear();
                            }
                          });
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="Sub carpeta -> Entrega Dotación y EPP">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <Card className="d-flex align-items-center card-gestion p-3">
                  <Card.Header className="mb-1 card-gestion-header d-flex align-items-center">
                    <h4 className="m-0 flex-grow-1 text-center">
                      Archivos de entrega de dotacion y EPP
                    </h4>
                  </Card.Header>
                  <p>
                    *Por favor, agrega solo un archivo a la vez, de lo
                    contrario, se generará un error.*{" "}
                  </p>
                  <p>
                    Este archivo quedara en una subcarpeta llamada dotaciones y
                    EPP
                  </p>
                  <p>
                    {" "}
                    Asegúrate de asignar un nombre clave al archivo, ya que se
                    formateará de la siguiente manera:
                    'dotacion_nombrequeestablezcas_fechadesubida.pdf'.
                  </p>
                  <Card.Body className="border-top card-gestion-body">
                  
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
                      itemTemplate={itemTemplate1}
                      emptyTemplate={emptyTemplate}
                      chooseOptions={chooseOptions}
                      uploadOptions={uploadOptions}
                      cancelOptions={cancelOptions}
                      className="form-control-gestion"
                    />

                    <div className="d-flex  justify-content-between">
                      <Button
                        label="Atras"
                        severity="secondary"
                        className="button-oscuro button-gestion"
                        icon="pi pi-arrow-left"
                        onClick={() => confirmarVolver()}
                      />

                      <Button
                        label="Siguiente"
                        icon="pi pi-arrow-right"
                        className="button-gestion"
                        iconPos="right"
                        onClick={() => {
                          Swal.fire({
                            title: "¿Estas seguro que quieres seguir?",
                            text: "Revisa bien tus archivos, ya que si vuelves se perderá lo que tenias cargado.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sí, quiero seguir!",
                            cancelButtonText: "Cancelar",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              setarchi_dotacion(otros_archivos);
                              stepperRef.current.nextCallback();
                              setotros_archivos({});
                              onTemplateClear();
                            }
                          });
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="Sub carpeta -> Procesos disciplinarios">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <Card className="d-flex align-items-center card-gestion p-3">
                  <Card.Header className="mb-1 card-gestion-header d-flex align-items-center">
                    <h4 className="m-0 flex-grow-1 text-center">
                      Procesos disciplinarios
                    </h4>
                  </Card.Header>
                  <p>
                    *Por favor, agrega solo un archivo a la vez, de lo
                    contrario, se generará un error.*{" "}
                  </p>
                  <p>
                    Este archivo quedara en una subcarpeta llamada Procesos
                    disciplinarios
                  </p>
                  <p>
                    {" "}
                    Asegúrate de asignar un nombre clave al archivo, ya que se
                    formateará de la siguiente manera:
                    'procesos_disciplinarios_nombrequeestablezcas_fechadesubida.pdf'.
                  </p>
                  <Card.Body className="border-top card-gestion-body">
                  
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
                      itemTemplate={itemTemplate1}
                      emptyTemplate={emptyTemplate}
                      chooseOptions={chooseOptions}
                      uploadOptions={uploadOptions}
                      cancelOptions={cancelOptions}
                      className="form-control-gestion"
                    />
                    <div className="d-flex  justify-content-between">
                      <Button
                        label="Atras"
                        severity="secondary"
                        className="button-oscuro button-gestion"
                        icon="pi pi-arrow-left"
                        onClick={() => confirmarVolver()}
                      />

                      <Button
                        label="Siguiente"
                        icon="pi pi-arrow-right"
                        className="button-gestion"
                        iconPos="right"
                        onClick={() => {
                          Swal.fire({
                            title: "¿Estas seguro que quieres seguir?",
                            text: "Revisa bien tus archivos, ya que si vuelves se perderá lo que tenias cargado.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sí, quiero seguir!",
                            cancelButtonText: "Cancelar",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              setarchi_disciplinarios(otros_archivos);
                              stepperRef.current.nextCallback();
                              setotros_archivos({});
                              onTemplateClear();
                            }
                          });
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="Sub carpeta -> Carta de responsabilidad">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <Card className="d-flex align-items-center card-gestion p-3">
                  <Card.Header className="mb-1 card-gestion-header d-flex align-items-center">
                    <h4 className="m-0 flex-grow-1 text-center">
                      Carta de responsabilidad
                    </h4>
                  </Card.Header>
                  <p>
                    *Por favor, agrega solo un archivo a la vez, de lo
                    contrario, se generará un error.*{" "}
                  </p>
                  <p>
                    Este archivo quedara en una subcarpeta llamada cartas de
                    responsabilidad
                  </p>
                  <p>
                    Asegúrate de asignar un nombre clave al archivo, ya que se
                    formateará de la siguiente manera:
                    'carta_responsabilidad_nombrequeestablezcas_fechadesubida.pdf'.
                  </p>
                  <Card.Body className="border-top card-gestion-body">
                  
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
                      itemTemplate={itemTemplate1}
                      emptyTemplate={emptyTemplate}
                      chooseOptions={chooseOptions}
                      uploadOptions={uploadOptions}
                      cancelOptions={cancelOptions}
                      className="form-control-gestion"
                    />

                    <div className="d-flex  justify-content-between">
                      <Button
                        label="Atras"
                        severity="secondary"
                        className="button-oscuro button-gestion"
                        icon="pi pi-arrow-left"
                        onClick={() => confirmarVolver()}
                      />

                      <Button
                        label="Siguiente"
                        icon="pi pi-arrow-right"
                        className="button-gestion"
                        iconPos="right"
                        onClick={() => {
                          Swal.fire({
                            title: "¿Estas seguro que quieres seguir?",
                            text: "Revisa bien tus archivos, ya que si vuelves se perderá lo que tenias cargado.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sí, quiero seguir!",
                            cancelButtonText: "Cancelar",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              setarchi_cartaresponsabilidad(otros_archivos);
                              stepperRef.current.nextCallback();
                              setotros_archivos({});
                              onTemplateClear();
                            }
                          });
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="Sub carpeta ->Novedades">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <Card className="d-flex align-items-center card-gestion p-3">
                  <Card.Header className="mb-1 card-gestion-header d-flex align-items-center">
                    <h4 className="m-0 flex-grow-1 text-center">Novedades</h4>
                  </Card.Header>
                  <Card.Body className="border-top card-gestion-body">
                    <p>
                      *Por favor, agrega solo un archivo a la vez, de lo
                      contrario, se generará un error.*{" "}
                    </p>
                    <p>
                      Este archivo quedara en una subcarpeta llamada novedades
                    </p>
                    <p>
                      {" "}
                      Asegúrate de asignar un nombre clave al archivo, ya que se
                      formateará de la siguiente manera:
                      'novedades_nombrequeestablezcas_fechadesubida.pdf'.
                    </p>
                  
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
                      itemTemplate={itemTemplate1}
                      emptyTemplate={emptyTemplate}
                      chooseOptions={chooseOptions}
                      uploadOptions={uploadOptions}
                      cancelOptions={cancelOptions}
                      className="form-control-gestion"
                    />

                    <div className="d-flex  justify-content-between">
                      <Button
                        label="Atras"
                        severity="secondary"
                        className="button-oscuro button-gestion"
                        icon="pi pi-arrow-left"
                        onClick={() => confirmarVolver()}
                      />

                      <Button
                        label="Siguiente"
                        icon="pi pi-arrow-right"
                        className="button-gestion"
                        iconPos="right"
                        onClick={() => {
                          Swal.fire({
                            title: "¿Estas seguro que quieres seguir?",
                            text: "Revisa bien tus archivos, ya que si vuelves se perderá lo que tenias cargado.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sí, quiero seguir!",
                            cancelButtonText: "Cancelar",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              setarchivos_novedades(otros_archivos);
                              stepperRef.current.nextCallback();
                              setotros_archivos({});
                              onTemplateClear();
                            }
                          });
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="Sub carpeta ->Examenes medicos">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <Card className="d-flex align-items-center card-gestion p-3">
                  <Card.Header className="mb-1 card-gestion-header d-flex align-items-center">
                    <h4 className="m-0 flex-grow-1 text-center">
                      Examenes medicos
                    </h4>
                  </Card.Header>
                  <Card.Body className="border-top card-gestion-body">
                    <p>
                      *Por favor, agrega solo un archivo a la vez, de lo
                      contrario, se generará un error.*{" "}
                    </p>
                    <p>
                      Este archivo quedara en una subcarpeta llamada examenes
                      medicos
                    </p>
                    <p>
                      {" "}
                      Asegúrate de asignar un nombre clave al archivo, ya que se
                      formateará de la siguiente manera:
                      'examenesmedicos_nombrequeestablezcas_fechadesubida.pdf'.
                    </p>
                  
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
                      itemTemplate={itemTemplate1}
                      emptyTemplate={emptyTemplate}
                      chooseOptions={chooseOptions}
                      uploadOptions={uploadOptions}
                      cancelOptions={cancelOptions}
                      className="form-control-gestion"
                    />
                    <div className="d-flex  justify-content-between">
                      <Button
                        label="Atras"
                        severity="secondary"
                        className="button-oscuro button-gestion"
                        icon="pi pi-arrow-left"
                        onClick={() => confirmarVolver()}
                      />

                      <Button
                        label="Siguiente"
                        icon="pi pi-arrow-right"
                        className="button-gestion"
                        iconPos="right"
                        onClick={() => {
                          Swal.fire({
                            title: "¿Estas seguro que quieres seguir?",
                            text: "Revisa bien tus archivos, ya que si vuelves se perderá lo que tenias cargado.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sí, quiero seguir!",
                            cancelButtonText: "Cancelar",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              setarchi_examenes(otros_archivos);
                              stepperRef.current.nextCallback();
                              setotros_archivos({});
                              onTemplateClear();
                            }
                          });
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="Sub carpeta ->Manual de funciones y perfil de cargo">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <Card className="d-flex align-items-center card-gestion p-3">
                  <Card.Header className="mb-1 card-gestion-header d-flex align-items-center">
                    <h4 className="m-0 flex-grow-1 text-center">
                      Manual de funciones y perfil de cargo
                    </h4>
                  </Card.Header>
                  <Card.Body className="border-top card-gestion-body">
                    <p>
                      *Por favor, agrega solo un archivo a la vez, de lo
                      contrario, se generará un error.*{" "}
                    </p>
                    <p>
                      Este archivo quedara en una subcarpeta llamada Funciones y
                      Perfil de Cargo
                    </p>
                    <p>
                      {" "}
                      Asegúrate de asignar un nombre clave al archivo, ya que se
                      formateará de la siguiente manera:
                      'funcionesyPerfilCargo_nombrequeestablezcas_fechadesubida.pdf'.
                    </p>
                  
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
                      itemTemplate={itemTemplate1}
                      emptyTemplate={emptyTemplate}
                      chooseOptions={chooseOptions}
                      uploadOptions={uploadOptions}
                      cancelOptions={cancelOptions}
                      className="form-control-gestion"
                    />
                    <div className="d-flex  justify-content-between">
                      <Button
                        label="Atras"
                        severity="secondary"
                        className="button-oscuro button-gestion"
                        icon="pi pi-arrow-left"
                        onClick={() => confirmarVolver()}
                      />

                      <Button
                        label="Siguiente"
                        icon="pi pi-arrow-right"
                        className="button-gestion"
                        iconPos="right"
                        onClick={() => {
                          Swal.fire({
                            title: "¿Estas seguro que quieres seguir?",
                            text: "Revisa bien tus archivos, ya que si vuelves se perderá lo que tenias cargado.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sí, quiero seguir!",
                            cancelButtonText: "Cancelar",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              setarchi_funciones(otros_archivos);
                              stepperRef.current.nextCallback();
                              setotros_archivos({});
                              onTemplateClear();
                            }
                          });
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="Sub carpeta -> Otros (Si aplica)">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <Card className="d-flex align-items-center card-gestion p-3">
                  <Card.Header className="mb-1 card-gestion-header d-flex align-items-center">
                    <h4 className="m-0 flex-grow-1 text-center">
                      Otros (Si aplica)
                    </h4>
                  </Card.Header>
                  <Card.Body className="border-top card-gestion-body">
                    <p>
                      *Por favor, agrega solo un archivo a la vez, de lo
                      contrario, se generará un error.*{" "}
                    </p>
                    <p>Este archivo quedara en una subcarpeta llamada otros</p>
                    <p>
                      {" "}
                      Asegúrate de asignar un nombre clave al archivo, ya que se
                      formateará de la siguiente manera:
                      'otros_nombrequeestablezcas_fechadesubida.pdf'.
                    </p>
                  
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
                      itemTemplate={itemTemplate1}
                      emptyTemplate={emptyTemplate}
                      chooseOptions={chooseOptions}
                      uploadOptions={uploadOptions}
                      cancelOptions={cancelOptions}
                      className="form-control-gestion"
                    />

                    <div className="d-flex  justify-content-between">
                      <Button
                        label="Atras"
                        severity="secondary"
                        className="button-oscuro button-gestion"
                        icon="pi pi-arrow-left"
                        onClick={() => confirmarVolver()}
                      />
                      <Button
                        label="Siguiente"
                        icon="pi pi-arrow-right"
                        className="button-gestion"
                        iconPos="right"
                        onClick={() => {
                          Swal.fire({
                            title: "¿Estas seguro que quieres seguir?",
                            text: "Revisa bien tus archivos, ya que si vuelves se perderá lo que tenias cargado.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sí, quiero seguir!",
                            cancelButtonText: "Cancelar",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              setarchi_otros(otros_archivos);
                              stepperRef.current.nextCallback();
                              setotros_archivos({});
                              onTemplateClear();
                            }
                          });
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="Enviar Formulario">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <Card className="d-flex align-items-center card-gestion p-3">
                  <Card.Header className="mb-1 card-gestion-header d-flex align-items-center">
                    <h4 className="m-0 flex-grow-1 text-center">
                      Enviar Formulario
                    </h4>
                  </Card.Header>
                  <Card.Body className="border-top card-gestion-body">
                    <Form.Group
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
                    <div className="d-flex  justify-content-between">
                      <Button
                        label="Atras"
                        severity="secondary"
                        className="button-oscuro button-gestion"
                        icon="pi pi-arrow-left"
                        onClick={() => confirmarVolver()}
                      />

                      <Button
                        label="Guardar"
                        icon="pi pi-save"
                        className="button-gestion"
                        iconPos="right"
                        onClick={() => {
                          Swal.fire({
                            title: "¿Estas seguro que quieres seguir?",
                            text: "Revisa bien tus archivos, ya que se enviará el formulario.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sí, quiero seguir!",
                            cancelButtonText: "Cancelar",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              setotros_archivos({});
                              onTemplateClear();
                              handleSubmit();
                            }
                          });
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </StepperPanel>
        </Stepper>
      )}
    </div>
  );
};

export default CrearCarpeta;
