import React, { useState, useEffect } from "react";
import useContextlogistica from "../../../../hooks/useControllogistica";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import useControl from "../../../../hooks/useControl";
import Swal from "sweetalert2";

const ActualizarConductor = ({ datosOriginales, handleClose }) => {
  const { token, dataadicional, usuario } = useControl();
  const { actualizarConductor } = useContextlogistica();
  const [validated, setValidated] = useState(false);
  const [datosnuevos, setdata] = useState(datosOriginales);
  const [errorFile, setErrorfile] = useState("");
  const [vigenciaLicencia, setvigenciaLicencia] = useState(
    datosnuevos.vigencia
  );
  const [fechaLicencia, setLicencia] = useState(
    datosnuevos.vigencia
  );
  const [error, setError] = useState("");
  const [infoAdicional, setinfoadicional] = useState({
    cargos: [],
    areas: [],
    tipoDoc: [],
  });

  const oneYearLater = new Date(vigenciaLicencia);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 4);

  useEffect(() => {
    setinfoadicional(dataadicional);
  }, []);

  const actConductor = async (event) => {
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
        title: `¿Esta seguro de actualizar los datos de ${datosOriginales.nombres} ${datosOriginales.apellidos}`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
      });
      if (result.isConfirmed) {
        const confirmacion = await actualizarConductor(
          datosctualizados,
          datosOriginales.id_conductor,
          token,
          usuario
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
    if(e.target.name == "fechaVigencia"){
      if (isNaN(selectedDate.getTime())) {
        setError("Fecha no válida. Por favor, introduce una fecha válida.");
      } else if (selectedDate > oneYearLater) {
        setError(
          "La fecha seleccionada no puede ser posterior a un año después de la fecha de vencimiento técnico."
        );
      } else {
        setError("");
        setdata((prevState) => ({
          ...prevState,
          vigencia: e.target.value.replace(/[^0-9\-]/g, ""), // Solo permitir caracteres de fecha
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
        <Modal.Title>Actualizar Conductor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated}>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustom01">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                required
                value={datosnuevos.nombres}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const formattedValue = newValue
                    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜ\s-]/g, "") // Permite solo letras, espacios y guiones
                    .split(" ") // Divide el string en palabras
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    ) // Capitaliza cada palabra
                    .join(" "); // Une las palabras de nuevo en un string
                  setdata((prevState) => ({
                    ...prevState,
                    nombres: formattedValue.replace(
                      /[^a-zA-ZáéíóúÁÉÍÓÚüÜ\s]/g,
                      ""
                    ),
                  }));
                }}
              />
              <Form.Control.Feedback>Bien!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Por favor, completa este campo
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="validationCustom01">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                required
                value={datosnuevos.apellidos}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const formattedValue = newValue
                    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜ\s-]/g, "") // Permite solo letras, espacios y guiones
                    .split(" ") // Divide el string en palabras
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    ) // Capitaliza cada palabra
                    .join(" "); // Une las palabras de nuevo en un string
                  setdata((prevState) => ({
                    ...prevState,
                    apellidos: formattedValue.replace(
                      /[^a-zA-ZáéíóúÁÉÍÓÚüÜ\s]/g,
                      ""
                    ),
                  }));
                }}
              />
              <Form.Control.Feedback>Bien!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Por favor, completa este campo
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom04">
              <Form.Label>Tipo de documento</Form.Label>
              <Form.Select
                type="text"
                value={datosnuevos.tipo_de_documento}
                required
                onChange={(e) =>
                  setdata((prevState) => ({
                    ...prevState,
                    tipo_de_documento: e.target.value,
                  }))
                }
              >
                {" "}
                <option value="">Seleccione...</option>
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
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustom01">
              <Form.Label>Numero de documento</Form.Label>
              <Form.Control
                type="number"
                required
                disabled
                value={datosnuevos.numero_documento}
                onChange={(e) =>
                  setdata((prevState) => ({
                    ...prevState,
                    numero_documento: e.target.value,
                  }))
                }
              />
              <Form.Control.Feedback>Bien!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Por favor, completa este campo
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom01">
              <Form.Label>Fecha de vigencia de la licencia</Form.Label>
              <Form.Control
                type="date"
                min={fechaLicencia}
                max={oneYearLater.toISOString().split("T")[0]}
                value={datosnuevos.vigencia}
                onChange={handleChange}
                name="fechaVigencia"
                onKeyDown={(e) => e.preventDefault()}
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <Form.Control.Feedback>Bien!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Por favor, completa este campo
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom01">
              <Form.Label>Tipo de licencia</Form.Label>
              <Form.Select
                type="text"
                placeholder="Categoria"
                name="categoria_autorizada"
                required
                value={datosnuevos.categoria_autorizada}
                onChange={(e) =>
                  setdata((prevState) => ({
                    ...prevState,
                    categoria_autorizada: e.target.value,
                  }))
                }
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="B3">B3</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
                <option value="C3">C3</option>
              </Form.Select>
            </Form.Group>
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
                  </Form.Group>
                </Row>
          </Row>

          <div className="modal-footer">
            <Button variant="danger" size="sm" onClick={handleClose}>
              Cancelar
            </Button>
            <Button size="sm" onClick={actConductor}>
              Actualizar
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default ActualizarConductor;
