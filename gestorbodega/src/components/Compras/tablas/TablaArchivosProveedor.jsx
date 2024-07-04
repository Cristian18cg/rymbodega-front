import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Navbar, Container, Nav } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { debounce } from "lodash";
import PDFViewer from "../../Gestion_Humana/PDFViewer";
import Swal from "sweetalert2";
import ActualizarArchivos from "../archivos/ActualizarArchivos";
/* import { TablaOtrosArchivosIngreso } from "./TablaOtrosArchivosIngreso"; */
import useControl_Compras from "../../../hooks/useControl_Compras";
import CargarArchivosFaltantes from "../archivos/CargarArchivosFaltantes";
const TablaArchivosProveedor = ({
  documento,
  usuario,
  NombreProveedor,
  numeroCarpeta,
}) => {
  const {
    BuscarArchivos,
    archivosProveedor,
    archivosOtros,
    archivosObsoletos,
    eliminarArchivo,
    visibleActualizarArchivos,
    setvisibleActualizarArchivos,
    visibleCargarOtros,
    setvisibleCargarOtros,
  } = useControl_Compras();
  const columns = [
    { field: "nombre_archivo", header: "Nombre del Archivo" },
    { field: "fecha", header: "Fecha de subida" },
  ];
  const [field, setfield] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [pdfBase64String, setPdfBase64String] = useState("");
  const [globalFilter2, setGlobalFilter2] = useState("");
  const [visible2, setVisible2] = useState(false);
  const delayedRequest = debounce(() => {
    switch (numeroCarpeta) {
      case 0:
        if (archivosProveedor[documento]) {
          setBusquedaRealizada(true);
        } else {
          setBusquedaRealizada(false);

          BuscarArchivos(documento, NombreProveedor, numeroCarpeta);
        }
        break;
      case 1:
        if (archivosOtros[documento]) {
          setBusquedaRealizada(true);
        } else {
          setBusquedaRealizada(false);

          BuscarArchivos(documento, NombreProveedor, numeroCarpeta);
        }
        break;
      case 2:
        if (archivosObsoletos[documento]) {
          setBusquedaRealizada(true);
        } else {
          setBusquedaRealizada(false);
          BuscarArchivos(documento, NombreProveedor, numeroCarpeta);
        }
        break;
    }
  }, 500);

  useEffect(() => {
    delayedRequest();
  }, [archivosProveedor, archivosObsoletos, archivosOtros, numeroCarpeta]);
  useEffect(() => {
    setBusquedaRealizada(false);
  }, [numeroCarpeta]);
  /* Limpiar filtro */
  const clearFilter2 = () => {
    setGlobalFilter2("");
  };
  /* toast de error */
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
  /* Permite previsualizar los arhivos al seleccionar la fila */
  const onRowSelect = (event) => {
    setPdfBase64String(event.data.contenido_base64);
    setVisible2(true);
  };
  /* Salir de la fila */
  const onRowUnselect = () => {
    setVisible2(false);
  };
  /* Funcion eliminar archivos */
  const Eliminar_archivo = async (archivo, documento) => {
    const user = usuario;
    eliminarArchivo(
      archivo.nombre_archivo,
      archivo.ruta_completa,
      documento,
      user,
      archivo,
      numeroCarpeta
    );
  };
  /* confirmar eliminar archivo */
  const confirm1 = (archivo_info, documento) => {
    confirmDialog({
      mahmut: "mahmut",
      message: `Estas seguro(a) de querer eliminar este archivo ${usuario}?`,
      header: "Confirmar eliminacion",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => Eliminar_archivo(archivo_info, documento),
      reject,
    });
  };
  /* Mensaje de cancelar proceso eliminar o aprobar archivo */
  const reject = () => {
    showError("Has cancelado el proceso.");
  };
  /* Header de archivos por usuario */
  const renderHeader2 = () => {
    return (
      <>
        <div className="d-flex align-items-center">
          <span className="p-input-icon-left m-2">
            <i className="pi pi-search"></i>
            <InputText
              className="input-filter-header"
              value={globalFilter2}
              onChange={(e) => setGlobalFilter2(e.target.value)}
              placeholder="Filtrar nombre archivo"
            />
          </span>
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Limpiar"
            outlined
            className="color-icon"
            onClick={clearFilter2}
          />
          {numeroCarpeta === 1 && (
            <Button
              type="button"
              icon="pi pi-file-arrow-up"
              label="Subir archivo"
              outlined
              className="color-icon"
              onClick={() => {
                setvisibleCargarOtros(true);
              }}
            />
          )}
        </div>
      </>
    );
  };

  const funcionelegirarchivos = () => {
    switch (numeroCarpeta) {
      case 0:
        return archivosProveedor[documento];
      case 1:
        return archivosOtros[documento];
      case 2:
        return archivosObsoletos[documento];
    }
  };
  return (
    <div className="tabla-2-gestion  ">
      <div className="p-datatable-responsive-scroll ">
        <div className="col-md-12 ">
          <ConfirmDialog className="" />
          <Dialog
            header="Actualizar Archivo"
            visible={visibleActualizarArchivos}
            onHide={() => setvisibleActualizarArchivos(false)}
            style={{ width: "30rem", height: "18rem" }}
            maximizable
          >
            <ActualizarArchivos
              field={field}
              documento={documento}
              usuario={usuario}
              NombreProveedor={NombreProveedor}
            />
          </Dialog>
          <Dialog
            header="Subir archivo a carpeta 'otros'"
            visible={visibleCargarOtros}
            onHide={() => setvisibleCargarOtros(false)}
            style={{ width: "30rem", height: "18rem" }}
            maximizable
          >
            <CargarArchivosFaltantes
              documento={documento}
              usuario={usuario}
              NombreProveedor={NombreProveedor}
              numero_carpeta={1}
            />
          </Dialog>
          {/* Dialog previsualizar archivos  */}
          <Dialog
            onHide={() => setVisible2(false)}
            style={{ width: "95vw", height: "100vw" }}
            maximizable
            visible={visible2}
          >
            <div>
              {pdfBase64String && <PDFViewer base64String={pdfBase64String} />}
            </div>
          </Dialog>
          {busquedaRealizada ? (
            <DataTable
              selectionMode="single"
              onRowSelect={onRowSelect}
              onRowUnselect={onRowUnselect}
              metaKeySelection={false}
              value={funcionelegirarchivos()}
              paginator
              rows={10}
              globalFilter={globalFilter2}
              emptyMessage="No se encontraron archivos"
              rowsPerPageOptions={[10, 25, 50]}
              className="mx-auto "
              header={renderHeader2()}
              onGlobalFilter={(e) => setGlobalFilter2(e.target.value)}
            >
              {columns.map((column) => (
                <Column
                  key={column.field}
                  field={column.field}
                  header={column.header}
                  sortable
                ></Column>
              ))}
              <Column
                field=""
                header="Eliminar archivo"
                body={(rowData) => (
                  <Button
                    className="button-cancel btn btn-outline-primary"
                    raised
                    onClick={() => confirm1(rowData, documento)}
                    icon="pi pi-trash"
                    label="Eliminar"
                  ></Button>
                )}
              ></Column>
              {numeroCarpeta === 0 && (
                <Column
                  field=""
                  header="Actualizar archivo"
                  body={(rowData) => (
                    <Button
                      className="button-actualizar btn btn-outline-primary"
                      raised
                      icon="pi pi-undo"
                      label="Actualizar"
                      onClick={() => {
                        setvisibleActualizarArchivos(true);
                        setfield(rowData);
                      }}
                    ></Button>
                  )}
                ></Column>
              )}

              <Column
                header="Previsualizar"
                body={(rowData) => (
                  <>
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
                      className={"p-secondary button-previsualizar"}
                      onClick={() => {
                        setPdfBase64String(rowData.contenido_base64);
                        setVisible2(true);
                      }}
                      disabled={rowData.ruta_completa === null}
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
        </div>
      </div>
    </div>
  );
};

export default TablaArchivosProveedor;
