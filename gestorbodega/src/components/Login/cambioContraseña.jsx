import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";

const CambiarContraseña = ({ jsonlogin }) => {
  const { token, logout } = useControl();
  const [error, setError] = useState("");
  const [verContraseñados, setVerContraseñados] = useState(false);
  const [verContraseña, setVerContraseña] = useState(false);
  const [validated, setValidated] = useState(false);
  const [repetirContraseña, setrepetirContraseña] = useState("");
  const [contraseña, setContraseña] = useState("");

  const [cambiarcontraseña, setcambiarcontraseña] = useState({
    password: "",
    nuevo_usuario: false,
  });
  const salir = () => {
    logout(jsonlogin.id);
  };

  const updateUser = async (event) => {
    try {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        return Swal.fire("Por favor inserte una contraseña segura");
      }

      if (contraseña.length < 8) {
        return setError("La contraseña debe tener al menos 8 caracteres.");
      } else if (!/[A-Z]/.test(contraseña)) {
        return setError(
          "La contraseña debe contener al menos una letra mayúscula."
        );
      } else if (!/\d/.test(contraseña)) {
        return setError("La contraseña debe contener al menos un número.");
      } else if (contraseña !== repetirContraseña) {
        return setError("Las contraseñas no coinciden.");
      } else {
        cambiarcontraseña.password = contraseña;
        const result = await Swal.fire({
          title: `¿Esta seguro de actualizar la contraseña?`,
          text: "¡No podrás revertir esto!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si",
        });
        if (result.isConfirmed) {
          const url = "ne/sistemas/" + jsonlogin.numero_de_documento + "/";
          const response = await clienteAxios.put(url, cambiarcontraseña, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            await Swal.fire({
              title: "Usuario actualizado!",
              text: `El usuario se ha actualizado correctamente`,
              icon: "success",
            });
            setContraseña("");
            setrepetirContraseña("");
            setError("");
            setValidated(true);
            setcambiarcontraseña({});
            logout(jsonlogin.id);
          } else {
            logout(jsonlogin.id);
          }
        } else {
        }
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  const mostrarContraseña = () => {
    setVerContraseña(!verContraseña);
  };

  const mostrarContraseñados = () => {
    setVerContraseñados(!verContraseñados);
  };

  const contraseñaInputType = verContraseña ? "text" : "password";
  const repetirContraseñaInputType = verContraseñados ? "text" : "password";

  return (
    <>
      <Modal className="border border-warning" show={true} size="lg">
        <Modal.Header className="table-u text-dark" closeButton>
          <Modal.Title>Actualiza tu contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Row className="mb-2">
              <Form.Group as={Col} md="6" controlId="validationCustom10">
                <Form.Label>Contraseña</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={contraseñaInputType}
                    required
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={mostrarContraseña}
                  >
                    {verContraseña ? "Ocultar" : "Mostrar"}
                  </Button>
                </InputGroup>
                {error && <div className="text-danger">{error}</div>}
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom10">
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
              <Button variant="danger" onClick={salir} size="sm">
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
    </>
  );
};

export default CambiarContraseña;
