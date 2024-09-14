import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import imagen from "../../img/gestion_humana/agregar-usuario.png";
import buscarimg from "../../img/gestion_humana/buscar.png";
import tablaimg from "../../img/gestion_humana/Tabla.png";
import crearcarpeta from "../../img/gestion_humana/crearcarpeta.png";
import tabla2 from "../../img/gestion_humana/tabla2.png";
import log from "../../img/gestion_humana/log.png";
import { useNavigate } from "react-router-dom";
import useControl from "../../hooks/useControl";
import {DashboardHome} from './DashboardHome'
const Home = () => {
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
          <h3>Bienvenido(a) {usuario} a Gestor de pedidos</h3>
        </div>
        <div className="col-md-3 mt-2 ">
          <Card
            className="target-home d-flex align-items-center justify-content-center mb-3"
            header={header}
            onClick={() => {
              navigate("crear/entregador");
            }}
          >
            <Button
              label="Agregar entregador"
              className="btn btn-outline-primary button-home-card"
              onClick={() => {
                navigate("crear/entregador");
              }}
            />
          </Card>
        </div>
        <div className="col-md-3 mt-2 ">
          <Card
            className="target-home d-flex align-items-center justify-content-center mb-3"
            header={header3}
            onClick={() => {
              navigate("lista/entregas");
            }}
          >
            <Button
              label="Lista de entregas"
              className="btn btn-outline-primary button-home-card "
              onClick={() => {
                navigate("lista/entregas");
              }}
            />
          </Card>
        </div>
        <div className="col-md-3 mt-2 ">
          <Card
            className="target-home d-flex align-items-center justify-content-center mb-3"
            header={header6}
            onClick={() => {
              navigate("lista/historico_entregas");
            }}
          >
            <Button
              label="Historico entregadores"
              className="btn btn-outline-primary button-home-card "
              onClick={() => {
                navigate("lista/historico_entregas");
              }}
            />
          </Card>
        </div>
        <div className="col-md-3 mt-2 ">
          <Card
            className="target-home d-flex align-items-center justify-content-center mb-3"
            header={header5}
            onClick={() => {
              navigate("woocomerce/productos");
            }}
          >
            <Button
              label="Lista Woocomerce"
              className="btn btn-outline-primary button-home-card "
              onClick={() => {
                navigate("woocomerce/productos");
              }}
            />
          </Card>
        </div>
      </div>
      <DashboardHome />
    </div>
  );
};

export default Home;
