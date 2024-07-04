import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { Button as PrimeButton } from "primereact/button";
import useControl from "../../../hooks/useControl";
import useControl_Compras from "../../../hooks/useControl_Compras";
import { useNavigate } from "react-router-dom";
const CrearProveedor = () => {
  const navigate = useNavigate();
  const { usuario } = useControl();
  const { resCrearCarpeta, setresCrearCarpeta, CrearCarpetaProveedor } =
    useControl_Compras();

  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errores, setErrores] = useState({});
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);
  const [archivos, setArchivos] = useState({
    CamaradeComercio: null,
    Rut: null,
    CedulaRepresentanteLegal: null,
    ReferenciaBancaria: null,
    AutoevaluacionEstandares: null,
    CertificacionSGSST: null,
    CartaAsignacionResponsableSGSST: null,
    LicenciaSST: null,
  });
  const fileUploadRef = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const [otros_archivos, setotros_archivos] = useState({});
  const [tipoProveedor, settipoProveedor] = useState("");

  useEffect(() => {
    if (resCrearCarpeta === 200) {
      setNombre("");
      setDocumento("");
      setArchivos("");
      setTotalSize(0);
      setDescripcion("");
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
      setresCrearCarpeta("");
    }
  }, [resCrearCarpeta]);

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
    if (!nombre.trim()) {
      erroresTemp.nombre = "El nombre  del proveedor es requerido";
    }
    // Validar documento
    if (!documento.trim()) {
      erroresTemp.documento = "El nuemero de identificación es requerido";
    } else if (documento.length < 6 || documento.length > 15) {
      erroresTemp.documento = "El documento debe tener entre 6 y 15 numeros";
    }

    if (!tipoProveedor.trim()) {
      erroresTemp.tipoProveedor = "El tipo del proveedor es requerido";
    }

    setErrores(erroresTemp); //asignamos los mensajes al error temporal
    if (form.checkValidity() === false || Object.keys(erroresTemp).length > 0) {
      // Si hay errores, no se envía el formulario.
      showError(
        `No se ha podido crear el proveedor debido a errores en los campos o campos incompletos.`
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
      CrearCarpetaProveedor(
        {
          nombre,
          documento,
          user,
          tipoProveedor,
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
        <Card className=" d-flex align-items-center card-gestion ">
          <Card.Header className=" mb-1  card-gestion-header">
            <div className="row  align-items-center">
              <div className=" col-md-9 col-lg-9 aling-items-end">
                <h4 className="aling-items-end">
                  <strong>Formulario creación proveedores</strong>
                </h4>
              </div>
              <div className=" col-md-3 col-lg-3">
                <PrimeButton
                  icon="pi pi-arrow-right"
                  className="mr-3 button-oscuro color-icon"
                  onClick={() => {
                    navigate("/listar_proveedores");
                  }}
                  iconPos="right"
                  label="Lista proveedores"
                />
              </div>
            </div>
          </Card.Header>
          <Card.Body className="border-top card-gestion-body mb-2">
            <Row className="mb-3 ">
              {/* Nombre proveedor */}
              <Col xs={12} md={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="nombre"
                  className="form-control-gestion"
                >
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Nombre proveedor"
                    className="mb-1 "
                  >
                    <Form.Control
                      required
                      type="text"
                      placeholder="Nombre proveedor"
                      value={nombre}
                      onChange={(e) => {
                        setNombre(e.target.value);
                      }}  onBlur={(e) => setNombre(e.target.value.trim())
                    }
                    />
                    <Form.Control.Feedback type="invalid">
                      {`Error: ${errores.nombre}`}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
              {/* Numero de identificacion */}
              <Col xs={12} md={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="documento"
                  className="form-control-gestion"
                >
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Numero de identificación o NIT"
                    className="mb-1"
                  >
                    <Form.Control
                      required
                      type="text"
                      placeholder="Numero de identificación"
                      value={documento}
                      onChange={(e) => {
                        let value = e.target.value.replace(
                          /[^0-9 -]|-(?=.*-)/g,
                          ""
                        ); // Eliminar todo lo que no sea dígito
                        // Limitar la longitud a un mínimo de 8 y un máximo de 10 caracteres
                        if (value.length >= 6 && value.length <= 15) {
                          setDocumento(value.replace(/\s+/g, ""));
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
              {/* Tipo de proveedor */}
              <Col xs={12} md={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="tipoProveedor"
                  className="form-control-gestion"
                >
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Tipo de proveedor"
                    className="mb-1"
                  >
                    <Form.Select
                      className="form-control-gestion"
                      required
                      aria-label="Default select example"
                      value={tipoProveedor}
                      onChange={(e) => {
                        settipoProveedor(e.target.value);
                      }}
                    >
                      <option value="">Seleccione un tipo de proveedor</option>
                      <option value="productos">Proveedor de productos</option>
                      <option value="servicios">Proveedor de servicios</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {`Error: ${errores.tipoProveedor}`}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              {/* Camara de comercio */}
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoCamaraComercio"
                  className="mt-2 form-control-gestion"
                >
                  <Form.Label>Cámara de comercio</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target?.files[0]?.type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("CamaradeComercio", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              {/* RUT */}
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoRut"
                  className="mt-2 form-control-gestion"
                >
                  <Form.Label>Rut</Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target?.files[0]?.type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("Rut", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              {/* Representante legal */}
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoRepresentante"
                  className="mt-2 form-control-gestion"
                >
                  <Form.Label>Cedúla representante legal </Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target?.files[0]?.type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("CedulaRepresentanteLegal", e);
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
              {/* Referencia bancaria */}
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoreferanciaBancaria"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Referencia bancaria</Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target?.files[0]?.type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("ReferenciaBancaria", e);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              {/* AutoevaluacionEstandares */}
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoAutoevaluacionEstandares"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Auto evaluación estándares mínimos </Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target?.files[0]?.type;
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
              {/* Cumplimiento sg sst */}
              <Col xs={12} md={4} lg={4} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="CertificacionSGSST"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>
                    Certificación porcentaje cumplimiento SG-SST
                  </Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      /* handleArchivoChange("examenMedico", e) */
                      const fileType = e.target?.files[0]?.type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("CertificacionSGSST", e);
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
              {/* Responsable sg sst */}
              <Col xs={12} md={6} lg={6} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="CartaAsignacionResponsableSGSST"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Carta asignación responsable SG-SST (Opcional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const fileType = e.target?.files[0]?.type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange(
                          "CartaAsignacionResponsableSGSST",
                          e
                        );
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              {/* Licencia SST */}
              <Col xs={12} md={6} lg={6} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="archivoLicenciaSST"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>
                    Licencia SST del responsable del SG-SST vigente (Opcional)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const fileType = e.target?.files[0]?.type;
                      if (fileType == "application/pdf") {
                        handleArchivoChange("LicenciaSST", e);
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
              <Col xs={12} md={12} lg={12} className="mb-3">
                <h3>Otros archivos</h3>
                <p>
                  *Estos archivos deben tener su nombre ya formateado ya que no
                  se les cambiara el nombre, solo se agregará la fecha del
                  cargado
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
                />
              </Col>
              <Col xs={12} md={12} lg={12} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="descripcion"
                  className="mt-3 form-control-gestion"
                >
                  <Form.Label>Comentarios</Form.Label>

                  <Form.Control
                    style={{ minHeight: "150px" }}
                    placeholder="Por favor, ingrese cualquier novedad relacionada con algún archivo o el proveedor..."
                    as="textarea"
                    className="form-control-gestion"
                    value={descripcion}
                    onChange={(e) => {
                      setDescripcion(e.target.value);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-center mb-3">
              <Button
                type="submit"
                className="p-button p-component p-button-outlined button-gestion"
              >
                Crear proveedor
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
};

export default CrearProveedor;
