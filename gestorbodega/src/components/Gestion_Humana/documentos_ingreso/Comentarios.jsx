import React, { useState, useEffect, useRef } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Swal from "sweetalert2";
import { Button } from "primereact/button";
import useControl_DocumentosIngreso from "../../../hooks/useControl_DocumentosIngreso";
const Comentarios = ({ descripcion, usuario, documento,auxiliar  }) => {
  const [Descripcion, setDescripcion] = useState(descripcion);
  const [activarBoton, setactivarBoton] = useState(true);
  const { setvisibleComentarios, ActualizarDescripcion } =
    useControl_DocumentosIngreso();
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
  const confirm4 = () => {
    confirmDialog({
      mahmut: "mahmut",
      message: `Estas seguro(a) de querer actualizar esta novedad ${usuario}?`,
      header: "Confirmar actualizacion",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => Actualizar_descripcion(),
      reject,
    });
  };
  /* Mensaje de cancelar proceso eliminar o aprobar archivo */
  const reject = () => {
    showError("Has cancelado el proceso");
  };
  const Actualizar_descripcion = async () => {
    ActualizarDescripcion(documento, usuario, Descripcion);
    setactivarBoton(true);
  };

  return (
    <div className="flex justify-content-center p-2">
      <ConfirmDialog />

      <Form.Group
        as={Col}
        controlId="descripcion"
        className="form-control-gestion"
      >
        <Form.Control
            disabled={auxiliar}
          style={{ minHeight: "200px" }}
          placeholder="Por favor, ingrese cualquier novedad relacionada con algun archivo..."
          as="textarea"
          className="form-control-gestion"
          value={Descripcion}
          onChange={(e) => {
            setDescripcion(e.target.value);
            setactivarBoton(false);
          }}
        />
      </Form.Group>
      <div className="text-center ">
      {!auxiliar && (
          <>
        <Button
          disabled={activarBoton}
          type="submit"
          icon="pi pi-upload"
          label="Actualizar descripcion"
          className="p-button p-component p-button-outlined button-gestion"
          onClick={() => {
            if (
              Descripcion === undefined ||
              Descripcion === "" ||
              Descripcion === null
            ) {
              showError("Debes cambiar la descripcion para poder enviar");
            } else {
              confirm4();
            }
          }}
        />
        <Button
          outlined
          raised
          icon="pi pi-times-circle"
          label="Cancelar"
          className=" button-gestion button-cancel"
          onClick={() => {
            setvisibleComentarios(false);
            setactivarBoton(true);
          }}
        ></Button>
        </> )}
      </div>
    </div>
  );
};

export default Comentarios;
