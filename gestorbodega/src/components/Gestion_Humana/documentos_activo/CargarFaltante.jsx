import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Swal from "sweetalert2";
import { Button } from "primereact/button";
import useControlCarpetaActivo from "../../../hooks/useControl_Contrato_Activo";

export const CargarFaltante = ({
  usuario,
  documento,
  nombreCompleto,
  field,
}) => {
  const {
    setVisibleCargarArchivos,
    visibleCargarArchivos,
    setfiltroGlobal,
    subirArchivoActivo,
    archivosActivo,
  } = useControlCarpetaActivo();
  const [archivo, setArchivo] = useState();

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

  const nuevoArchivo = async (event) => {
    event.preventDefault();
    try {
      const user = usuario;
      const res = await subirArchivoActivo(field, documento, user, archivo);
      setVisibleCargarArchivos(false);
      setArchivo(); // Manejar éxito, redireccionar o mostrar un mensaje de éxito
    } catch (error) {
      showError("Ah ocurrido un error al subir el archivo: \n" + error);
    }
  };
  return (
    <div className="flex justify-content-center mt-2 p-2">
      <Form>
        <Form.Group
          as={Col}
          controlId="archivo"
          className="mt-2 form-control-gestion"
        >
          <Form.Label>{field}</Form.Label>
          <Form.Control
            required
            type="file"
            accept=".pdf"
            onChange={(e) => {
              /*  setArchivo(e.target.files[0]) */
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
                 nuevoArchivo(e); 
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
              e.preventDefault();
              setVisibleCargarArchivos(false);
              setArchivo();
            }}
          ></Button>
        </div>
      </Form>
    </div>
  );
};
