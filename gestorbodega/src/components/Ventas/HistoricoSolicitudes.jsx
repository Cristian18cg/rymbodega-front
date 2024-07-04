import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { FloatLabel } from "primereact/floatlabel";
import { Calendar } from "primereact/calendar";
import useContextVentas from "../../hooks/useControlVentas";
import TablaSolicitudes from "./tablaSolicitudes";
const HistoricoSolicitudes = () => {
  const { buscarSolicitudes, solicitudesBus } = useContextVentas();
  const [Nit, setNit] = useState();
  const [verificacionButton, setverificacionButton] = useState(true);
  const [dates, setDates] = useState(null);
  const [loading, setLoading] = useState(false);
  const EnviarConsulta = () => {
    load()
    buscarSolicitudes(Nit, dates);
  };

  const load = () => {
    setLoading(true);

    setTimeout(() => {
        setLoading(false);
    }, 2000);
};
  return (
    <div>
      {solicitudesBus?.length === 0 || !solicitudesBus ? (
        <div className="row mt-5">
          <div className="col-md-6 offset-md-3 mx-auto">
            <div className="card text-center ">
              <div className="card-header bg-black align-items-center">
                <div className="row ">
                  <h3 className="font-weight-bold " style={{ color: "white" }}>
                    Buscar solicitudes por cliente
                  </h3>
                </div>
              </div>
              <div className="card-body">
                <div className="row p-2">
                  <div className="col-md-6 ">
                    <div className=" d-flex justify-content-center mt-4 ">
                      <FloatLabel>
                        <label for="number">Nit del cliente</label>
                        <InputNumber
                          id="number"
                          value={Nit}
                          onValueChange={(e) => {
                            const val = e.target.value;
                            setNit(e.value);
                            if (val && val > 0) {
                              setverificacionButton(false);
                            }
                          }}
                          useGrouping={false}
                          showIcon
                          showButtonBar
                        />
                      </FloatLabel>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex justify-content-center mt-4">
                      <FloatLabel>
                        <Calendar
                          id="calendar"
                          inputId="calendar"
                          value={dates}
                          onChange={(e) => setDates(e.value)}
                          selectionMode="range"
                          hideOnRangeSelection
                          maxDate={new Date()}
                          showButtonBar
                          showIcon
                        />
                        <label for="calendar">Rango fecha de creación</label>
                      </FloatLabel>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-3">
                  <Button
                    disabled={verificacionButton}
                    outlined
                    label="Realizar busqueda"
                    className="button-gestion"
                    onClick={EnviarConsulta}
                    loading={loading}

                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <TablaSolicitudes info={Nit} />
      )}
    </div>
  );
};

export default HistoricoSolicitudes;
