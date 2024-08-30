import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Button as PrimeButton } from "primereact/button";
import useControl from "../../../hooks/useControl";
import useControl_Pedidos from "../../../hooks/useControl_Pedidos";

export const Crear_entregador = () => {
  const {
    setresCrearColaborador, 
    CrearEntregador,
    resCrearColaborador,
  } = useControl_Pedidos();
  const [validated, setValidated] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [documento, setDocumento] = useState("");
  const [tipoVehiculo, setTipoVehiculo] = useState("");
  const [errores, setErrores] = useState({});
  const [error, setError] = useState(false);
  useEffect(() => {
  if(resCrearColaborador === "Yes"){
    setApellidos("")
    setNombre("")
    setDocumento("")
    setTipoVehiculo("")
  }
  }, [resCrearColaborador]);
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    // Validar tipo vehiculo
    const erroresTemp = {};
    if (!tipoVehiculo.trim()) {
      erroresTemp.tipoVehiculo = "El vehiculo predeterminado es requerido";
    }
    // Validar nombre

    if (!nombre.trim()) {
      erroresTemp.nombre = "El nombre es requerido";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
      erroresTemp.nombre = "El nombre solo puede contener letras";
    }
    // Validar apellidos
    if (!apellidos.trim()) {
      erroresTemp.apellidos = "Los apellidos son requeridos";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(apellidos)) {
      erroresTemp.apellidos = "Los apellidos solo pueden contener letras";
    }
    // Validar documento
    if (!documento.trim()) {
      erroresTemp.documento = "El numero de documento es requerido";
    } else if (documento.length < 6 || documento.length > 15) {
      erroresTemp.documento =
        "El numero de documento debe tener entre 4 y 15 numeros";
    }

    setErrores(erroresTemp); //asignamos los mensajes al error temporal
    if (form.checkValidity() === false || Object.keys(erroresTemp).length > 0) {
      // Si hay errores, no se envía el formulario.
      showError(
        `No se ha podido crear el colaborador debido a errores en los campos o campos incompletos.`
      );

      event.stopPropagation();
      setValidated(true);
      return;
    }
    try {
      CrearEntregador({ nombre, apellidos, documento, tipoVehiculo });
      
    } catch (error) {
      showError("Ah ocurrido un error al crear la carpeta: \n" + error);
      // Manejar errores de solicitud
      console.error("Error al guardar datos y archivos:", error);
      // Manejar el error en el componente principal si es necesario
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center mt-1  mx-md-5 mx-lg-5 mx-1 mb-2">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Card className=" d-flex align-items-center card-gestion ">
          <Card.Header className=" mb-1  card-gestion-header">
            <h3 style={{ color: "white" }}>
              <strong>Formulario creación entregador</strong>
            </h3>
          </Card.Header>

          <Card.Body className="border-top card-gestion-body mb-2">
            {/* Nombres */}
            <Row className="mb-3 ">
              {/* Nombre */}
              <Col xs={12} md={6} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="nombres"
                  className="form-control-gestion"
                >
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Nombres colaborador"
                    className="mb-1 "
                  >
                    <Form.Control
                      className="form-control-gestion"
                      required
                      type="text"
                      placeholder="Nombres colaborador"
                      value={nombre}
                      onChange={(e) => {
                        let value = e.target.value
                          .toUpperCase()
                          .replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜÑñ\s]/g, "");
                        value = value.replace(/�/g, "Ñ"); // Permitir solo letras y letras con tildes
                        setNombre(value);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {`Error: ${errores.nombre}`}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
              {/* apellido */}

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
            {/* Documento y tipo vehiculo */}
            <Row className="mb-3 ">
              {/* documento */}
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
              {/* tipo vehiculo */}
              <Col xs={12} md={6} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="tipoVehiculo"
                  className="form-control-gestion"
                >
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Vehiculo predeterminado"
                    className="mb-1"
                  >
                    <Form.Select
                      className="form-control-gestion"
                      required
                      aria-label="Default select example"
                      value={tipoVehiculo}
                      onChange={(e) => {
                        setTipoVehiculo(e.target.value);
                      }}
                    >
                      <option value="">Seleccione...</option>
                      <option value="Carguero">Carguero</option>
                      <option value="Triciclo">Triciclo</option>
                      <option value="Camion">Camion</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {`Error: ${errores.tipoVehiculo}`}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>
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
  );
};
