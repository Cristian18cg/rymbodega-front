import React, { useState } from 'react'
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Button } from "primereact/button";
import useControlCarpetaActivo from "../../../../hooks/useControl_Contrato_Activo";
import useControl from "../../../../hooks/useControl";
import Swal from "sweetalert2";

export const CargarArchivosSubcarpetas = ({documento,nombre_carpeta}) => {
const [archivo,setarchivo] = useState()
const { usuario } = useControl();
const {
    subirArchivoSubcarpeta,
    setvisibleCargarArchivosNuevos,
  } = useControlCarpetaActivo();


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

  const nuevoArchivoSubcarpeta = async (event) => {
    event.preventDefault();
    try {
      const user = usuario;
      const res = await subirArchivoSubcarpeta(documento, user, archivo,nombre_carpeta);
      setarchivo();
      setvisibleCargarArchivosNuevos(false);
    } catch (error) {
      showError(
        "Ah ocurrido un error al subir el archivo en otros archivos: \n" + error
      );
    }
  };
  return (
    <div className="flex justify-content-center p-2">
              <Form>
                <Form.Group
                  as={Col}
                  controlId="archivosubcarpeta"
                  className="mt-4 form-control-gestion"
                >
                  <Form.Control
                    required
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const fileType = e.target.files[0].type;
                      if (fileType == "application/pdf") {
                        setarchivo(e.target.files[0]);
                      } else {
                        showError("No es un archivo pdf, vuelve a intentar.");
                        e.target.value = "";
                      }
                    }}
                  />
                  <p className="mt-2">
                    Nota: asegúrate de nombrar el archivo de manera adecuada.
                    <br></br>
                    Cuando subas el archivo, se le añadirá automáticamente '{nombre_carpeta}'  y  la
                    fecha en la que fue cargado 
                  </p>
                </Form.Group>
                <div className="text-center">
                  <Button
                    icon="pi pi-upload"
                    type="submit"
                    label="Cargar"
                    className="p-button p-component p-button-outlined button-gestion"
                    onClick={(e) => {
                      if (archivo === undefined || archivo === "") {
                        showError("Debes cargar un archivo");
                      } else {
                        nuevoArchivoSubcarpeta(e);
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
                      setarchivo();
                      setvisibleCargarArchivosNuevos(false)
                    }}
                  />
                </div>
              </Form>
            </div>
  )
}

