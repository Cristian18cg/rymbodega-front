import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Swal from "sweetalert2";
import useControl_Compras from "../../../hooks/useControl_Compras";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
const ActualizarArchivos = ({ documento, field, usuario, NombreProveedor }) => {
  const { actualizarArchivo, setvisibleActualizarArchivos } =
    useControl_Compras();
  const [archivo, setArchivo] = useState();
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
  /* Funcion enviar nuevos archivos */
  const nuevoArchivo = async () => {
   
    const user = usuario;
    actualizarArchivo(field, documento, user, archivo, NombreProveedor);
    setArchivo();
  };
  /* confirmar actualizar archivo */
  const confirm1 = () => {
    confirmDialog({
      mahmut: "mahmut",
      message: `Estas seguro(a) de querer actualizar este archivo ${usuario}?`,
      header: "Confirmar actualización",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => nuevoArchivo(),
      reject,
    });
  };
  /* Mensaje de cancelar proceso de actualizar archivo */
  const reject = () => {
    setArchivo();
    showError("Has cancelado el proceso.");
    const camposArchivo = document.querySelectorAll('input[type="file"]');
    camposArchivo.forEach((campo) => {
      campo.value = "";
    });
  };
  return (
    <div className="flex justify-content-center mt-2 p-2">
      <Form>
        <Form.Group
          as={Col}
          controlId="archivo"
          className="mt-2 form-control-gestion"
        >
          <Form.Label> Actualizar {field.nombre_archivo}</Form.Label>
          <Form.Control
            required
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const fileType = e.target.files[0].type;
              if (fileType == "application/pdf") {
                setArchivo(e.target.files[0]);
              } else {
                showError("No es un archivo pdf, vuelve a intentar.");
                e.target.value = "";
              }
            }}
          />
        </Form.Group>
        <div className="text-center mt-3">
          <Button
            type="submit"
            icon="pi pi-upload"
            label="Cargar"
            className="p-button p-component p-button-outlined button-gestion"
            onClick={(e) => {
              if (archivo === undefined || archivo === "") {
                showError("Debes cargar un archivo");
              } else {
                e.preventDefault();
                confirm1();
              }
            }}
          />
          <Button
            outlined
            raised
            icon="pi pi-times-circle"
            label="Cancelar"
            type="submit"
            className=" button-gestion button-cancel"
            onClick={(e) => {
              setvisibleActualizarArchivos(false);
              e.preventDefault();
              setArchivo();
            }}
          ></Button>
        </div>
      </Form>
    </div>
  );
};

export default ActualizarArchivos;
