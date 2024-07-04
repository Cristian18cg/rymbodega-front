import React, { useState, useEffect } from "react";
import useContextlogistica from "../../../../hooks/useControllogistica";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import useControl from "../../../../hooks/useControl";
import Swal from "sweetalert2";

const ActualizarVehiculo = ({ datosOriginales, handleClose }) => {
  const { token } = useControl();
  const { actualizarVehiculo } = useContextlogistica();
  const [validated, setValidated] = useState(false);
  const [datosnuevos, setdata] = useState(datosOriginales);
  const [error, setError] = useState("");
  const [errorFile, setErrorfile] = useState("");
  const [fechaimpuesto, setfechaimpuesto] = useState(
    datosnuevos.fecha_vencimiento_impuesto
  );
  const [fechatecnico, setfechatecnico] = useState(
    datosnuevos.fecha_vencimiento_tecnico_mecanica
  );
  const [fechasoat, setfechasoat] = useState(
    datosnuevos.fecha_vencimiento_soat
  );

  const oneYearImpuestos = new Date(fechaimpuesto);
  oneYearImpuestos.setFullYear(oneYearImpuestos.getFullYear() + 1);

  const oneYearLaterTecnico = new Date(fechatecnico);
  oneYearLaterTecnico.setFullYear(oneYearLaterTecnico.getFullYear() + 1);

  const oneYearLaterSoat = new Date(fechasoat);
  oneYearLaterSoat.setFullYear(oneYearLaterSoat.getFullYear() + 1);

  const actVehiculo = async (event) => {
    try {
      const datosctualizados = {};
      for (const key in datosnuevos) {
        if (
          datosnuevos.hasOwnProperty(key) &&
          (
            !datosOriginales.hasOwnProperty(key) || // Si la propiedad no existe en los datos originales
            typeof datosnuevos[key] !== typeof datosOriginales[key] || // Si el tipo de dato es diferente
            datosnuevos[key] !== datosOriginales[key] || // Si el valor es diferente
            (typeof datosnuevos[key] === 'object' && datosnuevos[key] instanceof File) // Si el valor es un archivo PDF
          )
        ) {
          datosctualizados[key] = datosnuevos[key];
        }
      }
      if (Object.keys(datosctualizados).length == 0) { 
        return alert("Ningun dato actualizado");
      }
      const result = await Swal.fire({
        title: `¿Esta seguro de actualizar los datos del siguiente vehiculo ${datosOriginales.placa}`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
      });
      if (result.isConfirmed) {
        const confirmacion = await actualizarVehiculo(
          datosctualizados,
          datosOriginales.id_vehiculo,
          token
        );
        if (confirmacion) {
          handleClose();
        }
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  const handleChange = (e) => {
    const selectedDate = new Date(e.target.value);
    if (e.target.name == "fecha_vencimiento_impuesto") {
      if (isNaN(selectedDate.getTime())) {
        setError("Fecha no válida. Por favor, introduce una fecha válida.");
      } else if (selectedDate > oneYearImpuestos) {
        setError(
          "La fecha seleccionada no puede ser posterior a un año después de la fecha de vencimiento técnico."
        );
      } else {
        setError("");
        setdata((prevState) => ({
          ...prevState,
          fecha_vencimiento_impuesto: e.target.value.replace(/[^0-9\-]/g, ""), // Solo permitir caracteres de fecha
        }));
      }
    } else if (e.target.name == "fecha_vencimiento_tecnico_mecanica") {
      if (isNaN(selectedDate.getTime())) {
        setError("Fecha no válida. Por favor, introduce una fecha válida.");
      } else if (selectedDate > oneYearLaterTecnico) {
        setError(
          "La fecha seleccionada no puede ser posterior a un año después de la fecha de vencimiento técnico."
        );
      } else {
        setError("");
        setdata((prevState) => ({
          ...prevState,
          fecha_vencimiento_tecnico_mecanica: e.target.value.replace(
            /[^0-9\-]/g,
            ""
          ), // Solo permitir caracteres de fecha
        }));
      }
    } else if (e.target.name == "fecha_vencimiento_soat") {
      if (isNaN(selectedDate.getTime())) {
        setError("Fecha no válida. Por favor, introduce una fecha válida.");
      } else if (selectedDate > oneYearLaterSoat) {
        setError(
          "La fecha seleccionada no puede ser posterior a un año después de la fecha de vencimiento técnico."
        );
      } else {
        setError("");
        setdata((prevState) => ({
          ...prevState,
          fecha_vencimiento_soat: e.target.value.replace(/[^0-9\-]/g, ""), // Solo permitir caracteres de fecha
        }));
      }
    }
    if (e.target.type === "file") {  
      const fileType = e.target.files[0].type;
      if (fileType == "application/pdf") {
          datosnuevos[e.target.name] = e.target.files[0];
          setErrorfile("");
      } else {
        datosnuevos[e.target.name] = "";
        e.target.value = "";
        Swal.fire({
          icon: "error",
          title: "Archivo no permitido",
          text: "Elija un archivo .pdf",
        });
      }
    }
  };

  return (
    
      <Modal
        className="border border-warning"
        show={true}
        onHide={handleClose}
        dialogClassName="modal-registrar"
      >
        <Modal.Header className="table-u text-dark" closeButton>
          <Modal.Title>Actualizar Vehiculo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom01">
                <Form.Label>PLaca</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={datosnuevos.placa}
                  disabled
                  onChange={(e) => {
                    const newValue = e.target.value.toUpperCase();
                    const formattedValue = newValue
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 6);
                    setdata((prevState) => ({
                      ...prevState,
                      placa: formattedValue,
                    }));
                  }}
                />
                <Form.Control.Feedback>Bien!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Por favor, completa este campo
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom01">
                <Form.Label>Numero Licencia de Transito</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={datosnuevos.numero_licencia_transito}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    const formattedValue = newValue
                      .replace(/\D/g, "")
                      .slice(0, 15);
                    setdata((prevState) => ({
                      ...prevState,
                      numero_licencia_transito: formattedValue,
                    }));
                  }}
                />
                <Form.Control.Feedback>Bien!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Por favor, completa este campo
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>Fecha de vigencia Impuestos</Form.Label>
                <Form.Control
                  type="date"
                  required
                  min={fechaimpuesto}
                  max={oneYearImpuestos.toISOString().split("T")[0]}
                  name="fecha_vencimiento_impuesto"
                  value={datosnuevos.fecha_vencimiento_impuesto}
                  onChange={handleChange}
                  onKeyDown={(e) => e.preventDefault()}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Form.Control.Feedback>Bien!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Por favor, completa este campo
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>Fecha de vigencia TECNICO MECANICA</Form.Label>
                <Form.Control
                  type="date"
                  required
                  min={fechatecnico}
                  max={oneYearLaterTecnico.toISOString().split("T")[0]}
                  name="fecha_vencimiento_tecnico_mecanica"
                  value={datosnuevos.fecha_vencimiento_tecnico_mecanica}
                  onChange={handleChange}
                  onKeyDown={(e) => e.preventDefault()}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Form.Control.Feedback>Bien!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Por favor, completa este campo
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>Fecha de vigencia SOAT</Form.Label>
                <Form.Control
                  type="date"
                  required
                  min={fechasoat}
                  max={oneYearLaterSoat.toISOString().split("T")[0]}
                  name="fecha_vencimiento_soat"
                  value={datosnuevos.fecha_vencimiento_soat}
                  onChange={handleChange}
                  onKeyDown={(e) => e.preventDefault()}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Form.Control.Feedback>Bien!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Por favor, completa este campo
                </Form.Control.Feedback>
              </Form.Group>
            <Row>
                  <Form.Group
                    as={Col}
                    controlId="soatFile"
                    className="form-control-gestion mb-3"
                  >
                    <Form.Label>
                      Seguro Obligatorio de Accidentes de Tránsito (SOAT)
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      size="sm"
                      required
                      name="docSoat"
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
                    controlId="tecnicomecanicaFile"
                    className="form-control-gestion mb-3"
                  >
                    <Form.Label>
                      Certificación de Revisión Técnico-Mecánica y de Gases
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      size="sm"
                      required
                      name="docTenicomecanica"
                      multiple={false}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, completa este campo
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    controlId="licenciaFile"
                    className="form-control-gestion  mb-3"
                  >
                    <Form.Label>
                      {" "}
                      Tarjeta de Propiedad <br />
                      Vehicular
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      size="sm"
                      required
                      name="docLicenciadetransito"
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
            </Row>
            <div className="modal-footer">
              <Button variant="danger" size="sm" onClick={handleClose}>
                Cancelar
              </Button>
              <Button size="sm" onClick={actVehiculo}>
                Actualizar
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

  );
};

export default ActualizarVehiculo;
