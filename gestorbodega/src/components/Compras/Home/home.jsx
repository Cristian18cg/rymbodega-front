import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import crearproveedor from "../../../img/compras/crearproveedor.png";
import tabla from "../../../img/compras/tabla.png";
import { useNavigate } from "react-router-dom";
import useControl from "../../../hooks/useControl";
import {Dashborad} from './Dashborad'
const HomeCompras = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid home-gestion">
      <div className="row mt-2">
        <div className="col-md-6 mt-2  ">
          <Card
            className="target-home-compras mb-3"
            onClick={() => {
              navigate("/crear_proveedor");
            }}
          >
            <div className="d-flex  flex-column justify-content-center align-items-center">
              <img
                alt="Card"
                src={crearproveedor}
                className="imagen_home_compras"
                onClick={() => {
                  navigate("/listar_proveedores");
                }}
              />
              <p>
                <strong>Crear proveedor</strong>
              </p>
            </div>
          </Card>
        </div>
        <div className="col-md-6 mt-2">
          <Card
            className="target-home-compras mb-3 "
            onClick={() => {
              navigate("/listar_proveedores");
            }}
          >
            <div className="d-flex  flex-column justify-content-center align-items-center">
              <img
                alt="Card"
                src={tabla}
                className="imagen_home_compras"
                onClick={() => {
                  navigate("/listar_proveedores");
                }}
              />
              <p>
                <strong>Lista de proveedores</strong>
              </p>
            </div>
          </Card>
        </div>
      </div>
        <Dashborad/>
    </div>

  );
};

export default HomeCompras;
