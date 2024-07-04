import React from "react";
import image2 from "../../../img/lobby/logocamion.svg";
import image1 from "../../../img/lobby/logopersona.svg";
import { Ripple } from "primereact/ripple";
import useControlVentas from "../../../hooks/useControlVentas";
import AnunciarLlegada from "./AnunciarLlegada";
const HomeAnunciar = () => {
  const { indexAnunciamiento, setindexAnunciamiento } = useControlVentas();
  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100">
      {indexAnunciamiento === 0 && (
        <div className="row w-100">
          <div className="col-12 col-md-12 d-flex justify-content-center mb-4 mb-md-0">
            <h1>¿Porqué tipo de entrega vienes ?</h1>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center mb-4 mb-md-0">
            <div
              className="card d-flex align-items-center justify-content-center p-ripple"
              style={{ width: "90%", height: "80vh" }}
              onClick={() => {
                setindexAnunciamiento(1);
              }}
            >
              <img
                src={image1}
                alt="Persona"
                style={{ width: "80%", height: "auto" }}
              />
              <div className="card-body d-flex justify-content-center align-items-center">
                <h1 className="card-text text-center  mb-5">
                  Persona autorizada
                </h1>
              </div>
              <Ripple
                pt={{
                  root: { style: { background: "#0003" } },
                }}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center">
            <div
              className="card d-flex align-items-center justify-content-center p-ripple"
              style={{ width: "90%", height: "80vh" }}
              onClick={() => {
                setindexAnunciamiento(2);
              }}
            >
              <img
                src={image2}
                alt="Transportadora"
                style={{ width: "80%", height: "auto" }}
              />
              <div className="card-body d-flex justify-content-center align-items-center">
                <h1 className="card-text text-center mb-5">Transportadora</h1>
              </div>
              <Ripple
                pt={{
                  root: { style: { background: "#0003" } },
                }}
              />
            </div>
          </div>
        </div>
      )}
    
      {indexAnunciamiento !== 0  && (
        <>
          <AnunciarLlegada ></AnunciarLlegada>
        </>
      )}
    </div>
  );
};

export default HomeAnunciar;
