import React, { useState } from "react";
import { Form, Button, Container, InputGroup } from "react-bootstrap";

const pass = () => {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    // Aquí puedes enviar las contraseñas al servidor o hacer cualquier otra acción necesaria
  };

  const passwordInputType = showPassword ? "text" : "password";
  const repeatPasswordInputType = showPassword ? "text" : "password";

  return (
    <Container>
      <h1>Repetidor de Contraseña con React</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <InputGroup>
            <Form.Control
              type={passwordInputType}
              placeholder="Contraseña"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button
              variant="outline-secondary"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </Button>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Repetir Contraseña</Form.Label>
          <InputGroup>
            <Form.Control
              type={repeatPasswordInputType}
              placeholder="Repetir Contraseña"
              value={repeatPassword}
              onChange={handleRepeatPasswordChange}
            />
            <Button
              variant="outline-secondary"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </Button>
          </InputGroup>
          {error && <div className="text-danger">{error}</div>}
        </Form.Group>
        <Button variant="primary" type="submit">
          Enviar
        </Button>
      </Form>
    </Container>
  );
};

export default pass;
