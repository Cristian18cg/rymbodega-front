import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Button } from "primereact/button";
import Swal from "sweetalert2";
import Row from "react-bootstrap/Row";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { ProgressBar } from "primereact/progressbar";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Tag } from "primereact/tag";
import { FloatLabel } from "primereact/floatlabel";

{
  /* <MultiSelect
value={selectedSolicitudesTr}
options={filterOptions(selectedSolicitudes)}
onChange={(e) => setSelectedSolicitudesTr(e.value)}
placeholder="Seleccione las solicitudes a recoger"
display="chip"
/> */
}
const CambioReceptor = () => {
  const [buttonenviar, setbuttonenviar] = useState(true);
  return (
    <div className="row mt-5">
      <div className="col-md-8 offset-md-3 mx-auto">
        <div className="card text-center">
          <div className="card-header bg-black d-flex text-center align-items-center">
            <h3 className="font-weight-bold header-buscar">
              Crear cambio de receptor solicitud
            </h3>
          </div>
          <div className="card-body">
            <div className="">
             

              <div className="text-center mt-3">
                <Button
                  disabled={buttonenviar}
                  outlined
                  label={"Enviar solicitud"}
                  className="button-gestion"
                  onClick={(e) => {
                    /*  e.preventDefault();
                  setBbusquedaCrearCarpeta(false);

                  showSuccess(
                    `¡Perfecto! has elegido a ${
                      colaborador_seleccionado.nombre_colaborador
                        ? colaborador_seleccionado.nombre_colaborador
                        : "un colaborador sin nombre"
                    }`
                    
                  ); */
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CambioReceptor;
