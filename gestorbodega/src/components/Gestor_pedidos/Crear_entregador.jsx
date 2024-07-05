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
import { AutoComplete } from "primereact/autocomplete";
import { Button as PrimeButton } from "primereact/button";
import useControl from "../../hooks/useControl";
import useControl_DocumentosIngreso from "../../hooks/useControl_DocumentosIngreso";
import { debounce } from "lodash";
import { Message } from "primereact/message";


export const Crear_entregador = () => {
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
            <strong>Formulario creación entregador</strong>
          </h4>
        </Card.Header>

        <Card.Body className="border-top card-gestion-body mb-2">
         
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
  )
}
