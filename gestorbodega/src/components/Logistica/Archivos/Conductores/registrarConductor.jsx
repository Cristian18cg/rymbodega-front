import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import useControl from "../../../../hooks/useControl";
import useContextlogistica from "../../../../hooks/useControllogistica";
import Swal from "sweetalert2";
import { format } from "date-fns";

const Registrarconductor = ({ modalcrearConductor, handleClosecrear }) => {
  const { token, dataadicional } = useControl();
  const { crearConductor } = useContextlogistica();
  const [validated, setValidated] = useState(false);
  const [errorFile, setErrorfile] = useState("");
  const [infoAdicional, setinfoadicional] = useState({
    cargos: [],
    areas: [],
    tipoDoc: [],
  });
  const [data, setData] = useState({
    tipo_de_documento: "",
    numero_documento: "",
    categoria_autorizada: "",
    nombres: "",
    apellidos: "",
    vigencia: "",
    docCedula: null,
    docLicencia: null,
    docParafiscales: null,
  });
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 3);
  const oneYearLater = maxDate.toISOString().split("T")[0];

  useEffect(() => {
    setinfoadicional(dataadicional);
  }, []);

  const handleChange = (e) => {
    let conductorData = {
      ...data,
      [e.target.name]: e.target.value,
    };
    if (e.target.type === "number") {
      const value = e.target.value;
      if (value.length <= 15) {
        const newValue = e.target.value.replace(/[^0-9]/g, "");
        conductorData[e.target.name] = newValue;
      } else {
        Swal.fire({
          icon: "error",
          title: "Excede el limite de numeros",
          text: "por favor, revise el numero del documento",
        });
      }
    } else if (e.target.type === "text") {
      const newValue = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜ\s]/g, "");
      const value = newValue.toLowerCase();
      const formattedText = value.replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
      conductorData[e.target.name] = formattedText;
    } else if (e.target.type === "file") {
      const fileType = e.target.files[0].type;
      if (fileType == "application/pdf") {
        conductorData[e.target.name] = e.target.files[0];
        setErrorfile("");
      } else {
        conductorData[e.target.name] = "";
        e.target.value = "";
        Swal.fire({
          icon: "error",
          title: "Archivo no permitido",
          text: "Elija un archivo .pdf",
        });
      }
    } else if (e.target.type === "date") {
      const fechaFormateada = format(e.target.value, "yyyy-MM-dd");
      conductorData[e.target.name] = fechaFormateada;
    }
    setData(conductorData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      return (
        event.preventDefault(), event.stopPropagation(), setValidated(true)
      );
    }
    if (form.numero_documento.value.length < 6) {
      return Swal.fire({
        icon: "error",
        title: "Revise el numero de documento",
        text: "por favor, revise el numero del documento",
      });
    } 
    const confirmacion = await crearConductor(data, token)
    if (confirmacion) {
      resetForm();
      form.tipo_de_documento.value = "Seleccione...";
      form.categoria_autorizada.value = "Seleccione...";
      form.docLicencia.value = "";
      form.docCedula.value = "";
      form.docParafiscales.value = "";
      form.vigencia.value = "";
    }
  };

  const resetForm = () => {
    setData({
      tipo_de_documento: "",
      numero_documento: "",
      categoria_autorizada: "",
      nombres: "",
      apellidos: "",
      vigencia: "",
      docCedula: null,
      docLicencia: null,
      docParafiscales: null,
    });
    setValidated(false);
  };

  return (
  
      <div className="formCond">
        <Modal
          className="border border-warning"
          show={modalcrearConductor}
          onHide={handleClosecrear}
          dialogClassName="modal-registrar"
          centered
        >
          <Modal.Header 
            className="border border-warning bg-dark text-white"
            closeButton
          >
            <Modal.Title>Agregar Conductor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              className="h-tp formCond rowform m-4 p-3 border"
              name="registrarConductor"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
              
            >
              <Row className="mb-3 ">
                <Row>
                  <Form.Group
                    className="mt-3 form-control-gestion"
                    as={Col}
                    md="4"
                    controlId="nombreConductor"
                    
                  >
                    <Form.Label>Nombre del conductor</Form.Label>
                    <Form.Control
                      required
                      name="nombres"
                      type="text"
                      placeholder="Nombres"
                      onChange={handleChange}
                      value={data.nombres}
                    />
                    <Form.Control.Feedback></Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      Por favor, completa este campo
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    className="mt-3 form-control-gestion"
                    as={Col}
                    md="4"
                    controlId="apellidoConductor"
                  >
                    <Form.Label>Apellido del conductor</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="apellidos"
                      placeholder="Apellidos"
                      onChange={handleChange}
                      value={data.apellidos}
                    />
                    <Form.Control.Feedback></Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      Por favor, completa este campo
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    className="mt-3 form-control-gestion"
                    as={Col}
                    md="4"
                    controlId="tipodocConductor"
                  >
                    <Form.Label>Tipo de documento</Form.Label>
                    <Form.Select
                      type="text"
                      required
                      name="tipo_de_documento"
                      onChange={handleChange}
                    >
                      <option value={data.tipo_de_documento}>
                        Seleccione...
                      </option>
                      {infoAdicional.tipoDoc.map((tipoDocumento) => (
                        <option
                          key={tipoDocumento.id_tipo_documento}
                          value={tipoDocumento.abreviacion}
                        >
                          {tipoDocumento.nombre_tipo_documento}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Por favor, completa este campo
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Control.Feedback type="invalid">
                    Please choose a username.
                  </Form.Control.Feedback>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="numerocedConductor"
                    className="form-control-gestion"
                  >
                    <Form.Label>Numero de Documento</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Numero de documento"
                      name="numero_documento"
                      required
                      onChange={handleChange}
                      value={data.numero_documento}
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, completa este campo
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="categoriaConductor"
                    className="form-control-gestion"
                  >
                    <Form.Label>Categoria de la licencia</Form.Label>
                    <Form.Select
                      type="text"
                      placeholder="Categoria"
                      name="categoria_autorizada"
                      required
                      onChange={handleChange}
                    >
                      <option value={data.categoria_autorizada}>
                        Seleccione...
                      </option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="B3">B3</option>
                      <option value="C1">C1</option>
                      <option value="C2">C2</option>
                      <option value="C3">C3</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Por favor, completa este campo
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="fechaLicencia"
                    className="form-control-gestion"
                  >
                    <Form.Label>
                      Fecha de la vigencia de la licencia de conduccion
                    </Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Fecha"
                      required
                      min={today}
                      onChange={handleChange}
                      name="vigencia" // Fecha mínima es la fecha actual
                      max={oneYearLater}
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, completa este campo
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                {/* ARCHIVOS */}
                <Row>
                  <Form.Group
                    as={Col}
                    controlId="cedulaFile"
                    className="form-control-gestion mb-3"
                  >
                    <Form.Label>Cedula</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      size="sm"
                      required
                      name="docCedula"
                      multiple={false}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, completa este campo
                    </Form.Control.Feedback>
                    {errorFile && (
                      <div className="text-danger">{errorFile}</div>
                    )}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    controlId="licenciaFile"
                    className="form-control-gestion mb-3"
                  >
                    <Form.Label>Licencia de Conduccion</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      size="sm"
                      required
                      name="docLicencia"
                      multiple={false}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, completa este campo
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    controlId="parafiscalesFile"
                    className="form-control-gestion  mb-3"
                  >
                    <Form.Label>Parafiscales</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      size="sm"
                      required
                      name="docParafiscales"
                      multiple={false}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, completa este campo
                    </Form.Control.Feedback>
                    {errorFile && (
                      <div className="text-danger">{errorFile}</div>
                    )}
                  </Form.Group>
                </Row>
                <Col md="5"></Col>
                <Col md="2">
                  <Button
                    md="2"
                    className="md-2 button-registrar-conductor mt-4"
                    variant="warning"
                    type="submit"
                    size="sm"
                  >
                    Registrar Conductor
                  </Button>
                </Col>
                <Col md="5" />
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    
  );
};

export default Registrarconductor;
