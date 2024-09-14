import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Button as PrimeButton } from "primereact/button";
import useControl_Pedidos from "../../../hooks/useControl_Pedidos";

export const Crear_pedido = ({
  Entregadores,
  agregar,
  docentregador,
  numruta,
  baser,
}) => {
  const { CrearPedido, ultimaRuta, setultimaRuta, obtener_ruta, ultimaBase } =
    useControl_Pedidos();
  const [validated, setValidated] = useState(false);
  const [seleccionado, setSeleccionado] = useState(false);
  const [EntregadorSelec, setEntregadorSelec] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [documento, setDocumento] = useState("");
  const [tipoVehiculo, setTipoVehiculo] = useState("");
  const [numeroRuta, setNumeroRuta] = useState("");
  const [base, setBase] = useState(0);
  const [formattedBase, setFormattedBase] = useState(0);
  const [acompanantes, setAcompanantes] = useState([]);
  const [acompañante, setAcompañante] = useState("");
  const [pedidos, setPedidos] = useState([
    { valorPedido: "", numeroFactura: "", tipoPedido: "Tienda" },
    // Puedes agregar más pedidos según sea necesario
  ]);
  useEffect(() => {
    if (!numruta) {
      console.log(ultimaRuta)
      const ruta = parseInt(ultimaRuta, 0) + 1;
      setNumeroRuta(ruta);
      setBase(ultimaBase, 0);
      setFormattedBase(ultimaBase, 0);
    }
    // Llama a la función asincrónica para obtener los datos
  }, [ultimaRuta, ultimaBase]);

  const [inputValues, setInputValues] = useState(
    pedidos.map((p) => p.valorPedido)
  );
  const [acompanado, setAcompanado] = useState(false);
  const [errores, setErrores] = useState({});
  const [errores2, setErrores2] = useState({});
  const [error, setError] = useState(false);
  const [errorRuta, setErrorRuta] = useState(false);

  useEffect(() => {
    if (agregar) {
      setEntregadorSelec(docentregador);
      setNumeroRuta(numruta);
      setBase(baser, 0);
      setFormattedBase(baser, 0);
    }
  }, [agregar, docentregador]);
  useEffect(() => {
    if (EntregadorSelec !== "") {
      setSeleccionado(true);
      const entregador = Entregadores.find(
        (ent) => ent.documento === EntregadorSelec
      );
      setDocumento(entregador?.documento);
      setNombre(entregador?.nombres);
      setApellidos(entregador?.apellidos);
      setTipoVehiculo(entregador?.vehiculo);
      obtener_ruta(entregador.documento);
      // Filtrar el entregador seleccionado y actualizar los acompañantes
      const nuevosAcompanantes = Entregadores.filter(
        (ent) => ent.documento !== EntregadorSelec
      );
      setAcompanantes(nuevosAcompanantes);
    } else {
      setSeleccionado(false);
    }
  }, [EntregadorSelec]);
  useEffect(() => {
    if (!acompanado) {
      setAcompañante("");
    }
  }, [acompanado]);

  useEffect(() => {
    const funcionRuta = () => {
      const ultimoPedido = pedidos[pedidos.length - 1];
      if (!setNumeroRuta) {
        setErrorRuta(true);
      } else {
        setErrorRuta(false);
      }
    };
    funcionRuta();
  }, [numeroRuta, pedidos]);

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
    const erroresTemp2 = {};
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
    pedidos.forEach((pedido, index) => {
      if (!pedido.valorPedido.trim()) {
        console.log("errores" + index);
        erroresTemp2[index] = "El valor del pedido es requerido";
      }
    });
    setErrores2(erroresTemp2); //asignamos los mensajes al error temporal

    if (
      form.checkValidity() === false ||
      Object.keys(erroresTemp).length > 0 ||
      Object.keys(erroresTemp2).length > 0
    ) {
      // Si hay errores, no se envía el formulario.
      showError(
        `No se ha podido crear la ruta debido a errores en los campos o campos incompletos.`
      );

      event.stopPropagation();
      setValidated(true);
      return;
    }
    // Aplicar numeroRuta a todos los pedidos
    const pedidosConNumeroRuta = pedidos.map((pedido) => ({
      ...pedido,
      numeroRuta,
      base,
    }));

    try {
      CrearPedido(
        { nombre, documento, tipoVehiculo, acompañante, acompanado },
        pedidosConNumeroRuta,
        agregar
      );
    } catch (error) {
      showError("Ah ocurrido un error al crear la carpeta: \n" + error);
      // Manejar errores de solicitud
      console.error("Error al guardar datos y archivos:", error);
      // Manejar el error en el componente principal si es necesario
    }
  };

  // Manejo de cambios en los pedidos
  const handlePedidoChange = (index, field, value) => {
    const newPedidos = [...pedidos];
    newPedidos[index][field] = value;
    setPedidos(newPedidos);
  };
  //formatear valor del pedido
  const handleValorPedidoChange = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const validValue = numericValue.match(/^\d*\.?\d{0,2}$/);

    if (validValue) {
      const newInputValues = [...inputValues];
      newInputValues[index] = numericValue;
      setInputValues(newInputValues);

      handlePedidoChange(index, "valorPedido", numericValue);
    }
  };
  const handleBlur = (index) => {
    const numericValue = parseFloat(inputValues[index]);
    if (!isNaN(numericValue)) {
      const formattedValue = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericValue);

      const newInputValues = [...inputValues];
      newInputValues[index] = formattedValue;
      setInputValues(newInputValues);
    }
  };

  const handleFocus = (index) => {
    // Mostrar el valor sin formatear al entrar al campo de texto
    const newInputValues = [...inputValues];
    newInputValues[index] = pedidos[index].valorPedido;
    setInputValues(newInputValues);
  };

  // Agregar un nuevo pedido
  const agregarPedido = () => {
    setPedidos([
      ...pedidos,
      {
        numeroRuta: numeroRuta,
        base: (base, 0),
        valorPedido: "",
        numeroFactura: "",
        tipoPedido: "Tienda",
      },
    ]);
  };

  const eliminarPedido = () => {
    if (pedidos.length > 1) {
      setPedidos(pedidos.slice(0, -1));
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe haber al menos un pedido en la lista.",
      });
    }
  };

  const formatCurrency = (value) => {
    const numericValue = value?.toString().replace(/\D/g, ""); // Asegura que value es una cadena
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(numericValue);
  };

  const handleBlur2 = () => {
    // Formatea y muestra el valor
    setFormattedBase(formatCurrency(base));
  };

  const handleFocus2 = () => {
    // Remueve el formato de moneda y muestra solo los números
    const numericValue = base?.toString().replace(/[^\d]/g, "");
    console.log(numericValue);
    setBase(numericValue);
    setFormattedBase(numericValue); // Muestra el valor numérico sin formatear cuando el campo está enfocado
  };

  const handleChange2 = (e) => {
    const value = e.target.value;
    // Guarda el valor sin formatear en el estado 'base'
    setBase(value);
    // Actualiza el estado 'formattedBase' para mostrar el texto actual mientras el usuario escribe
    setFormattedBase(value);
  };
  return (
    <div className="d-flex justify-content-center align-items-center mt-1 ">
      {Entregadores.length > 0 ? (
        <>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* Entregador  */}
            <Row>
              <Col xs={12} md={12} className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="Entregador "
                  className="form-control-gestion"
                >
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Seleccione entregador"
                    className="mb-1"
                  >
                    <Form.Select
                      disabled={agregar}
                      className="form-control-gestion"
                      aria-label="Default select example"
                      value={EntregadorSelec}
                      onChange={(e) => {
                        setEntregadorSelec(e.target.value);
                      }}
                    >
                      <option value="">Seleccione...</option>
                      {Entregadores &&
                        Entregadores.map((entregadores) => (
                          <option
                            key={entregadores.documento}
                            value={entregadores.documento}
                          >
                            {entregadores.nombres} {entregadores.apellidos}
                          </option>
                        ))}
                    </Form.Select>
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>
            {seleccionado ? (
              <>
                {/* Datos */}
                <Row className="">
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
                          disabled={true}
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
                          disabled={true}
                          className="form-control-gestion"
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
                <Row className="">
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
                          className="form-control-gestion"

                          disabled={true}
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
                {/* Numero de ruta y acompañante  */}
                <Row className="">
                  {/* numero ruta */}
                  <Col xs={12} md={4}>
                    <Form.Group
                      as={Col}
                      controlId="numeroRuta"
                      className="form-control-gestion"
                    >
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Numero de ruta"
                        className="mb-1"
                      >
                        <Form.Control
                          className="form-control-gestion"
                          disabled={agregar}
                          type="text"
                          placeholder="Numero de ruta"
                          value={numeroRuta}
                          onChange={(e) => setNumeroRuta(e.target.value)}
                        />
                      </FloatingLabel>
                    </Form.Group>
                    {errorRuta && (
                      <p
                        className="mt-2"
                        style={{ color: "#dc3545", fontSize: "14px" }}
                      >
                        Debe digitar el numero de ruta
                      </p>
                    )}
                  </Col>
                  {/* base */}
                  <Col xs={12} md={4}>
                    <Form.Group
                      as={Col}
                      controlId="Base"
                      className="form-control-gestion"
                    >
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Base"
                        className="mb-1"
                      >
                        <Form.Control
                          disabled={agregar}
                          type="text"
                          placeholder="Base"
                          value={formattedBase}
                          onChange={handleChange2}
                          onBlur={handleBlur2}
                          onFocus={handleFocus2}
                        />
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                  {/* Checkbox para indicar si va acompañado */}
                  <Col xs={12} md={4}>
                    <Form.Group
                      controlId="acompanado"
                      className=" mt-3"
                    >
                      <Form.Check
                        type="checkbox"
                        label="¿Va acompañado?"
                        checked={acompanado}
                        onChange={(e) => setAcompanado(e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                  {/* lista posibles acompañantes*/}
                  {acompanado && (
                    <Col xs={12} md={12} className="mb-3">
                      <Form.Group
                        as={Col}
                        controlId="Entregador "
                        className="form-control-gestion"
                      >
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Seleccione acompañante"
                          className="mb-1"
                        >
                          <Form.Select
                            className="form-control-gestion"
                            aria-label="Default select example"
                            value={acompañante}
                            onChange={(e) => {
                              setAcompañante(e.target.value);
                            }}
                          >
                            <option value="">Seleccione...</option>
                            {acompanantes &&
                              acompanantes.map((acompanantes) => (
                                <option
                                  key={acompanantes.documento}
                                  value={acompanantes.documento}
                                >
                                  {acompanantes.nombres}{" "}
                                  {acompanantes.apellidos}
                                </option>
                              ))}
                          </Form.Select>
                        </FloatingLabel>
                      </Form.Group>
                    </Col>
                  )}
                </Row>
                {/* Pedidos */}
                {pedidos.map((pedido, index) => (
                  <>
                    <Row>
                      <Col xs={12} md={12}>
                        <p>{index + 1}) Pedido</p>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      {/* Valor pedido */}
                      <Col xs={12} md={4}>
                        <Form.Group
                          controlId={index}
                          className="form-control-gestion"
                        >
                          <FloatingLabel
                            controlId={index}
                            label="Valor del pedido"
                          >
                            <Form.Control
                              required
                              type="text"
                              placeholder="Valor del pedido"
                              value={inputValues[index]}
                              onChange={(e) =>
                                handleValorPedidoChange(index, e.target.value)
                              }
                              onBlur={() => handleBlur(index)}
                              onFocus={() => handleFocus(index)}
                              isInvalid={!!errores2[index]}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errores2[index]}
                            </Form.Control.Feedback>
                          </FloatingLabel>
                        </Form.Group>
                      </Col>
                      {/* Numero de factura */}
                      <Col xs={12} md={4}>
                        <Form.Group
                          controlId={`numeroFactura-${index}`}
                          className="form-control-gestion"
                        >
                          <FloatingLabel
                            controlId={`floatingNumeroFactura-${index}`}
                            label="Numero de factura"
                          >
                            <Form.Control
                              type="number"
                              placeholder="Numero de factura"
                              value={pedido.numeroFactura}
                              onChange={(e) =>
                                handlePedidoChange(
                                  index,
                                  "numeroFactura",
                                  e.target.value
                                )
                              }
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>
                      {/* Tipo de pedido */}
                      <Col xs={12} md={4}>
                        <Form.Group
                          controlId={`tipoPedido-${index}`}
                          className="form-control-gestion"
                        >
                          <FloatingLabel
                            controlId={`floatingTipoPedido-${index}`}
                            label="Tipo de pedido"
                          >
                            <Form.Select
                              className="form-control-gestion"
                              required
                              aria-label="tipo pedido"
                              value={pedido.tipoPedido}
                              onChange={(e) =>
                                handlePedidoChange(
                                  index,
                                  "tipoPedido",
                                  e.target.value
                                )
                              }
                            >
                              <option value="Tienda">Tienda</option>
                              <option value="Mayorista">Mayorista</option>
                            </Form.Select>
                          </FloatingLabel>
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                ))}

                {/* Botón para agregar más pedidos */}
                <PrimeButton
                  type="button"
                  label=" Agregar Pedido"
                  disabled={errorRuta}
                  icon="pi pi-plus"
                  style={{ height: "2rem", width: "12rem" }}
                  className="mb-3 p-button p-component  button-verde"
                  onClick={agregarPedido}
                />
                {pedidos.length > 1 && (
                  <PrimeButton
                    type="button"
                    style={{ height: "2rem", width: "12rem" }}
                    icon="pi pi-minus"
                    className="mb-3 p-button p-component p-button-outlined button-gestion"
                    onClick={eliminarPedido}
                    label="Quitar pedido"
                  />
                )}

                <div className="text-center mb-3">
                  <Button
                    type="submit"
                    className="p-button p-component p-button-outlined button-gestion"
                  >
                    Enviar
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )}
          </Form>
        </>
      ) : (
        <>
          <div> No hay entregadores, vuelva a intentar.</div>
        </>
      )}
    </div>
  );
};
