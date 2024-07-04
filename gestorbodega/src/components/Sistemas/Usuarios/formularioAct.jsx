import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import useControl from "../../../hooks/useControl";
import clienteAxios from "../../../config/url";
import Swal from "sweetalert2";

const FormularioAcct = ({ datosOriginales, handleClose }) => {
  const { token, dataadicional, usuario } = useControl();
  const [validated, setValidated] = useState(false);
  const [datosnuevos, setdata] = useState(datosOriginales);
  const [verContraseñados, setVerContraseñados] = useState(false);
  const [verContraseña, setVerContraseña] = useState(false);
  const [tiene_almacen, setTiene_almacen] = useState(
    datosOriginales.almacen_de_origen != null ? true : false
  );
  const [repetirContraseña, setrepetirContraseña] = useState(
    datosnuevos.password
  );
  const [contraseña, setContraseña] = useState(datosnuevos.password);
  const [error, setError] = useState("");
  const [infoAdicional, setinfoadicional] = useState({
    cargos: [],
    areas: [],
    tipoDoc: [],
    almacenes: [],
  });
  const updateUser = async (event) => {
    try {
      const form = event.currentTarget;
      const datosctualizados = {};
      for (const key in datosnuevos) {
        if (
          datosnuevos.hasOwnProperty(key) &&
          datosnuevos[key] !== datosOriginales[key]
        ) {
          datosctualizados[key] = datosnuevos[key];
        }
      }
      if (contraseña !== repetirContraseña) {
        setError("Las contraseñas no coinciden");
        return false;
      }
      if (contraseña != datosOriginales.password) {
        datosctualizados.password = contraseña;
        datosctualizados.nuevo_usuario = true;
      }
      if (Object.keys(datosctualizados).length == 0) {
        return alert("Ningun dato actualizado");
      }
      event.preventDefault();
      setValidated(true);
      if (
        datosctualizados.nombre_cargo != "" ||
        datosctualizados.nombre_area != ""
      ) {
        const cargos = infoAdicional.cargos;
        for (let key in cargos) {
          var valor = document.getElementById("id_cargo").value;
          if (cargos[key].id_cargo == valor) {
            var newCargo = cargos[key].nombre_del_cargo;
            datosctualizados.nombre_cargo = newCargo;
          }
        }
        const areas = infoAdicional.areas;
        for (let key in areas) {
          var valorArea = document.getElementById("id_area").value;
          if (areas[key].id_area == valorArea) {
            var newArea = areas[key].nombre_del_area;
            datosctualizados.nombre_area = newArea;
          }
        }
      }
      const result = await Swal.fire({
        title: `¿Esta seguro de actualizar los datos de ${datosOriginales.first_name} ${datosOriginales.last_name}`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
      });
      if (result.isConfirmed) {
        datosctualizados.usuario_quien_actualiza = usuario;

        const url = "ne/sistemas/" + datosnuevos.numero_de_documento + "/";
        const response = await clienteAxios.put(
          url,
          JSON.stringify(datosctualizados),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status == 200) {
          await Swal.fire({
            title: "Usuario actualizado!",
            text: `El usuario se ha actualizado correctamente`,
            icon: "success",
          });
          handleClose();
          setdata({});
        } else {
        }
      } else {
        handleClose();
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  useEffect(() => {
    setinfoadicional(dataadicional);
  }, []);

  const mostrarContraseña = () => {
    setVerContraseña(!verContraseña);
  };
  const mostrarContraseñados = () => {
    setVerContraseñados(!verContraseñados);
  };

  const contraseñaInputType = verContraseña ? "text" : "password";
  const repetirContraseñaInputType = verContraseñados ? "text" : "password";
  return (
    <Modal
      className="border border-warning"
      show={true}
      onHide={handleClose}
      size="lg"
    >
      <Modal.Header className="table-u text-dark" closeButton>
        <Modal.Title>Actualizar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated}>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustom01">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                required
                value={datosnuevos.first_name}
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
                    .join(" ");
                  setdata((prevState) => ({
                    ...prevState,
                    first_name: formattedValue.replace(
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
            <Form.Group as={Col} md="4" controlId="validationCustom02">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                required
                value={datosnuevos.last_name}
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
                    .join(" ");

                  setdata((prevState) => ({
                    ...prevState,
                    last_name: formattedValue.replace(
                      /[^a-zA-ZáéíóúÁÉÍÓÚüÜ\s]/g,
                      ""
                    ),
                  }));
                }}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, completa este campo
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom03">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={datosnuevos.email}
                required
                onChange={(e) =>
                  setdata((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
              />
              <Form.Control.Feedback type="invalid">
                Por favor, completa este campo
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
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
            <Form.Group as={Col} md="4" controlId="validationCustom05">
              <Form.Label>Numero de Documento</Form.Label>
              <Form.Control
                type="number"
                required
                value={datosnuevos.numero_de_documento}
                disabled={true}
                onChange={(e) =>
                  setdata((prevState) => ({
                    ...prevState,
                    numero_de_documento: e.target.value.replace(/[^0-9]/g, ""),
                  }))
                }
              />
              <Form.Control.Feedback type="invalid">
                Por favor, completa este campo
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom06">
              <Form.Label>Area </Form.Label>
              <Form.Select
                type="text"
                required
                value={datosnuevos.id_area}
                onChange={(e) =>
                  setdata((prevState) => ({
                    ...prevState,
                    id_area: e.target.value,
                  }))
                }
                id="id_area"
              >
                <option value="">Seleccione...</option>
                {infoAdicional.areas.map((id_area) => (
                  <option key={id_area.id_area} value={id_area.id_area}>
                    {id_area.nombre_del_area}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Por favor, completa este campo
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            {tiene_almacen && (
              <Form.Group as={Col} md="4" controlId="selectAlmacen">
                <Form.Label>Almacen</Form.Label>
                <Form.Select
                  type="text"
                  required
                  value={datosnuevos.almacen_de_origen}
                  onChange={(e) =>
                    setdata((prevState) => ({
                      ...prevState,
                      almacen_de_origen: e.target.value,
                    }))
                  }
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
            <Form.Group as={Col} md="4" controlId="validationCustom07">
              <Form.Label>Cargo</Form.Label>
              <Form.Select
                type="text"
                required
                value={datosnuevos.id_cargo}
                onChange={(e) =>
                  setdata((prevState) => ({
                    ...prevState,
                    id_cargo: e.target.value,
                  }))
                }
                id="id_cargo"
              >
                <option value="">Seleccione...</option>
                {infoAdicional.cargos.map((id_cargo) => (
                  <option key={id_cargo.id_cargo} value={id_cargo.id_cargo}>
                    {id_cargo.nombre_del_cargo}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Por favor, completa este campo
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom08">
              <Form.Label>Usuario activo</Form.Label>
              <Form.Check
                className=""
                type="switch"
                id="usuario-activo"
                checked={datosnuevos.is_active}
                required
                onChange={(e) =>
                  setdata((prevState) => ({
                    ...prevState,
                    is_active: e.target.checked,
                  }))
                }
              />
              <Form.Control.Feedback type="invalid">
                Por favor, completa este campo
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom09">
              <Form.Label>Super usuario</Form.Label>
              <Form.Check
                bg="warning"
                type="switch"
                id="super-usuario"
                checked={datosnuevos.is_superuser}
                required
                onChange={(e) =>
                  setdata((prevState) => ({
                    ...prevState,
                    is_superuser: e.target.checked,
                  }))
                }
              />
              <Form.Control.Feedback type="invalid">
                Por favor, completa este campo
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-1">
            <Form.Group as={Col} md="4" controlId="validationCustom10">
              <Form.Label>Contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={contraseñaInputType}
                  required
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                />
                <Button variant="outline-secondary" onClick={mostrarContraseña}>
                  {verContraseña ? "Ocultar" : "Mostrar"}
                </Button>
              </InputGroup>
              {error && <div className="text-danger">{error}</div>}
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom10">
              <Form.Label>Repetir Contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={repetirContraseñaInputType}
                  required
                  value={repetirContraseña}
                  // value={repetirContraseña}
                  onChange={(e) => setrepetirContraseña(e.target.value)}
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
            <Button variant="danger" size="sm" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={updateUser} size="sm">
              Guardar
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default FormularioAcct;
