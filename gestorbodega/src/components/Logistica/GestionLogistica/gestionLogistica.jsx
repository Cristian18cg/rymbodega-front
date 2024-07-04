import { useState, useEffect } from "react";
import useContextlogistica from "../../../hooks/useControllogistica";
import useControl from "../../../hooks/useControl";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Swal from "sweetalert2";

const GestionLogistica = () => {
  const {
    obtenerConductores,
    obtenerVehiculos,
    obtenerAlmacenes,
    enviarCorreo,
  } = useContextlogistica();
  const { token } = useControl();
  const [validated, setValidated] = useState(false);
  const [conductores, setconductores] = useState([]);
  const [vehiculos, setvehiculos] = useState([]);
  const [almacenes, setalmacenes] = useState([]);
  const [selectedConductor, setSelectedConductor] = useState("");
  const [selectedVehiculo, setSelectedVehiculo] = useState("");
  const [selectedAlmacen, setSelectedAlmacen] = useState("");
  const [spinner, setspinner] = useState(false);

  useEffect(() => {
    const cargarConductores = async () => {
      const conductoresData = await obtenerConductores(token);
      if (conductoresData) {
        setconductores(conductoresData);
      }
    };
    const cargarVehiculos = async () => {
      const vehiculosData = await obtenerVehiculos(token);
      if (vehiculosData) {
        setvehiculos(vehiculosData);
      }
    };

    const cargarAlmacenes = async () => {
      const almacenesData = await obtenerAlmacenes(token);
      if (almacenesData) {
        setalmacenes(almacenesData);
      }
    };
    cargarAlmacenes();
    cargarConductores();
    cargarVehiculos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      return (
        event.preventDefault(), event.stopPropagation(), setValidated(true)
      );
    }
    setspinner(true);

    const result = await Swal.fire({
      title: `Confirmación de envío`,
      text: `¿Está seguro de que desea enviar un correo a ${selectedAlmacen}? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Enviar correo",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      const confirmacion = await enviarCorreo(
        token,
        selectedConductor,
        selectedVehiculo,
        selectedAlmacen
      );
      if (confirmacion) {
        setspinner(false);
      } else {
        setspinner(false);
      }
    } else {
      setspinner(false);
    }
  };

  return (
    <>
      <Form
        className="h-tp formCond rowform m-4 p-3 border"
        show={false}
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="selectConductor">
            <Form.Label>Seleccione a un conductor</Form.Label>
            <Form.Select
              value={selectedConductor}
              onChange={(e) => setSelectedConductor(e.target.value)}
              required
            >
              <option value="">Seleccione...</option>
              {conductores.map((cond) => (
                <option key={cond.id_conductor} value={cond.numero_documento}>
                  {cond.nombres}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Por favor, completa este campo
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="selectVehiculo">
            <Form.Label>Seleccione a un vehículo</Form.Label>
            <Form.Select
              value={selectedVehiculo}
              onChange={(e) => setSelectedVehiculo(e.target.value)}
              required
            >
              <option value="">Seleccione...</option>
              {vehiculos.map((veh) => (
                <option key={veh.id_vehiculo} value={veh.placa}>
                  {veh.placa}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Por favor, completa este campo
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="selectAlmacen">
            <Form.Label>Seleccione a un almacen</Form.Label>
            <Form.Select
              value={selectedAlmacen}
              onChange={(e) => setSelectedAlmacen(e.target.value)}
              required
            >
              <option value="">Seleccione...</option>
              {almacenes.map((almacen) => (
                <option key={almacen.id_almacen} value={almacen.correo}>
                  {almacen.almacen}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Por favor, completa este campo
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <div class="button-container">
          {spinner ? (
            <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
                disabled
              />
              Enviando correo...
            </Button>
          ) : (
            <Button variant="dark" size="mg" type="submit">Enviar Correo</Button>
          )}
        </div>
      </Form>
    </>
  );
};

export default GestionLogistica;
