import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import useControl from "../../../hooks/useControl";
import { formatISO } from "date-fns";
import clienteAxio from "../../../config/url";
import Swal from "sweetalert2";

const FormularioCre = ({ handleClosecrear }) => {
  const { token, dataadicional, usuario } = useControl();
  const [validatedCre, setValidatedCre] = useState(false);
  const currentDateTime = formatISO(new Date(), { representation: "complete" });
  const [verContraseña, setVerContraseña] = useState(false);
  const [verContraseñados, setVerContraseñados] = useState(false);
  const [contraseña, setContraseña] = useState("");
  const [repetirContraseña, setrepetirContraseña] = useState("");
  const [error, setError] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [almacen, setAlmacen] = useState(null);
  const [infoAdicional, setinfoadicional] = useState({
    cargos: [],
    areas: [],
    tipoDoc: [],
    almacen:[]
  });
  const [crearUsuario, setCrearUsuario] = useState({
    password: "",
    tipo_de_documento: "",
    numero_de_documento: "",
    id_area: "",
    id_cargo: "",
    last_login: currentDateTime,
    is_superuser: "",
    first_name: "",
    last_name: "",
    email: "",
    is_active: "",
    date_joined: currentDateTime,
    is_staff: true,
    username: "",
    nombre_cargo: "",
    nombre_area: "",
    usuario_quien_crea: usuario,
    usuario_quien_actualiza: usuario,
    nuevo_usuario: true,
    almacen_de_origen: ""
  });

  useEffect(() => {
    setinfoadicional(dataadicional);
  }, []);

  const handleContraseñaChange = (e) => {
    setContraseña(e.target.value);
  };

  const mostrarContraseña = () => {
    setVerContraseña(!verContraseña);
  };

  const mostrarContraseñados = () => {
    setVerContraseñados(!verContraseñados);
  };

  const handleRepetirContraseñaChange = (e) => {
    setrepetirContraseña(e.target.value);
  };

  const handleChange = (e) => {
    let updatedUser = {
      ...crearUsuario,
      [e.target.name]: e.target.value,
    };
    if (e.target.name === "id_area") {
      const valor = e.target.value;
      if (valor === "45") {
        setAlmacen(true);
      }else {
        setAlmacen(false);
      }
    }
    if (e.target.type === "number") {
      const newValue = e.target.value.replace(/[^0-9]/g, ""); // Solo k
      updatedUser[e.target.name] = newValue;
    } else if (e.target.type === "text") {
      const newValue = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜ\s]/g, ""); // Solo letras y espacios
      const value = newValue.toLowerCase();
      const formattedText = value.replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
      updatedUser[e.target.name] = formattedText;
    }
    // Actualizar 'username' si 'first_name' o 'last_name' cambian
    if (e.target.name === "first_name" || e.target.name === "last_name") {
      updatedUser.username = `${updatedUser.first_name.split(" ")[0]}.${
        updatedUser.last_name.split(" ")[0]
      }`;
    }
    setCrearUsuario(updatedUser);
  };
  const handleCrear = async (e) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;
      if (contraseña !== repetirContraseña) {
        setError("Las contraseñas no coinciden");

        return false;
      }
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
        setErrorCorreo("Correo no valido");
        return false;
      }
      crearUsuario.password = contraseña;
      if (crearUsuario.nombre_cargo == "" || crearUsuario.nombre_area == "") {
        const cargos = infoAdicional.cargos;
        for (let key in cargos) {
          var valor = document.getElementById("id_cargo").value;
          if (cargos[key].id_cargo == valor) {
            var newCargo = cargos[key].nombre_del_cargo;
            crearUsuario.nombre_cargo = newCargo;
          }
        }
        const areas = infoAdicional.areas;
        for (let key in areas) {
          var valorArea = document.getElementById("id_area").value;
          if (areas[key].id_area == valorArea) {
            var newArea = areas[key].nombre_del_area;
            crearUsuario.nombre_area = newArea;
          }
        }
      }
      const result = await Swal.fire({
        title: `¿Esta seguro de crear a ${crearUsuario.first_name} ${crearUsuario.last_name}`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
      });

      if (result.isConfirmed) {
        setError("");
        setValidatedCre(true);
        const response = await clienteAxio.post(
          "ne/sistemas/",
          JSON.stringify(crearUsuario),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 201) {
          handleClosecrear();
          setCrearUsuario({});
          // Cerrar el modal después de enviar los datos con éxito
        } else {
          console.error(
            "Error al crear el usuario:",
            response.status,
            response.statusText
          );
          // Puedes manejar los errores aquí
        }
      } else {
        handleClosecrear();
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      // Puedes manejar los errores aquí
    }
  };

  const contraseñaInputType = verContraseña ? "text" : "password";
  const repetirContraseñaInputType = verContraseñados ? "text" : "password";
  return (
    <>
      <Modal
        className="border border-warning"
        show={true}
        onHide={handleClosecrear}
        size="lg"
      >
        <Modal.Header
          className="border border-warning bg-dark text-white"
          closeButton
        >
          <Modal.Title>Crear Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCrear} validated={validatedCre} noValidate>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validation">
                <Form.Label className="text-align " data-bs-theme="light">
                  Nombres
                </Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={crearUsuario.first_name}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, completa este campo
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validation1">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={crearUsuario.last_name}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, completa este campo
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validation2">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={crearUsuario.email}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, completa este campo
                </Form.Control.Feedback>
                {errorCorreo && (
                  <div className="text-danger">{errorCorreo}</div>
                )}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validation3">
                <Form.Label>Tipo de documento</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="tipo_de_documento"
                  value={crearUsuario.tipo_de_documento}
                  onChange={handleChange}
                  required
                >
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

              <Form.Group as={Col} md="4" controlId="validation4">
                <Form.Label>Numero de documento</Form.Label>
                <Form.Control
                  type="number"
                  name="numero_de_documento"
                  value={crearUsuario.numero_de_documento}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, completa este campo
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validation8">
                <Form.Label>Area</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="id_area"
                  onChange={handleChange}
                  required
                  id="id_area"
                >
                  <option value="">Seleccione...</option>
                  {infoAdicional.areas.map((area) => (
                    <option key={area.id_area} value={area.id_area}>
                      {area.nombre_del_area}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Por favor, completa este campo
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              {almacen && (
                <Form.Group as={Col} md="4" controlId="selectAlmacen">
                  <Form.Label>Seleccione a un almacen</Form.Label>
                  <Form.Select
                    onChange={handleChange}
                    required
                    name="almacen_de_origen"
                    id="almacen_de_origen"
                  >
                    <option value="">Seleccione...</option>
                    {infoAdicional.almacenes.map((almacen) => (
                      <option key={almacen.id_almacen} value={almacen.almacen}>
                        {almacen.almacen}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Por favor, completa este campo
                  </Form.Control.Feedback>
                </Form.Group>
              )}
              <Form.Group as={Col} md="4" controlId="validation8">
                <Form.Label>Cargo</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="id_cargo"
                  onChange={handleChange}
                  required
                  id="id_cargo"
                >
                  <option value="">Seleccione...</option>
                  {infoAdicional.cargos.map((cargo) => (
                    <option key={cargo.id_cargo} value={cargo.id_cargo}>
                      {cargo.nombre_del_cargo}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Por favor, completa este campo
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validation8">
                <Form.Label>¿Activar Usuario?</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="is_active"
                  value={crearUsuario.is_active}
                  onChange={handleChange}
                  required
                >
                  <option>Seleccionar...</option>
                  <option value="true">Si</option>
                  <option value="false">No</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Por favor, completa este campo
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validation9">
                <Form.Label>¿Va ser Usuario Administrado?</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="is_superuser"
                  value={crearUsuario.is_superuser}
                  onChange={handleChange}
                  required
                >
                  <option>Seleccionar...</option>
                  <option value="true">Si</option>
                  <option value="false">No</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Por favor, completa este campo
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validation10">
                <Form.Label>Contraseña</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={contraseñaInputType}
                    value={contraseña}
                    onChange={handleContraseñaChange}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={mostrarContraseña}
                  >
                    {verContraseña ? "Ocultar" : "Mostrar"}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validation5">
                <Form.Label>Repetir Contraseña</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={repetirContraseñaInputType}
                    name="password"
                    value={repetirContraseña}
                    onChange={handleRepetirContraseñaChange}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={mostrarContraseñados}
                  >
                    {verContraseñados ? "Ocultar" : "Mostrar"}
                  </Button>
                </InputGroup>
                {error && <div className="text-danger">{error}</div>}
              </Form.Group>
            </Row>
            <div className="modal-footer">
              <Button variant="danger" size="sm" onClick={handleClosecrear}>
                Cancelar
              </Button>
              <Button variant="warning" size="sm" type="submit">
                Crear Usuario
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default FormularioCre;
