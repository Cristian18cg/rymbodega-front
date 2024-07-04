import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import useControl from "../../hooks/useControl";
function FormExample() {
  const { login } = useControl();
  const [numero_de_documento, setnumero_de_documento] = useState(false);
  const [password, setpassword] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    form.checkValidity();
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      event.preventDefault.data;
      login(numero_de_documento, password);
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group as={Col} controlId="validationCustomUsername">
        <Form.Label>Numero de documento</Form.Label>
        <InputGroup hasValidation>
          <Form.Control
            type="number"
            placeholder="Por favor, ingrese su numero de documento"
            aria-describedby="inputGroupPrepend"
            required
            onChange={(e) => setnumero_de_documento(e.target.value)}
          />
          <Form.Control.Feedback>Bien!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Por favor ingrese su numero de documento
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group as={Col} controlId="validationCustom02">
        <Form.Label>Contraseña </Form.Label>
        <Form.Control
          required
          type="password"
          placeholder="Por favor, ingrse su contraseña"
          onChange={(e) => setpassword(e.target.value)}
        />
        <Form.Control.Feedback>Bien</Form.Control.Feedback>
        <Form.Control.Feedback type="invalid">
          Por favor ingrese su contraseña
        </Form.Control.Feedback>
      </Form.Group>
      <Button
        variant="dark"
        className="text-white me-md-2 temy-2 bg-black h-tp mt-3"
        type="submit"
      >
        Iniciar Sesion
      </Button>
    </Form>
  );
}

export default FormExample;
