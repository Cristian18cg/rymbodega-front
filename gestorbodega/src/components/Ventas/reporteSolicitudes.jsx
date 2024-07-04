import React, { useEffect, useState } from "react";
import useContextVentas from "../../hooks/useControlVentas";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import useControl from "../../hooks/useControl";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import { formatISO } from "date-fns";
import Card from "react-bootstrap/Card";
import { Chips } from "primereact/chips";
import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";

const ReporteSolicitudes = () => {
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
  const [totalSolicitudes, settotalSolicitudes] = useState("");
  const [nit_cliente, setnit_cliente] = useState("");
  const [nombreEmpresa, setnombreEmpresa] = useState("");
  const [personasAutorizadas, setPersonasAutorizadas] = useState([]);
  const [transportadoras, setTransportadoras] = useState([]);
  const [copyDataToRows, setCopyDataToRows] = useState(false);
  const [copyDataToRowsTwo, setCopyDataToRowsTwo] = useState(false);
  const [fecha_pactada, setfecha_pactada] = useState("");
  const [infoAdicional, setinfoadicional] = useState({
    cargos: [],
    areas: [],
    tipoDoc: [],
  });

  useEffect(() => {
    // Combinar solicitudes de mercancia y corte en un solo array
    const combinedOptionsSolicitudes = [
      ...solicitudMercancia,
      ...solicitudCorte,
    ];
    settotalSolicitudes(combinedOptionsSolicitudes);
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
    setPersonasAutorizadas(
      selectedSolicitudes.map((solicitud) => ({
        solicitud: allOptions[solicitud].label,
        tipo_solicitud: solicitudMercancia.includes(allOptions[solicitud].label)
          ? "MERCANCIA"
          : "CORTES",
        nit_cliente: nit_cliente,
        nombreEmpresa: nombreEmpresa,
        estado: "REPORTADO",
        almacen_de_origen: jsonlogin.almacen_de_origen,
        creado_por: jsonlogin.nombre + " " + jsonlogin.apellido,
        fecha_creacion: currentDateTime,
        fecha_ultima_actualizacion: null,
        fecha_pactada: fecha_pactada,
      }))
    );
  }, [selectedSolicitudes, nit_cliente, allOptions]);

  useEffect(() => {
    if (respuestacrear) {
      setrespuestacrear(false);
    }
  }, [respuestacrear]);

  useEffect(() => {
    setTransportadoras(
      selectedSolicitudesTr.map((solicitud) => ({
        solicitud: allOptions[solicitud].label,
        tipo_solicitud: solicitudCorte.includes(allOptions[solicitud].label)
          ? "CORTES"
          : "MERCANCIA",
        nit_cliente: nit_cliente,
        nombreEmpresa: nombreEmpresa,
        estado: "REPORTADO",
        almacen_de_origen: jsonlogin.almacen_de_origen,
        creado_por: jsonlogin.nombre + " " + jsonlogin.apellido,
        fecha_creacion: currentDateTime,
        fecha_ultima_actualizacion: null,
        fecha_pactada: fecha_pactada,
      }))
    );
  }, [selectedSolicitudesTr, nit_cliente, allOptions]);

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();

    // Validaciones específicas para las tablas
    let isValid = true;
    let validationMessages = [];
    const selectedValues = [...selectedSolicitudes, ...selectedSolicitudesTr];
    const allOptionsValues = allOptions.map((option) => option.value);
    const missingOptions = allOptionsValues.filter(
      (value) => !selectedValues.includes(value)
    );

    if (missingOptions.length > 0) {
      const missingOptionsLabels = missingOptions.map(
        (value) => allOptions.find((option) => option.value === value).label
      );
      Swal.fire({
        icon: "error",
        title: "Opciones faltantes",
        html: `Por favor, seleccione todas las opciones: <br/>${missingOptionsLabels.join(
          ", "
        )} segun corresponda`,
      });
      return;
    }
    // Validar transportadoras
    if (selectedSolicitudesTr.length > 0) {
      transportadoras.forEach((transportadora, index) => {
        if (!transportadora.nombreTransportador) {
          isValid = false;
          validationMessages.push(
            `Transportadora ${index + 1} no tiene nombre.`
          );
        }
        if (!transportadora.observacion) {
          isValid = false;
          validationMessages.push(
            `Transportadora ${index + 1} no tiene observación.`
          );
        }
      });
    }

    // Validar personas autorizadas
    if (selectedSolicitudes.length > 0) {
      personasAutorizadas.forEach((persona, index) => {
        if (!persona.nombre) {
          isValid = false;
          validationMessages.push(
            `Persona autorizada ${index + 1} no tiene nombre.`
          );
        }
        if (!persona.tipoDocumento) {
          isValid = false;
          validationMessages.push(
            `Persona autorizada ${index + 1} no tiene tipo de documento.`
          );
        }
        if (!persona.numeroDocumento) {
          isValid = false;
          validationMessages.push(
            `Persona autorizada ${index + 1} no tiene número de documento.`
          );
        }
        if (!persona.observacion) {
          isValid = false;
          validationMessages.push(
            `Persona autorizada ${index + 1} no tiene observacion.`
          );
        }
      });
    }

    if (!isValid) {
      Swal.fire({
        icon: "error",
        title: "Error en la validación",
        html: validationMessages.join("<br />"),
      });
      return;
    }
    if (form.checkValidity() === false) {
      return e.preventDefault(), e.stopPropagation(), setValidated(true);
    }
    console.log("totalSolicitudes :: :" + JSON.stringify(totalSolicitudes));

    const confirmacion = await crearSolicitud(
      totalSolicitudes,
      token,
      transportadoras,
      personasAutorizadas
    );
    if (confirmacion) {
      resetForm();
      console.log("Solicitud creada");
    }
  };

  const resetForm = () => {
    setnit_cliente("");
    setsolicitudMercancia([]);
    setsolicitudCorte([]);
    setSelectedSolicitudes([]);
    setSelectedSolicitudesTr([]);
    setPersonasAutorizadas([]);
    setTransportadoras([]);
    setfecha_pactada("");
    setnombreEmpresa("");
  };

  const handleChange = (e) => {
    const valor = e.target.value;
    if (e.target.name == "nit_cliente") {
      if (valor.length <= 10) {
        const newValue = valor.replace(/[^0-9]/g, "");
        setnit_cliente(newValue);
      } else {
        Swal.fire("Error", "El NIT no puede tener más de 10 dígitos", "error");
        return;
      }
    } else if (e.target.name == "nombreEmpresa") {
      const newValue = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜ\s]/g, "");
      const value = newValue.toLowerCase();
      const formattedText = value.replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );

      setnombreEmpresa(formattedText);
    }
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

  const handlePersonaAutorizadaChange = (index, campo, valor) => {
    setPersonasAutorizadas((prevPersonasAutorizadas) => {
      const nuevasPersonasAutorizadas = [...prevPersonasAutorizadas];
      if (copyDataToRows && index === 0) {
        // Copiar los datos de la primera fila a todas las filas
        nuevasPersonasAutorizadas.forEach((persona, i) => {
          persona[campo] = valor;
        });
      } else {
        if (!nuevasPersonasAutorizadas[index]) {
          nuevasPersonasAutorizadas[index] = {};
        }
        nuevasPersonasAutorizadas[index][campo] = valor;
      }
      return nuevasPersonasAutorizadas;
    });
  };

  const handleTransportadoraChange = (index, campo, valor) => {
    setTransportadoras((prevTransportadoras) => {
      const nuevasTransportadoras = [...prevTransportadoras];
      if (copyDataToRowsTwo && index === 0) {
        // Copiar los datos de la primera fila a todas las filas
        nuevasTransportadoras.forEach((transportadora, i) => {
          transportadora[campo] = valor;
        });
      } else {
        if (!nuevasTransportadoras[index]) {
          nuevasTransportadoras[index] = {};
        }
        nuevasTransportadoras[index][campo] = valor;
      }
      return nuevasTransportadoras;
    });
  };

  return (
    <Container fluid>
      <h4 className="fancy-heading">
        <span>Reporte de solicitudes</span>
        <span className="fancy-subheading">a la bodega carrera 43</span>
      </h4>
      <div className="form-container">
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
                keyfilter="int"
                name="nit_cliente"
                onChange={handleChange}
                value={nit_cliente || ""}
              />
              <Form.Control.Feedback></Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              as={Col}
              md="4"
              controlId="nombre_empresa"
              className="form-control-gestion"
            >
              <Form.Label>Nombre de la empresa</Form.Label>
              <Form.Control
                required
                keyfilter="alpha"
                name="nombreEmpresa"
                onChange={handleChange}
                value={nombreEmpresa || ""}
              />
              <Form.Control.Feedback></Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              as={Col}
              md="4"
              controlId="fecha_pactada"
              className="mb-3 form-control-gestion"
            >
              <Form.Label>Fecha y hora pactada con el cliente</Form.Label>
              <Form.Control
                required
                type="datetime-local"
                name="fecha_pactada"
                value={fecha_pactada || ""}
                onChange={(e) => setfecha_pactada(e.target.value)}
              />
              <Form.Control.Feedback></Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-4">
            <Col md="3">
              <Form.Group
                controlId="solicitudMercancia"
                className="form-control-gestion "
              >
                <Form.Label>Numeros de solicitudes de mercancias</Form.Label>
                <Chips
                  value={solicitudMercancia || ""}
                  keyfilter="int"
                  onChange={onChangeSolicitudes}
                  name="solicitudMercancia"
                  className="w-100"
                />
                <Form.Control.Feedback></Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md="3">
              <Form.Group
                controlId="solicitudCorte"
                className="form-control-gestion"
              >
                <Form.Label>Numeros de solicitudes para cortes</Form.Label>
                <Chips
                  keyfilter="int"
                  value={solicitudCorte || ""}
                  onChange={onChangeSolicitudes}
                  name="solicitudCorte"
                  className="w-100"
                />
                <Form.Control.Feedback></Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Form.Group
              as={Col}
              md="3"
              controlId="selectedSolicitudes"
              className="form-control-gestion"
            >
              <Form.Label>Solicitudes a Recoger por trasportadora</Form.Label>{" "}
              <br />
              <MultiSelect
                value={selectedSolicitudesTr || ""}
                options={filterOptions(selectedSolicitudes)}
                onChange={(e) => setSelectedSolicitudesTr(e.value)}
                placeholder="Seleccione..."
                display="chip"
              />
              <Form.Control.Feedback></Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="3"
              controlId="selectedSolicitudes"
              className="form-control-gestion "
            >
              <Form.Label>
                Solicitudes a Recoger por personal autorizado
              </Form.Label>{" "}
              <br />
              <MultiSelect
                value={selectedSolicitudes || ""}
                options={filterOptions(selectedSolicitudesTr)}
                onChange={(e) => setSelectedSolicitudes(e.value)}
                placeholder="Seleccione..."
                display="chip"
              />
              <Form.Control.Feedback></Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
      </div>
      <div className="card">
        {/* Tabla para transportadora */}
        {selectedSolicitudesTr.length > 0 && (
          <div className="table-container">
            <h5>Solicitudes por transportadora</h5>
            <DataTable
              value={transportadoras}
              stripedRows
              responsiveLayout="scroll"
            >
              <Column
                field="copyData"
                header="Copiar datos"
                body={(data, props) => (
                  <Checkbox
                    checked={copyDataToRowsTwo}
                    onChange={(e) => setCopyDataToRowsTwo(e.checked)}
                  />
                )}
              />
              <Column field="nit_cliente" header="Nit cliente" />
              <Column field="solicitud" header="Solicitud" />
              <Column
                field="nombreTransportador"
                header="Nombre de la transportadora"
                body={(data, props) => (
                  <InputText
                    value={data.nombreTransportador || ""}
                    onChange={(e) =>
                      handleTransportadoraChange(
                        props.rowIndex,
                        "nombreTransportador",
                        e.target.value
                      )
                    }
                  />
                )}
              />
              <Column
                field="observacion"
                header="Observacion del material a recoger"
                body={(data, props) => (
                  <InputText
                    value={data.observacion || ""}
                    onChange={(e) =>
                      handleTransportadoraChange(
                        props.rowIndex,
                        "observacion",
                        e.target.value
                      )
                    }
                  />
                )}
              />
            </DataTable>
          </div>
        )}

        {/* Tabla para persona autorizada */}
        {selectedSolicitudes.length > 0 && (
          <div className="table-container">
            <h5>Solicitudes por personal autorizado</h5>
            <DataTable value={personasAutorizadas || ""}>
              <Column
                field="copyData"
                header="Copiar datos"
                body={(data, props) => (
                  <Checkbox
                    checked={copyDataToRows}
                    onChange={(e) => setCopyDataToRows(e.checked)}
                  />
                )}
              />
              <Column field="nit_cliente" header="Nit cliente" />
              <Column field="solicitud" header="Solicitud" />
              <Column
                field="nombre"
                header="Nombre"
                body={(data, props) => (
                  <InputText
                    value={data.nombre || ""}
                    onChange={(e) =>
                      handlePersonaAutorizadaChange(
                        props.rowIndex,
                        "nombre",
                        e.target.value
                      )
                    }
                  />
                )}
              />
              <Column
                field="tipoDocumento"
                header="Tipo de documento"
                body={(data, props) => (
                  <Dropdown
                    value={data.tipoDocumento || ""}
                    options={infoAdicional.tipoDoc.map((tipoDocumento) => ({
                      label: tipoDocumento.nombre_tipo_documento,
                      value: tipoDocumento.abreviacion,
                    }))}
                    onChange={(e) =>
                      handlePersonaAutorizadaChange(
                        props.rowIndex,
                        "tipoDocumento",
                        e.value
                      )
                    }
                    placeholder="Seleccione tipo de documento"
                  />
                )}
              />
              <Column
                field="numeroDocumento"
                header="Número de documento"
                body={(data, props) => (
                  <InputText
                    value={data.numeroDocumento || ""}
                    onChange={(e) =>
                      handlePersonaAutorizadaChange(
                        props.rowIndex,
                        "numeroDocumento",
                        e.target.value
                      )
                    }
                    keyfilter="int"
                  />
                )}
              />
              <Column
                field="observacion"
                header="Observacion del material a recoger"
                body={(data, props) => (
                  <InputText
                    value={data.observacion || ""}
                    onChange={(e) =>
                      handlePersonaAutorizadaChange(
                        props.rowIndex,
                        "observacion",
                        e.target.value
                      )
                    }
                  />
                )}
              />
            </DataTable>
          </div>
        )}
      </div>
      <Button
        type="submit"
        onClick={handleSubmit}
        className="p-button p-component p-button-outlined button-gestion"
      >
        Enviar Solicitud
      </Button>
    </Container>
  );
};

export default ReporteSolicitudes;
