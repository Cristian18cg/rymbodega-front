import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import Swal from "sweetalert2";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import PDFViewer from "../PDFViewer";
import PDFViewer_aux from "../PDFViewer_aux";
import { CargarOtrosArchivos } from "./CargarOtrosArchivos";
import { ProgressSpinner } from "primereact/progressspinner";
import useControl_DocumentosIngreso from "../../../hooks/useControl_DocumentosIngreso";
import { debounce } from "lodash";

export const TablaOtrosArchivosIngreso = ({
  documento,
  usuario,
  NombreCompleto,
  auxiliar,
}) => {
  const [globalFilter3, setGlobalFilter3] = useState("");
  const [visible2, setVisible2] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const [pdfBase64String, setPdfBase64String] = useState("");
  const columns = [{ field: "nombre_archivo", header: "Nombre del Archivo" }];
  const [otros_archivosEncontrados, setotrosArchivosEncontrados] = useState([]);
  const {
    otrosarchivosIngreso,
    eliminarotroArchivo,
    OtrosArchivos,
    visibleCargarOtrosArchivos,
    setvisibleCargarOtrosArchivos,
  } = useControl_DocumentosIngreso();
  const delayedRequest = debounce(() => {
    if (otrosarchivosIngreso[documento]) {
      setBusquedaRealizada(true);
    } else {
      buscarOtrosarchivos();
    }// Envía la solicitud al servidor aquí
  }, 500);

  useEffect(() => {
    delayedRequest()
  }, [otrosarchivosIngreso]);
  /* Limpiar filtro */
  const clearFilter3 = () => {
    /*  setFilters(null); */ // Puedes establecer el filtro como null para borrarlo
    setGlobalFilter3(""); // // También puedes limpiar el valor del filtro global
  };

  /* Toast de mensajes fallidos */
  const showError = (error) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
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
  /* Mensaje de cancelar proceso eliminar o aprobar archivo */
  const reject = () => {
    showError("Has cancelado el proceso");
  };
  const Eliminar_otro_archivo = async (archivo) => {
    eliminarotroArchivo(archivo.nombre_archivo, documento, usuario, archivo);
  };
  const confirm3 = (archivo_info) => {
    confirmDialog({
      mahmut: "mahmut",
      message: `Estas seguro(a) de querer eliminar este archivo ${usuario}?`,
      header: "Confirmar eliminacion",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => Eliminar_otro_archivo(archivo_info),
      reject,
    });
  };
  /* Buscar otros archivos por colaborador */
  const buscarOtrosarchivos = async () => {
    if (otrosarchivosIngreso[documento] || documento === undefined) {
    } else {
      OtrosArchivos(documento, NombreCompleto);
    }
  };
  /* HEADER DE OTROS ARCHIVOS */
  const renderHeader3 = () => {
    return (
      <div className="d-flex align-items-center p-header-datatable2 ">
        <span className="p-input-icon-left ">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter3}
            onChange={(e) => setGlobalFilter3(e.target.value)}
            placeholder="Filtrar nombre archivo"
          />
        </span>
        <Button
          type="button"
          icon="pi pi-filter-slash "
          label="Limpiar"
          className="btn btn-outline-primary color-icon mx-1"
          outlined
          onClick={clearFilter3}
        />
        <Button
          type="button"
          icon="pi pi-file"
          label="Cargar nuevo archivo"
          className="btn btn-outline-primary color-icon mx-1"
          onClick={() => {
            setvisibleCargarOtrosArchivos(true);
          }}
          outlined
        />
      </div>
    );
  };
  const onRowSelect = (event) => {
    setPdfBase64String(event.data.contenido_base64);
    setVisible2(true);
  };

  const onRowUnselect = () => {
    setVisible2(false);
  };
  return (
    <div className="tabla-2-gestion">
      <div className="p-datatable-responsive-scroll ">
        <div className="col-md-12 ">
          {/* Dialog cargar en carpeta otros */}
          <Dialog
            header={`Cargar en otro documento `}
            visible={visibleCargarOtrosArchivos}
            onHide={() => {
              setvisibleCargarOtrosArchivos(false);
            }}
            style={{ width: "50vw" }}
          >
            <CargarOtrosArchivos usuario={usuario} documento={documento} />
          </Dialog>
          {busquedaRealizada ? (
            <DataTable
              selectionMode="single"
              onRowSelect={onRowSelect}
              onRowUnselect={onRowUnselect}
              metaKeySelection={false}
              value={otrosarchivosIngreso[documento]}
              paginator
              rows={5}
              globalFilter={globalFilter3}
              emptyMessage="No se encontraron archivos"
              rowsPerPageOptions={[10, 25, 50]}
              header={renderHeader3()}
              onGlobalFilter={(e) => setGlobalFilter3(e.target.value)}
            >
              {columns.map((column) => (
                <Column
                  key={column.field}
                  field={column.field}
                  header={column.header}
                  sortable
                  style={{ width: "70%" }}
                ></Column>
              ))}
              <Column
                field=""
                header="Eliminar archivo"
                body={(rowData) => (
                  <Button
                    className="button-cancel btn btn-outline-primary"
                    raised
                    onClick={() => confirm3(rowData)}
                    icon="pi pi-trash"
                    label="Eliminar"
                    disabled={auxiliar}
                  ></Button>
                )}
              ></Column>
              <Column
                body={(rowData) => (
                  <>
                    <Button
                      outlined
                      icon={
                        rowData.ruta_completa === null ||
                        !rowData.ruta_completa.endsWith(".pdf")
                          ? "pi pi-eye-slash "
                          : "pi pi-eye "
                      }
                      style={{
                        fontSize: "1.2rem",
                        maxWidth: "2.5rem",
                        maxHeight: "2.5rem",
                      }}
                      className={"p-secondary button-previsualizar"}
                      onClick={() => {
                        setPdfBase64String(rowData.contenido_base64);
                        setVisible2(true);
                      }}
                      disabled={
                        rowData.ruta_completa === null ||
                        !rowData.ruta_completa.endsWith(".pdf")
                      }
                    />
                  </>
                )}
              ></Column>
            </DataTable>
          ) : (
            <div className="d-flex aling-items-center ">
              {" "}
              <ProgressSpinner
                className="spinner"
                fill="var(--surface-ground)"
                strokeWidth="8"
              />
            </div>
          )}
          <Dialog
            visible={visible2}
            onHide={() => setVisible2(false)}
            style={{ width: "95vw", height: "100vw" }}
            maximizable
          >
            {!auxiliar ? (
              <div>
                {pdfBase64String && (
                  <PDFViewer base64String={pdfBase64String} />
                )}
              </div>
            ) : (
              <div>
                {pdfBase64String && (
                  <PDFViewer_aux base64String={pdfBase64String} />
                )}
              </div>
            )}
          </Dialog>
        </div>
      </div>
    </div>
  );
};
