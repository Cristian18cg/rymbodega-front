import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Button } from "primereact/button";
import Swal from "sweetalert2";
import Row from "react-bootstrap/Row";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { ProgressBar } from "primereact/progressbar";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Tag } from "primereact/tag";
import useControl from "../../../hooks/useControl";

import useControlCarpetaActivo from "../../../hooks/useControl_Contrato_Activo";
import useControlCarpetaRetiro from "../../../hooks/useControl_Documentos_Retiro";
import { Navigate } from "react-router-dom";
const Formulario = (colaborador_seleccionado) => {
  const { usuario } = useControl();

  const {
    setBbusquedaCrearCarpeta,
    respuestaCrearCarpetaRetiro,
    crear_carpeta_retiro,
  } = useControlCarpetaRetiro();
  const fileUploadRef = useRef(null);
  const [totalSize, setTotalSize] = useState(0);

  const [archivos, setArchivos] = useState({
    cartaRenuncia: null,
    entregaPuesto: null,
    pazysalvo: null,
    liquidacion: null,
    certificadoLaboraldeRetiro: null,
    certificadoretiroCesantias: null,
    entregaActivos: null,
    examenesMedicosdeEgreso: null,
    entrevistadeRetiro: null,
    aceptacionRenuncia:null,
  });
  const [descripcion, setDescripcion] = useState("");

  const [colaborador, setcolaborador] = useState(
    colaborador_seleccionado.colaborador_seleccionado
  );
  const [archi_otros, setarchi_otros] = useState({});
  useEffect(() => {
    if (respuestaCrearCarpetaRetiro === 200) {
      setArchivos({
        cartaRenuncia: null,
        entregaPuesto: null,
        pazysalvo: null,
        liquidacion: null,
        certificadoLaboraldeRetiro: null,
        certificadoretiroCesantias: null,
        entregaActivos: null,
        examenesMedicosdeEgreso: null,
        entrevistadeRetiro: null,
        aceptacionRenuncia:null,
      });
      // Llama a la función asincrónica para obtener los datos
    }
  }, [respuestaCrearCarpetaRetiro]);
/*   useEffect(() => {
    if (colaborador === null || colaborador === undefined) {
      setBbusquedaCrearCarpeta(true);
    }
  }, []); */
  const handleArchivoChange = (index, event) => {
    const newArchivos = { ...archivos }; // Crear una copia del objeto archivos
    newArchivos[index] = event.target.files[0]; // Modificar la copia
    setArchivos(newArchivos); // Actualizar el estado con la copia modificada
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const documento = colaborador.numero_documento;
    const user = usuario;
    crear_carpeta_retiro(
      { documento, user, descripcion },
      archivos,
      archi_otros
    );
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
    const nuevosOtrosArchivos = { ...archi_otros };
    delete nuevosOtrosArchivos[file.name];
    // Actualizar el estado con el nuevo objeto de otros archivos
    setarchi_otros(nuevosOtrosArchivos);
    setTotalSize(totalSize - file.size);
    callback();
  };
  const onTemplateSelect = (e) => {
    const archivo = e.files[e.files.length - 1];
    const archivoNombre = archivo.name;
    if (archivo.type === "application/pdf") {
      // Verificar si el nombre del archivo ya está presente en otros_archivos
      if (archi_otros.hasOwnProperty(archivoNombre)) {
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
          const newotrosArchivos = { ...archi_otros };
          newotrosArchivos[archivoNombre] = archivo;
          setarchi_otros(newotrosArchivos);
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
    setarchi_otros({});
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
  return (
    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center ">
      {colaborador ? (
        <Form onSubmit={handleSubmit}>
          <Card className="d-flex align-items-center card-gestion p-3">
            <Card.Header className="mb-1 card-gestion-header d-flex align-items-center">
              <Button
                icon={"pi pi-arrow-left"}
                className="mr-3 btn btn-outline-primary button-oscuro"
                onClick={(e) => {
                  e.preventDefault();
                  setBbusquedaCrearCarpeta(true);
                  setArchivos({
                    cartaRenuncia: null,
                    entregaPuesto: null,
                    pazysalvo: null,
                    liquidacion: null,
                    certificadoLaboraldeRetiro: null,
                    certificadoretiroCesantias: null,
                    entregaActivos: null,
                    examenesMedicosdeEgreso: null,
                    entrevistadeRetiro: null,
                    aceptacionRenuncia:null,
                  });
                  setcolaborador("")
                  
                  /*     presetcolaborador_seleccionado("");
                setcolaborador_seleccionado(""); */
                  /*         setbutton_crear(true); */
                }}
                label="Volver "
              />
              <h4 className="m-0 flex-grow-1 text-center">
                <strong> Creación carpeta de retiro</strong>
              </h4>
            </Card.Header>
            <Card.Body className="border-top card-gestion-body">
              <Row className="mb-3  ">
                <Col xs={12} md={3} className="mb-3">
                  <Form.Group
                    as={Col}
                    controlId="nombre"
                    className="form-control-gestion"
                  >
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Nombres colaborador"
                      className="mb-1 hide-on-small-screen"
                    >
                      <Form.Control
                        disabled
                        type="text"
                        placeholder="Nombres colaborador"
                        value={colaborador.nombre_colaborador}
                      />
                    </FloatingLabel>
                  </Form.Group>
                </Col>
                <Col xs={12} md={3} className="mb-3">
                  <Form.Group
                    as={Col}
                    controlId="apellidos"
                    className="form-control-gestion"
                  >
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Apellidos colaborador"
                      className="mb-1  hide-on-small-screen"
                    >
                      <Form.Control
                        disabled
                        className="form-control-gestion"
                        type="text"
                        placeholder="Apellidos colaborador"
                        value={colaborador.apellidos}
                      />
                    </FloatingLabel>
                  </Form.Group>
                </Col>
                <Col xs={12} md={3} className="mb-3">
                  <Form.Group
                    as={Col}
                    controlId="documento"
                    className="form-control-gestion"
                  >
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Numero de documento"
                      className="mb-1 hide-on-small-screen"
                    >
                      <Form.Control
                        disabled
                        type="text"
                        placeholder="Numero documento"
                        value={colaborador.numero_documento}
                      />
                    </FloatingLabel>
                  </Form.Group>
                </Col>
                <Col xs={12} md={3} className="mb-3">
                  <Form.Group
                    as={Col}
                    controlId="Cargo"
                    className="form-control-gestion"
                  >
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Cargo"
                      className="mb-1 "
                    >
                      <Form.Control
                        disabled
                        className="form-control-gestion"
                        type="text"
                        placeholder="Cargo"
                        value={colaborador.cargo}
                      />
                    </FloatingLabel>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 ">
                <Col xs={12} md={4} className="mb-3">
                  {/* renuncia archivo */}
                  <Form.Group
                    as={Col}
                    controlId="archivorenuncia"
                    className="mt-2 form-control-gestion"
                  >
                    <Form.Label>Carta de teminacion / Renuncia</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const fileType = e.target.files[0].type;
                        if (fileType == "application/pdf") {
                          handleArchivoChange("cartaRenuncia", e);
                        } else {
                          showError("No es un archivo pdf, vuelve a intentar.");
                          e.target.value = "";
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4} className="mb-3">
                  {/* entrega de puesto archivo */}
                  <Form.Group
                    as={Col}
                    controlId="archivoEntregaPuesto"
                    className="mt-2 form-control-gestion"
                  >
                    <Form.Label>
                      Acta de entrega puesto de trabajo (Administrativos)
                    </Form.Label>

                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const fileType = e.target.files[0].type;
                        if (fileType == "application/pdf") {
                          handleArchivoChange("entregaPuesto", e);
                        } else {
                          showError("No es un archivo pdf, vuelve a intentar.");
                          e.target.value = "";
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4} className="mb-3">
                  {/* paz y salvo archivo */}
                  <Form.Group
                    as={Col}
                    controlId="archivoPazySalvo"
                    className="mt-2 form-control-gestion"
                  >
                    <Form.Label>Paz y Salvo</Form.Label>

                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const fileType = e.target.files[0].type;
                        if (fileType == "application/pdf") {
                          handleArchivoChange("pazysalvo", e);
                        } else {
                          showError("No es un archivo pdf, vuelve a intentar.");
                          e.target.value = "";
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={12} md={4} className="mb-3">
                  {/*Liquidacion */}
                  <Form.Group
                    as={Col}
                    controlId="archivoLiquidacion"
                    className="mt-2 form-control-gestion"
                  >
                    <Form.Label>Liquidacion</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const fileType = e.target.files[0].type;
                        if (fileType == "application/pdf") {
                          handleArchivoChange("liquidacion", e);
                        } else {
                          showError("No es un archivo pdf, vuelve a intentar.");
                          e.target.value = "";
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4} className="mb-3">
                  {/* Certificado laboral de retiro */}
                  <Form.Group
                    as={Col}
                    controlId="archivocertificadoLaboraldeRetiro"
                    className="mt-2 form-control-gestion"
                  >
                    <Form.Label>Certificado laboral de retiro</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const fileType = e.target.files[0].type;
                        if (fileType == "application/pdf") {
                          handleArchivoChange("certificadoLaboraldeRetiro", e);
                        } else {
                          showError("No es un archivo pdf, vuelve a intentar.");
                          e.target.value = "";
                        }
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={4} className="mb-3">
                  {/* retiro cesantias archivo */}
                  <Form.Group
                    as={Col}
                    controlId="archivocertificadoretiroCesantias"
                    className="mt-2 form-control-gestion"
                  >
                    <Form.Label>Certificado retiro cesantias</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const fileType = e.target.files[0].type;
                        if (fileType == "application/pdf") {
                          handleArchivoChange("certificadoretiroCesantias", e);
                        } else {
                          showError("No es un archivo pdf, vuelve a intentar.");
                          e.target.value = "";
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 ">
                <Col xs={12} md={3} className="mb-3">
                  {/*Entrega Activos */}
                  <Form.Group
                    as={Col}
                    controlId="archivoEntregaActivos"
                    className="mt-2 form-control-gestion"
                  >
                    <Form.Label>Entrega de activos</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const fileType = e.target.files[0].type;
                        if (fileType == "application/pdf") {
                          handleArchivoChange("entregaActivos", e);
                        } else {
                          showError("No es un archivo pdf, vuelve a intentar.");
                          e.target.value = "";
                        }
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={3} className="mb-3">
                  {/* Examenes medicos de retiro*/}
                  <Form.Group
                    as={Col}
                    controlId="archivocertificadoLaboraldeRetiro"
                    className="mt-2 form-control-gestion"
                  >
                    <Form.Label>Examenes medicos de retiro</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const fileType = e.target.files[0].type;
                        if (fileType == "application/pdf") {
                          handleArchivoChange("examenesMedicosdeEgreso", e);
                        } else {
                          showError("No es un archivo pdf, vuelve a intentar.");
                          e.target.value = "";
                        }
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={3} className="mb-3">
                  {/*Entrevista de retiro*/}
                  <Form.Group
                    as={Col}
                    controlId="archivoentrevistadeRetiro"
                    className="mt-2 form-control-gestion"
                  >
                    <Form.Label>Entrevista de retiro</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const fileType = e.target.files[0].type;
                        if (fileType == "application/pdf") {
                          handleArchivoChange("entrevistadeRetiro", e);
                        } else {
                          showError("No es un archivo pdf, vuelve a intentar.");
                          e.target.value = "";
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={3} className="mb-3">
                  {/*Entrevista de retiro*/}
                  <Form.Group
                    as={Col}
                    controlId="archivoaceptacionrenuncia"
                    className="mt-2 form-control-gestion"
                  >
                    <Form.Label>Aceptacion de renuncia</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const fileType = e.target.files[0].type;
                        if (fileType == "application/pdf") {
                          handleArchivoChange("aceptacionRenuncia", e);
                        } else {
                          showError("No es un archivo pdf, vuelve a intentar.");
                          e.target.value = "";
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 ">
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
                <h3>Otros archivos </h3>
                <p>
                  *Por favor, agrega solo un archivo a la vez, de lo contrario,
                  se generará un error.*
                </p>
                <p>Este archivo quedara en una subcarpeta llamada otros</p>
                <p>
                  Asegúrate de asignar un nombre clave al archivo, ya que se
                  formateará de la siguiente manera:
                  'otros_nombrequeestablezcas_fechadesubida.pdf'.
                </p>
                <Tooltip
                  target=".custom-choose-btn"
                  content="Choose"
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
                  itemTemplate={itemTemplate1}
                  emptyTemplate={emptyTemplate}
                  chooseOptions={chooseOptions}
                  uploadOptions={uploadOptions}
                  cancelOptions={cancelOptions}
                  className="form-control-gestion"
                />
              </Row>

              <div className="text-center">
                <Button
                  type="submit"
                  className="p-button p-component p-button-outlined button-gestion"
                >
                  Crear carpeta
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Form>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Formulario;
