import React, { useState } from "react";
import useControl from "../../hooks/useControl";
import "../../styles/styles.css";
import imagenn from "../../img/icono.png";
import imagencor from "../../img/tra.webp";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const FormularioLogin = () => {
  const { login } = useControl();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity()) {
      login(user, password);
    }
    setValidated(true);
  };

  return (
    <section className="h-100 gradient-form bg-white">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body mx-4">
                    <div className="text-center">
                      <img src={imagenn} className="img-fluid logoini" alt="Logo" />
                      <h1>Bienvenido</h1>
                      <h3>Gestor bodega</h3>
                    </div>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                      className="mt-5"
                    >
                      <Form.Group as={Col} controlId="validationCustomUsername">
                        <Form.Label>Número de documento</Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="number"
                            placeholder="Por favor, ingrese su número de documento."
                            required
                            onChange={(e) => setUser(e.target.value)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Por favor ingrese un número de documento válido.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        controlId="validationCustomPassword"
                        className="mt-3"
                      >
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                          required
                          type="password"
                          placeholder="Por favor, ingrese su contraseña."
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor ingrese una contraseña.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button type="submit" variant="dark" className="mt-4">
                        Iniciar Sesión
                      </Button>
                    </Form>
                  </div>
                </div>
                <div className="img-fluid fond col-12 col-md-6 d-flex align-items-center gradient-custom-2 ">
                  <img src={imagencor} className="img-fluid" alt="Logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormularioLogin;
