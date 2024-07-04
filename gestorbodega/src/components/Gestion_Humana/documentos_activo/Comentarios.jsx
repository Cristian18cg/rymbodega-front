import React, { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Button } from "primereact/button";
import Swal from "sweetalert2";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import useControl from "../../../hooks/useControl";
import useControlCarpetaActivo from "../../../hooks/useControl_Contrato_Activo";

export const Comentarios = ({ documento, Descripcion, auxiliar }) => {
  const { usuario } = useControl();
  const {
    ActualizarDescripcionActivos,
    setvisibleComentarios,
  } = useControlCarpetaActivo();
  const [descripcion, setDescripcion] = useState(Descripcion);
  const [activarBoton, setactivarBoton] = useState(true);

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

  const Actualizar_descripcion = async () => {
    try {
      await ActualizarDescripcionActivos(documento, usuario, descripcion);
      setactivarBoton(true);
    } catch (error) {
      showError(error.response.data.error);
    }
  };
  const confirm = () => {
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
  return (
    <div className="flex justify-content-center p-2">
      <ConfirmDialog className="" />
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
          value={descripcion}
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
                  descripcion === undefined ||
                  descripcion === "" ||
                  descripcion === null
                ) {
                  showError("Debes cambiar la descripcion para poder enviar");
                } else {
                  confirm();
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
            setactivarBoton(true);
            setvisibleComentarios(false);
          }}
        ></Button>
          </>
        )}

        
      </div>
    </div>
  );
};
