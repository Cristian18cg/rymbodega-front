import React, { useState, useEffect, useRef } from "react";
import Formulario from "./Formulario";
import { AutoComplete } from "primereact/autocomplete";
import useControl from "../../../hooks/useControl";
import useControlCarpetaActivo from "../../../hooks/useControl_Contrato_Activo";
import useControlCarpetaRetiro from "../../../hooks/useControl_Documentos_Retiro";
import { Button } from "primereact/button";
import Swal from "sweetalert2";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const CrearCarpetaDocRetiro = () => {
  const navigate = useNavigate();
  const { usuario } = useControl();
  const {
    busquedaCrearCarpeta,
    setBbusquedaCrearCarpeta,
    respuestaCrearCarpetaRetiro,
  } = useControlCarpetaRetiro();
  const { ListarColab, colaboradores } = useControlCarpetaActivo();
  const [precolaborador_seleccionado, presetcolaborador_seleccionado] =
    useState(null);
  const [colaborador_seleccionado, setcolaborador_seleccionado] = useState();
  const [filtrarColab, setfiltrarColab] = useState(null);
  const [button_crear, setbutton_crear] = useState(true);
  const [errorMessage, setErrorMessage] = useState(true);

  const delayedRequest = debounce(() => {
    if(colaboradores.length === 0){
      ListarColab();
    }
  }, 500)

  useEffect(() => {
    delayedRequest()
  }, []);

  useEffect(() => {
    if (busquedaCrearCarpeta === true) {
      
      presetcolaborador_seleccionado();
      setcolaborador_seleccionado();
      setbutton_crear(true);
    }
  }, [busquedaCrearCarpeta]);

  const showSuccess = (mensaje) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      background: "#f3f2e8",
      color: "black",
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: mensaje ? mensaje : "",
      buttonsStyling: false,
    });
  };


  /* Valida si ya tiene creado carpeta de ingreso */
  const validar = (valor) => {
    presetcolaborador_seleccionado(valor);
    let _validar;
    _validar = colaboradores.filter((colaborador) => {
      return colaborador.numero_documento.toLowerCase().startsWith(valor);
    });
    if (_validar.length === 0 && typeof valor === "object" && valor !== null) {
      setcolaborador_seleccionado(valor);
      setbutton_crear(false);
      setErrorMessage(null);
    } else {
      setbutton_crear(true);
      if (_validar.length !== 0) {
        setErrorMessage("Selecciona una de las opciones.");
      } else {
        setErrorMessage("El valor ingresado no corresponde a un colaborador.");
      }
    }
  };
  /* Template de las opciones de empleado */
  const itemTemplate = (item) => {
    return (
      <div className="flex align-items-center">
        <div>Numero de documento {item.numero_documento}</div>
        <p>
          Nombre:{item.nombre_colaborador} {item.apellidos}
        </p>
      </div>
    );
  };
  /* Filtrar*/
  const search = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filtrarColab;

      if (!event.query.trim().length) {
        _filtrarColab = colaboradores.filter(
          (colaborador) => !colaborador.carpeta_colaborador_retiro
        );
      } else {
        _filtrarColab = colaboradores.filter((colaborador) => {
          return (
            colaborador.numero_documento.startsWith(event.query) &&
            !colaborador.carpeta_colaborador_retiro
          );
        });
      }

      setfiltrarColab(_filtrarColab);
    }, 250);
  };
  return (
    <div>
      {busquedaCrearCarpeta ? (
        colaboradores && colaboradores.length !== 0   ? (
          <div className="row mt-5">
            <div className="col-md-8 offset-md-3 mx-auto">
              <div className="card text-center">
              <div className="card-header bg-black align-items-center">
                  <div className="row  align-items-center">
                    <div className="col-md-1  col-lg-1">
                      <Button
                        type="button"
                        icon="pi pi-refresh"
                        label=""
                        outlined
                        className="color-icon"
                        onClick={() => {
                          ListarColab();
                        }}
                      />
                    </div>
                    <div className=" col-md-7 col-lg-7">
                      <h3 className="font-weight-bold header-buscar" >
                        BUSCAR COLABORADOR
                      </h3>
                    </div>
                    <div className=" col-md-4 col-lg-4">
                    <Button
                      type="button"
                      iconPos="right"
                      icon="pi pi-arrow-right"
                      label="Lista documentos retiro"
                      outlined
                      className="color-icon"
                      onClick={() => {
                        navigate("/lista_documentos_retiro");
                      }}
                    />
                  </div>
                  </div>
                </div>
                <div className="card-body">
                  
                  <div className="">
                    <AutoComplete
                      placeholder="Escribe un numero de documento"
                      className="autocompletecrear"
                      field="numero_documento"
                      value={precolaborador_seleccionado}
                      completeMethod={search}
                      suggestions={filtrarColab}
                      onChange={(e) => {
                        validar(e.value);
                      }}
                      itemTemplate={itemTemplate}
                      dropdown
                    />
                    {errorMessage && (
                      <div className="error-message">{errorMessage}</div>
                    )}

                    <div className="text-center mt-3">
                      <Button
                        disabled={button_crear}
                       
                        outlined
                        label={"Crear carpeta retiro"}
                        className="button-gestion"
                        onClick={(e) => {
                          e.preventDefault();
                          setBbusquedaCrearCarpeta(false);

                          showSuccess(
                            `¡Perfecto! has elegido a ${
                              colaborador_seleccionado.nombre_colaborador
                                ? colaborador_seleccionado.nombre_colaborador
                                : "un colaborador sin nombre"
                            }`
                            
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex aling-items-center ">
            <ProgressSpinner
              className="spinner"
              fill="var(--surface-ground)"
              strokeWidth="8"
            />
          </div>
        )
      ) : (
        <div className="flex flex-column h-12rem">
          <Formulario
            colaborador_seleccionado={colaborador_seleccionado}
            usuario={usuario}
          />
        </div>
      )}
    </div>
  );
};

export default CrearCarpetaDocRetiro;
