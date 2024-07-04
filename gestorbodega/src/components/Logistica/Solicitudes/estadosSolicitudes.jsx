import React, { useState, useEffect } from "react";
import useContextVentas from "../../../hooks/useControlVentas";
import useControl from "../../../hooks/useControl";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import Swal from "sweetalert2";
import { debounce } from "lodash";
import CargaArchivos from "../../Ventas/cargaArchivos";
import { Toast } from "primereact/toast";

const Estados = ({ rowData, handleClose }) => {
  const { actualizarEstadoSolicitud, ObtenerPersonal } = useContextVentas();
  const { token } = useControl();
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [selectedReportadoEstado, setSelectedReportadoEstado] = useState(null);
  const [selectRemisionadoEsatado, setSelectRemisionadoEsatado] = useState(null)
  const [auxiliaresPersonales, setAuxiliaresPersonales] = useState([]);
  const [selectedAuxiliar, setSelectedAuxiliar] = useState(null);
  const [cargoId, setCargoId] = useState(rowData.estado === "REPORTADO" ? 8 : 3);
  const estados = [
    { name: "En alistamiento", code: "EN ALISTAMIENTO" },
    { name: "Rechazado", code: "RECHAZADO" },
  ];
  const opcionesAlistado = [{ name: "Alistado", code: "ALISTADO" }];
  const opcionesActualizado = [{ name: "Actualizado", code: "ACTUALIZADO" }];
  const opcionesRemision = [{ name: "Solicitud de Remisión", code: "SOLICITUD DE REMISIÓN" } ];
  const opcionesAsignado = [{ name: "Asignado", code: "ASIGNADO" }];

  const delayedRequest = debounce(() => {
    console.log("Fetching personal data");
    ObtenerPersonal(token, cargoId).then((data) => {
      setAuxiliaresPersonales(data);
    }).catch(error => {
      console.error("Error fetching personal:", error);
    });
  }, 500);

  useEffect(() => {
    console.log(rowData.estado);
    if (rowData.estado === "REPORTADO" || rowData.estado === "REMISIONADO") {
      delayedRequest();
    }
  }, [selectedReportadoEstado, rowData.estado, selectRemisionadoEsatado]);

  const handleValidation = async () => {
    const result = await Swal.fire({
      title: `¿Está seguro de cambiar el estado?`,
      html: `<p>Está a punto de cambiar el estado de <strong>${rowData.estado}</strong> a <strong>${selectedEstado.code}</strong> para la solicitud número <strong> # ${rowData.numero_solicitud}</strong>.</p>
             <p>¡Esta acción no se puede deshacer!</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "custom-popup",
        title: "custom-title",
        htmlContainer: "custom-html",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
    });

    if (result.isConfirmed) {
      const res = await actualizarEstadoSolicitud(
        rowData.id_solicitud,
        selectedEstado.code,
        token,
        selectedAuxiliar
      );
      if (res) {
        handleClose();
      }
    }
  };

  const handleReportadoChange = (e) => {
    console.log("Selected Reportado Estado:", JSON.stringify(e.value));
    setSelectedReportadoEstado(e.value);
    setSelectedEstado(e.value);
    if (e.value.code === "EN ALISTAMIENTO") {
      setCargoId(8);
    }
  };

  const handleRemisionadoChange = (e) => {
    console.log("Selected Reportado Estado:", JSON.stringify(e.value));
    setSelectRemisionadoEsatado(e.value);
    setSelectedEstado(e.value);
    if (e.value.code === "ASIGNADO") {
      setCargoId(3);
    }
  };

  const renderSelect = () => {
    switch (rowData.estado) {
      case "REPORTADO":
        return (
          <>
            <Dropdown
              value={selectedReportadoEstado}
              onChange={handleReportadoChange}
              options={estados}
              optionLabel="name"
              placeholder="Seleccione el estado"
              className="w-full md:w-14rem estado-dropdown"
            />
            {selectedReportadoEstado !== null && selectedReportadoEstado.code === "EN ALISTAMIENTO" && (
              <Dropdown
                value={selectedAuxiliar}
                options={auxiliaresPersonales.map((aux) => ({
                  label: aux.nombre_completo,
                  value: aux.nombre_completo,
                }))}
                onChange={(e) => setSelectedAuxiliar(e.value)}
                placeholder="Seleccione al personal"
                className="w-full md:w-14rem personal-dropdown"
              />
            )}
          </>
        );
      case "EN ALISTAMIENTO":
        return (
          <Dropdown
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.value)}
            options={opcionesAlistado}
            optionLabel="name"
            placeholder="Seleccione el estado"
            className="w-full md:w-14rem estado-dropdown"
          />
        );
      case "ALISTADO":
        return (
          <Dropdown
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.value)}
            options={opcionesActualizado}
            optionLabel="name"
            placeholder="Seleccione el estado"
            className="w-full md:w-14rem estado-dropdown"
          />
        );
      case "ACTUALIZADO":
        return (
          <Dropdown
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.value)}
            options={opcionesRemision}
            optionLabel="name"
            placeholder="Seleccione el estado"
            className="w-full md:w-14rem estado-dropdown"
          />
        );
      case "REMISIONADO":
        return (
          <>
          <Dropdown
            value={selectRemisionadoEsatado}
            onChange={handleRemisionadoChange}
            options={opcionesAsignado}
            optionLabel="name"
            placeholder="Seleccione el estado"
            className="w-full md:w-14rem estado-dropdown"
          />
          {selectRemisionadoEsatado !== null && selectRemisionadoEsatado.code === "ASIGNADO" && (
            <Dropdown
              value={selectedAuxiliar}
              options={auxiliaresPersonales.map((aux) => ({
                label: aux.nombre_completo,
                value: aux.nombre_completo,
              }))}
              onChange={(e) => setSelectedAuxiliar(e.value)}
              placeholder="Seleccione al personal"
              className="w-full md:w-14rem personal-dropdown"
            />
          )}
          </>
        );
      case "ASIGNADO":
      case "FINALIZADO":
        return (
          <div>
          <Toast></Toast>
          <CargaArchivos numero_solicitud={ rowData.numero_solicitud} rowData={rowData} handleClose={handleClose}  />
      </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="estado-container">
      {renderSelect()}
      {rowData.estado !== "ASIGNADO" ? <Button
        onClick={handleValidation}
        label="Cambiar de estado"
        className="estado-button p-button-rounded p-button-success"
      />: ""}
    </div>
  );
};

export default Estados;
