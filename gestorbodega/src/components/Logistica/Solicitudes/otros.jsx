import React, { useEffect, useState } from "react";
import useContextVentas from "../../../hooks/useControlVentas";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import useControl from "../../../hooks/useControl";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import { formatISO } from "date-fns";
import Card from "react-bootstrap/Card";
import { Chips } from "primereact/chips";
import { MultiSelect } from "primereact/multiselect";

export default function BasicDemo() {
  const { dataadicional, token, jsonlogin } = useControl();
  const { crearSolicitud, setrespuestacrear, respuestacrear } =
    useContextVentas();
  const [validated, setValidated] = useState(false);
  const currentDateTime = formatISO(new Date(), { representation: "complete" });
  const [solicitudMercancia, setsolicitudMercancia] = useState([]);
  const [solicitudCorte, setsolicitudCorte] = useState([]);
  const [selectedSolicitudes, setSelectedSolicitudes] = useState([]);
  const [selectedSolicitudesTr, setSelectedSolicitudesTr] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const [solicitud, setsolicitud] = useState({
    numero_solicitud: "",
    quien_recibe: "",
    nombres_y_apellidos_de_quien_recibe: "",
    tipo_documento: "",
    numero_de_documento: "",
    nombre_tercero: "",
    fecha_pactada: "",
    tipo_de_entrega: "",
    observacion: "",
    estado: "REPORTADO",
    fecha_creacion: currentDateTime,
    fecha_ultima_actualizacion: null,
    acepta_comunicacion_con_cortes: null,
    almacen_de_origen: jsonlogin.almacen_de_origen,
    creado_por: jsonlogin.nombre + " " + jsonlogin.apellido,
  });
  const [infoAdicional, setinfoadicional] = useState({
    cargos: [],
    areas: [],
    tipoDoc: [],
  });

  useEffect(() => {
    // Combinar solicitudes de mercancia y corte en un solo array
    const combinedOptions = [...solicitudMercancia, ...solicitudCorte].map(
      (solicitud, index) => ({
        label: solicitud,
        value: index,
      })
    );
    setAllOptions(combinedOptions);
  }, [solicitudMercancia, solicitudCorte]);

  const filterOptions = (selectedOptions) => {
    return allOptions.filter(
      (option) => !selectedOptions.includes(option.value)
    );
  };

  const delayedRequest = debounce(() => {
    setinfoadicional(dataadicional);
  }, 500);

  useEffect(() => {
    delayedRequest();
  }, []);

  useEffect(() => {
    if (respuestacrear) {
      setsolicitud({
        numero_solicitud: "",
        nit_cliente: "",
        quien_recibe: "",
        nombres_y_apellidos_de_quien_recibe: "",
        tipo_documento: "",
        numero_de_documento: "",
        nombre_tercero: "",
        fecha_pactada: "",
        tipo_de_entrega: "",
        observacion: "",
        estado: "REPORTADO",
        fecha_creacion: currentDateTime,
        fecha_ultima_actualizacion: null,
        acepta_comunicacion_con_cortes: null,
        almacen_de_origen: jsonlogin.almacen_de_origen,
        creado_por: jsonlogin.nombre + " " + jsonlogin.apellido,
      });
      setrespuestacrear(false);
    }
  }, [respuestacrear]);

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    const tipoEntrega = form.elements["tipo_de_entrega"].value;
    const tipoQuien = form.elements["quien_recibe"].value;
    if (tipoQuien === "" || tipoEntrega === "") {
      setValidated(false);
      if (tipoQuien === "") {
        form.elements["quien_recibe"].setCustomValidity(
          "Por favor, seleccione quien recibe."
        );
      }
      if (tipoEntrega === "") {
        form.elements["tipo_de_entrega"].setCustomValidity(
          "Por favor, seleccione el tipo de entrega."
        );
      }
    } else {
      form.elements["quien_recibe"].setCustomValidity("");
      form.elements["tipo_de_entrega"].setCustomValidity("");
    }

    if (form.checkValidity() === false) {
      return e.preventDefault(), e.stopPropagation(), setValidated(true);
    }

    const confirmacion = await crearSolicitud(
      solicitud,
      token,
      solicitudMercancia,
      solicitudCorte
    );
    if (confirmacion) {
      console.log("Solicitud creada");
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = value;

    if (type === "number" && value.length > 15) {
      Swal.fire({
        icon: "error",
        title: "Excede el limite de numeros",
        text: "por favor, revise el numero del documento",
      });
      return;
    }

    if (type === "text") {
      newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜ\s]/g, "");
      newValue =
        name === "nombre_tercero"
          ? newValue.toUpperCase()
          : newValue
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    setsolicitud((prevSolicitud) => ({
      ...prevSolicitud,
      [name]: newValue,
    }));
  };

  const onChangeSolicitudes = (e) => {
    const { value, name } = e.target;
    const newValues = value.map((val) => val.slice(0, 10));
    const hasExceededLimit = value.some((val) => val.length > 10);

    if (hasExceededLimit) {
      Swal.fire({
        icon: "error",
        title: "Excede el límite de números",
        text: "Cada solicitud debe tener un máximo de 10 números.",
      });
    } else {
      if (name === "solicitudMercancia") {
        setsolicitudMercancia(newValues);
      } else {
        setsolicitudCorte(newValues);
      }
    }
  };

  // Combinar solicitudes de mercancia y corte para usar en el MultiSelect
  const combinedSolicitudes = [...solicitudMercancia, ...solicitudCorte].map(
    (solicitud, index) => ({
      label: solicitud,
      value: index,
    })
  );

  const combinedSolicitudesTr = [...solicitudMercancia, ...solicitudCorte].map(
    (solicitud, index) => ({
      label: solicitud,
      value: index,
    })
  );

  return (
    <Container className="mt-3">
      <Card className="d-flex align-items-center card-gestion">
        <Card.Header className="mb-1 card-gestion-header">
          <h4>
            <strong>Reporte de solicitudes a la bodega carrera 43</strong>
          </h4>
        </Card.Header>
        <Card.Body className="border-top card-gestion-body mb-2">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                md="4"
                controlId="nit_cliente"
                className="form-control-gestion"
              >
                <Form.Label>Nit del cliente</Form.Label>
                <Form.Control
                  required
                  type="number"
                  name="nit_cliente"
                  onChange={handleChange}
                  value={solicitud.nit_cliente}
                />
                <Form.Control.Feedback></Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                md="4"
                controlId="solicitudMercancia"
                className="form-control-gestion"
              >
                <Form.Label>Numero de solicitud de mercancia</Form.Label>
                <Chips
                  as={Col}
                  md="4"
                  value={solicitudMercancia}
                  keyfilter="int"
                  onChange={onChangeSolicitudes}
                  name="solicitudMercancia"
                />
                <Form.Control.Feedback></Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                md="4"
                controlId="solicitudCorte"
                className="form-control-gestion"
              >
                <Form.Label>Numero de solicitud para cortes</Form.Label>
                <Chips
                  as={Col}
                  md="4"
                  value={solicitudCorte}
                  onChange={onChangeSolicitudes}
                  name="solicitudCorte"
                />
                <Form.Control.Feedback></Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  md="4"
                  controlId="selectedSolicitudes"
                  className="form-control-gestion"
                >
                  <Form.Label>
                    Solicitudes a Recoger por trasportadora
                  </Form.Label>
                  <MultiSelect
                    value={selectedSolicitudesTr}
                    options={filterOptions(selectedSolicitudes)}
                    onChange={(e) => setSelectedSolicitudesTr(e.value)}
                    placeholder="Seleccione las solicitudes a recoger"
                    display="chip"
                  />
                  <Form.Control.Feedback></Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="4"
                  controlId="selectedSolicitudes"
                  className="form-control-gestion"
                >
                  <Form.Label>
                    Solicitudes a Recoger por personal autorizado
                  </Form.Label>
                  <MultiSelect
                    value={selectedSolicitudes}
                    options={filterOptions(selectedSolicitudesTr)}
                    onChange={(e) => setSelectedSolicitudes(e.value)}
                    placeholder="Seleccione las solicitudes a recoger"
                    display="chip"
                  />
                  <Form.Control.Feedback></Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mt-3 form-control-gestion" as={Col} md="4" controlId="tipo_documento">
                    <Form.Label>Tipo de documento de quien recoge</Form.Label>
                    <Form.Select
                      type="text"
                      required
                      name="tipo_documento"
                      onChange={handleChange}
                    >
                      <option value={solicitud.tipo_documento}>Seleccione...</option>
                      {infoAdicional.tipoDoc.map((tipoDocumento) => (
                        <option key={tipoDocumento.id_tipo_documento} value={tipoDocumento.abreviacion}>
                          {tipoDocumento.nombre_tipo_documento}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">Por favor, completa este campo</Form.Control.Feedback>
                  </Form.Group>
              </Row>
            </Row>
            {/* Tabla para transportadora */}
            {selectedSolicitudesTr.length > 0 && (
              <div>
                <h5>Solicitudes por transportadora</h5>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Solicitud</th>
                      <th>Nombre del transportador</th>
                      <th>Observacion del material a recoger</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSolicitudesTr.map((solicitud, index) => (
                      <tr key={index}>
                        <td>{allOptions[solicitud].label? allOptions[solicitud].label : ""}</td>
                        <td>
                          <Form.Control placeholder="Nombre del transportador" />
                        </td>
                        <td>
                          <Form.Control placeholder="Comentarios" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Tabla para persona autorizada */}
            {selectedSolicitudes.length > 0 && (
              <div>
                <h5>Solicitudes por personal autorizado</h5>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Solicitud</th>
                      <th>Nombre</th>
                      <th>Tipo de documento</th>
                      <th>Número de documento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSolicitudes.map((solicitud, index) => (
                      <tr key={index}>
                        <td>{allOptions[solicitud].label}</td>
                        <td>
                          <Form.Control placeholder="Nombre" />
                        </td>
                        <td>
                          <Form.Select>
                            <option value="">Seleccione tipo de documento</option>
                            {/* Opciones de tipos de documento */}
                          </Form.Select>
                        </td>
                        <td>
                          <Form.Control placeholder="Número de documento" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Button
              type="submit"
              className="p-button p-component p-button-outlined button-gestion"
            >
              Enviar Solicitud
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
