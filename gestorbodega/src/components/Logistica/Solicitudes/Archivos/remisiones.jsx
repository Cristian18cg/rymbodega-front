import React, { useState, useEffect } from "react";
import useContextVentas from "../../../../hooks/useControlVentas";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import PDFViewer from "../../../Gestion_Humana/PDFViewer";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import useControl from "../../../../hooks/useControl";
import { debounce } from "lodash";
import Swal from "sweetalert2";

const Remisiones = ({ solicitud, archivosRemisiones, handleCloseArchivos }) => {
  const { actualizarEstadoSolicitud, documentosRemisiones, ObtenerPersonal } =
    useContextVentas();
  const { token } = useControl();
  const [documentos, setdocumentos] = useState(documentosRemisiones);
  const [pdfBase64String, setPdfBase64String] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectRemisionadoEsatado, setSelectRemisionadoEsatado] =
    useState(null);
  const opcionesAsignado = [{ name: "Asignado", code: "ASIGNADO" }];
  const [selectedAuxiliar, setSelectedAuxiliar] = useState(null);
  const [auxiliaresPersonales, setAuxiliaresPersonales] = useState([]);
  const [cargoId, setCargoId] = useState(
    solicitud.estado === "REPORTADO" ? 8 : 3
  );
  const [selectedEstado, setSelectedEstado] = useState(null);

  const delayedRequest = debounce(() => {
    console.log("Fetching personal data");
    ObtenerPersonal(token, cargoId)
      .then((data) => {
        setAuxiliaresPersonales(data);
      })
      .catch((error) => {
        console.error("Error fetching personal:", error);
      });
  }, 500);

  useEffect(() => {
    console.log(solicitud.estado);
    if (solicitud.estado === "REMISIONADO") {
      delayedRequest();
    }
  }, [solicitud.estado, selectRemisionadoEsatado]);

  const handlePrevisualizarArchivo = async (contenidoBase64, rowData) => {
    try {
      setPdfBase64String(contenidoBase64);
      setShowPdfModal(true);
    } catch (error) {
      console.error("Error al cargar la previsualización:", error);
    }
  };
  const handleclosePdf = async () => {
    setShowPdfModal(false);
    setPdfBase64String("");
  };

  const header = (
    <div className="d-flex justify-content-center mr-3">
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            className="buscar"
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="   Buscar..."
          />
        </span>
      </div>
    </div>
  );

  const handleReportadoChange = (e) => {
    console.log("Selected Reportado Estado:", JSON.stringify(e.value));
  };

  const handleRemisionadoChange = (e) => {
    console.log("Selected Reportado Estado:", JSON.stringify(e.value));
    setSelectRemisionadoEsatado(e.value);
    setSelectedEstado(e.value);
    if (e.value.code === "ASIGNADO") {
      setCargoId(3);
    }
  };

  const handleValidation = async () => {
    const result = await Swal.fire({
      title: `¿Está seguro de cambiar el estado?`,
      html: `<p>Está a punto de cambiar el estado de <strong>${solicitud.estado}</strong> a <strong>${selectedEstado.code}</strong> para la solicitud número <strong> # ${solicitud.numero_solicitud}</strong>.</p>
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
        solicitud.id_solicitud,
        selectedEstado.code,
        token,
        selectedAuxiliar
      );
      if (res) {
        handleCloseArchivos();
      }
    }
  };

  return (
      <div className="tabla-2-gestion">
        <div className="p-datatable-responsive-scroll ">
          <div className="col-md-12 ">
            <Dialog
              header={`Solicitud # ${solicitud.numero_solicitud}`} 
              visible={archivosRemisiones}
              onHide={handleCloseArchivos}
              style={{ width: "50vw" }}
              className="custom-dialog"
            >
              <div className="card flex justify-content-center dialog-content">
              <DataTable
                size="small"
                header={header}
                globalFilter={globalFilter}
                value={documentos}
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column field="nombre" header="Nombre del archivo"></Column>
                <Column
                  header=""
                  body={(rowData) => (
                      <Button
                        outlined
                        icon={
                          rowData.ruta_completa === null
                            ? "pi pi-eye-slash "
                            : "pi pi-eye "
                        }
                        style={{
                          fontSize: "1.2rem",
                          maxWidth: "2.5rem",
                          maxHeight: "2.5rem",
                        }}
                        className={"p-secondary"}
                        onClick={() => {
                          handlePrevisualizarArchivo(
                            rowData.contenido_base64,
                            rowData
                          );
                        }}
                        disabled={rowData.ruta_completa === null}
                      />
                  )}
                ></Column>
              </DataTable>
              </div>
              {solicitud.estado === "REMISIONADO" ? (
                  <>
                    <h5 className="text-center">
                      Seleccione el nuevo estado para la solicitud{" "}
                      {solicitud.numero_solicitud} ↓{" "}
                    </h5>
                  <Dropdown
                    value={selectRemisionadoEsatado}
                    onChange={handleRemisionadoChange}
                    options={opcionesAsignado}
                    optionLabel="name"
                    placeholder="Seleccione el estado"
                    className="w-full md:w-14rem estado-dropdown"
                  />
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
                    <Button
                      onClick={handleValidation}
                      label="Cambiar de estado"
                      className="estado-button p-button-rounded p-button-success"
                    />
                  </>
                ): ""}
            </Dialog>
            <Dialog
              visible={showPdfModal && true}
              onHide={handleclosePdf}
              style={{ width: "95vw", height: "100vw" }}
              maximizable
            >
              {pdfBase64String && <PDFViewer base64String={pdfBase64String} />}
            </Dialog>
          </div>
        </div>
      </div>
  );
};

export default Remisiones;
