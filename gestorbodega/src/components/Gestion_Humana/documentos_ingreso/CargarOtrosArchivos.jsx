import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Swal from "sweetalert2";
import { Button } from "primereact/button";
import useControl_DocumentosIngreso from "../../../hooks/useControl_DocumentosIngreso";
export const CargarOtrosArchivos = ({ usuario, documento }) => {
  const { OtrosArchivos, subirotroArchivo } = useControl_DocumentosIngreso();
  const [otroarchivo, setotroArchivo] = useState();
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
 
  const nuevootroArchivo = async (event) => {
 
      event.preventDefault();
      const user = usuario;
      subirotroArchivo(documento, user, otroarchivo);
      setotroArchivo();
      const camposArchivo = document.querySelectorAll('input[type="file"]');
      camposArchivo.forEach((campo) => {
        campo.value = "";
      });
  
  };
  return (
    <div className="flex justify-content-center p-2">
      <Form>
        <Form.Group
          as={Col}
          controlId="otroarchivo"
          className="mt-4 form-control-gestion"
        >
          <Form.Control
            required
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const fileType = e.target.files[0].type;
              if (fileType == "application/pdf") {
                setotroArchivo(e.target.files[0]);
              } else {
                showError("No es un archivo pdf, vuelve a intentar.");
                e.target.value = "";
              }
            }}
          />
          <p className="mt-2">
            Nota: asegúrate de nombrar el archivo de manera adecuada.
            <br></br>
            Cuando subas el archivo, se le añadirá automáticamente la fecha en
            la que fue cargado.
          </p>
        </Form.Group>
        <div className="text-center">
          <Button
            icon="pi pi-upload"
            type="submit"
            label="Cargar"
            className="p-button p-component p-button-outlined button-gestion"
            onClick={(e) => {
              if (otroarchivo === undefined || otroarchivo === "") {
                showError("Debes cargar un archivo");
              } else {
                nuevootroArchivo(e);
              }
            }}
          />
          <Button
            outlined
            raised
            icon="pi pi-times-circle"
            label="Cancelar"
            type="submit"
            className="button-cancel"
            onClick={(e) => {
              e.preventDefault();
              setotroArchivo();
            }}
          />
        </div>
      </Form>
    </div>
  );
};
