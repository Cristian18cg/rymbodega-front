import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import imagen from "../../img/gestion_humana/agregar-usuario.png";
import buscarimg from "../../img/gestion_humana/buscar.png";
import tablaimg from "../../img/gestion_humana/Tabla.png";
import crearcarpeta from "../../img/gestion_humana/crearcarpeta.png";
import tabla2 from "../../img/gestion_humana/tabla2.png";
import log from "../../img/gestion_humana/log.png";
import { Dashborad } from "./Dashborad";
import { useNavigate } from "react-router-dom";
import useControl from "../../hooks/useControl";

const Home_gestion_humana = () => {
  const { usuario } = useControl();

  const navigate = useNavigate();
  const header = <img alt="Card" src={imagen} className="imagen_home" />;
  const header2 = <img alt="Card" src={buscarimg} className="imagen_home" />;
  const header3 = <img alt="Card" src={tablaimg} className="imagen_home" />;
  const header4 = <img alt="Card" src={crearcarpeta} className="imagen_home" />;
  const header5 = <img alt="Card" src={tabla2} className="imagen_home" />;
  const header6 = <img alt="Card" src={log} className="imagen_home" />;
  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center home-gestion">
      <div className="row mt-2">
        <div className=" d-flex align-items-center justify-content-center">
          <h3>Bienvenido(a) {usuario} a Gestion Humana</h3>
        </div>
        <div className="col-md-2 mt-2 ">
          <Card
            className="target-home d-flex align-items-center justify-content-center mb-3"
            header={header}
            onClick={() => {
              navigate("/agregar_documento");
            }}
          >
            <Button
              label="Agregar colaborador"
              className="btn btn-outline-primary button-home-card"
              onClick={() => {
                navigate("/agregar_documento");
              }}
            />
          </Card>
        </div>
        <div className="col-md-2 mt-2 ">
          <Card
            className="target-home d-flex align-items-center justify-content-center mb-3"
            header={header3}
            onClick={() => {
              navigate("/lista_colaboradores");
            }}
          >
            <Button
              label="Lista colaboradores"
              className="btn btn-outline-primary button-home-card "
              onClick={() => {
                navigate("/lista_colaboradores");
              }}
            />
          </Card>
        </div>
        <div className="col-md-2 mt-2  ">
          <Card
            className="target-home d-flex align-items-center justify-content-center mb-3"
            header={header4}
            onClick={() => {
              navigate("/crear_carpeta_contrato_activo");
            }}
          >
            <Button
              label="Crear carpeta contrato activo"
              className="btn btn-outline-primary button-home-card"
              onClick={() => {
                navigate("/crear_carpeta_contrato_activo");
              }}
            />
          </Card>
        </div>
        <div className="col-md-2 mt-2 ">
          <Card
            className="target-home d-flex align-items-center justify-content-center mb-3"
            header={header5}
            onClick={() => {
              navigate("/lista_documentos_activo");
            }}
          >
            <Button
              label="Lista contrato activo"
              className="btn btn-outline-primary button-home-card "
              onClick={() => {
                navigate("/lista_documentos_activo");
              }}
            />
          </Card>
        </div>
        <div className="col-md-2 mt-2 ">
          <Card
            className="target-home d-flex align-items-center justify-content-center mb-3"
            header={header4}
            onClick={() => {
              navigate("/crear_carpeta_doc_retiro");
            }}
          >
            <Button
              label="Crear carpeta de retiro"
              className="btn btn-outline-primary button-home-card "
              onClick={() => {
                navigate("/crear_carpeta_doc_retiro");
              }}
            />
          </Card>
        </div>
        <div className="col-md-2 mt-2 ">
          <Card
            className="target-home d-flex align-items-center justify-content-center mb-3"
            header={header6}
            onClick={() => {
              navigate("/log_registros");
            }}
          >
            <Button
              label="Log de registros"
              className="btn btn-outline-primary button-home-card "
              onClick={() => {
                navigate("/log_registros");
              }}
            />
          </Card>
        </div>
      </div>
      <Dashborad />
    </div>
  );
};

export default Home_gestion_humana;
