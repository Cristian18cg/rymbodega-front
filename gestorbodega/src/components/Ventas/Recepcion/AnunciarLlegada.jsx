import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { Ripple } from "primereact/ripple";
import { InputNumber } from "primereact/inputnumber";
import { FloatLabel } from "primereact/floatlabel";
import useContextVentas from "../../../hooks/useControlVentas";
import { Button } from "primereact/button";

const AnunciarLlegada = () => {
  const { crearAnunciamiento, setindexAnunciamiento, indexAnunciamiento } =
    useContextVentas();
  const [Nit, setNit] = useState(0);
  const [Documento, setDocumento] = useState(0);
  const [inputIndex, setinputIndex] = useState(0);
  const handleButtonClick = (value) => {
    if (inputIndex === 0) {
      if (!Nit) {
        setNit(0);
        setNit((prev) => prev + value);
      } else {
        setNit((prev) => prev + value);
      }
    } else if (inputIndex === 1) {
      if (!Documento) {
        setDocumento(0);
        setDocumento((prev) => prev + value);
      } else {
        setDocumento((prev) => prev + value);
      }
    }
  };

  const handleClear = () => {
    if (inputIndex === 0) {
      setNit(0);
    } else if (inputIndex === 1) {
      setDocumento(0);
    }
  };

  const handleRegistrar = () => {
    switch (inputIndex) {
      case 0:
        if (
          Nit === undefined ||
          Nit === 0 ||
          Nit?.length < 6 ||
          Nit?.length > 15
        ) {
          showError("Por favor digite un numero de nit valido.");
        } else {
          if (indexAnunciamiento === 2) {
            crearAnunciamiento(Nit, null, true);
            setNit(0);
          } else {
            setinputIndex(1);
          }
        }
        break;
      case 1:
        if (
          Documento === undefined ||
          Documento === 0 ||
          Documento?.length < 6 ||
          Documento?.length > 15
        ) {
          showError("Por favor digite un numero de identificacion valido.");
        } else {
          crearAnunciamiento(Nit, Documento, false);
          setNit(0);
          setDocumento(0);
        }
        break;
    }
  };

  const showError = (error) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 5000,
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
  const elegirValue = () => {
    if (inputIndex === 0) {
      return Nit;
    } else if (inputIndex === 1) {
      return Documento;
    }
  };
  return (
    <div className="row">
      <div className="col-md-2 col-sm-12 ">
        <Button
          className=" button-gestion button-anun mt-3"
          icon={"pi pi-arrow-left"}
          label="volver"
          onClick={() => {
            setindexAnunciamiento(0);
          }}
        />
      </div>
      <div className="col-md-10  col-sm-12">
        <div
          className="card d-flex align-items-center card-anunciar"
          style={{ backgroundColor: "#fff", color: "#000", height: "100vh" }}
        >
          <h1 className="mb-4" style={{ color: "#000" }}>
            {inputIndex === 0
              ? "  INGRESA EL NIT DEL CLIENTE"
              : indexAnunciamiento === 1
              ? "  INGRESA TU NUMERO DE DOCUMENTO"
              : ""}
          </h1>
          <div className="">
            <FloatLabel>
              <label htmlFor="number" style={{ color: "#000" }}>
                {inputIndex === 0
                  ? "   Nit del cliente"
                  : inputIndex === 1
                  ? "  Numero de documento"
                  : ""}
              </label>
              <InputNumber
                id="number"
                value={elegirValue()}
                onValueChange={(e) => {
                  const val = e.target.value;
                  if (inputIndex === 0) {
                    setNit(val);
                  } else if (inputIndex === 1) {
                    setDocumento(val);
                  }
                }}
                useGrouping={false}
                showIcon
                showButtonBar
                className=" input-teclado"
              />
            </FloatLabel>
          </div>
          <div className="grid-container row mt-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <div key={number} className="col-4 col-sm-4 col-md-2 w-100">
                <div
                  className="p-ripple d-flex select-none justify-content-center align-items-center  border-round p-5 boton-anunciamiento"
                  onClick={() => handleButtonClick(number.toString())}
                >
                  <strong style={{ fontSize: "30px" }}>{number}</strong>
                  <Ripple
                    pt={{
                      root: { style: { background: "#dfc419" } },
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="grid-container row mt-3" >
            <div
             className="col-4 col-sm-4 col-md-4 d-flex select-none justify-content-center align-items-center shadow-2 border-round p-ripple boton-anunciamiento"
              onClick={handleClear}
              style={{ backgroundColor: "#aa2323" }}
            >
              <Ripple
                pt={{
                  root: { style: { background: "red" } },
                }}
              />
              <i className="pi pi-delete-left  icons-anunciar" ></i>
            </div>
            <div
               className="col-4 col-sm-4 col-md-4 p-ripple d-flex select-none justify-content-center align-items-center border-round p-5 boton-anunciamiento"
              onClick={() => handleButtonClick(0)}
            >
              <strong style={{ fontSize: "30px" }}>{0}</strong>
              <Ripple
                pt={{
                  root: { style: { background: "#dfc419" } },
                }}
              />
            </div>
            <div
               className="col-4 col-sm-4 col-md-4 d-flex select-none justify-content-center align-items-center shadow-2 border-round p-ripple boton-anunciamiento"
              onClick={handleRegistrar}
              style={{ backgroundColor: "#f8d300" }}
            >
              <i className="pi pi-check icons-anunciar" ></i>

              <Ripple
                pt={{
                  root: { style: { background: "white" } },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnunciarLlegada;
