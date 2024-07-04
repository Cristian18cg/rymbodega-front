import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Swal from "sweetalert2";
import { Button } from "primereact/button";
import useControl_DocumentosIngreso from "../../../hooks/useControl_DocumentosIngreso";

const CargarArchivosIngreso = ({ documento, field, usuario }) => {
  const { subirArchivo, setvisibleCargarArchivos } =
    useControl_DocumentosIngreso();
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
  const nuevoArchivo = async (event) => {
    event.preventDefault();
    const user = usuario;
    subirArchivo(field, documento, user, archivo);
    setArchivo();
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
              setvisibleCargarArchivos(false);
              e.preventDefault();
              setArchivo();
            }}
          ></Button>
        </div>
      </Form>
    </div>
  );
};

export default CargarArchivosIngreso;
