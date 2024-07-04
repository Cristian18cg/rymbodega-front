import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import Swal from "sweetalert2";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import PDFViewer from "../PDFViewer";
import { TablaOtrosArchivosIngreso } from "./TablaOtrosArchivosIngreso";
import { ProgressSpinner } from "primereact/progressspinner";
import useControl_DocumentosIngreso from "../../../hooks/useControl_DocumentosIngreso";
import PDFViewer_aux from "../PDFViewer_aux";
import { debounce } from "lodash";
export const TablaDocumentosIngreso = ({
  documento,
  usuario,
  NombreCompleto,
  auxiliar,
}) => {
  const {
    BuscarArchivos,
    archivosIngreso,

    aprobarArchivo,
    eliminarArchivo,
  } = useControl_DocumentosIngreso();
  const [visible4, setVisible4] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [pdfBase64String, setPdfBase64String] = useState("");
  const [loading, setLoading] = useState(false);
  const [globalFilter2, setGlobalFilter2] = useState("");
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const columns = [{ field: "nombre_archivo", header: "Nombre del Archivo" }];

  const delayedRequest = debounce(() => {
    if (archivosIngreso[documento]) {
      setBusquedaRealizada(true);
    }
    traerArchivos(); // Envía la solicitud al servidor aquí
  }, 500);

  useEffect(() => {
    delayedRequest();
  }, [archivosIngreso]);

  /* Limpiar filtro */
  const clearFilter2 = () => {
    setGlobalFilter2("");
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

  const load = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const traerArchivos = async () => {
    if (archivosIngreso[documento] || documento === undefined) {
    } else {
      BuscarArchivos(documento);
    }
  };
  const onRowSelect = (event) => {
    setPdfBase64String(event.data.contenido_base64);
    setVisible2(true);
  };

  const onRowUnselect = () => {
    setVisible2(false);
  };
  const aceptar_archivo = async (archivo, documento) => {
    const user = usuario;
    aprobarArchivo(archivo.nombre_archivo, documento, user);
  };

  /* Funcion eliminar archivos */
  const Eliminar_archivo = async (archivo, documento) => {
    const user = usuario;
    eliminarArchivo(
      archivo.nombre_archivo,
      archivo.ruta_completa,
      documento,
      user,
      archivo
    );
  };

  /* Mensaje de cancelar proceso eliminar o aprobar archivo */
  const reject = () => {
    showError("Has cancelado el proceso.");
  };
  const handlePrevisualizarArchivo = async (contenidoBase64) => {
    try {
      setPdfBase64String(contenidoBase64);
      setVisible2(true);
    } catch (error) {
      showError("Error al cargar la previsualización del archivo.");
      console.error("Error al cargar la previsualización:", error);
    }
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
  /* Funcion confirmar aprobar archivo */
  const confirm2 = (archivo_info, documento) => {
    confirmDialog({
      mahmut: "mahmut",
      message: `Estas seguro(a) de querer aprobar este archivo ${archivo_info.nombre_archivo} ${usuario} ?`,
      header: "Aprobar archivo",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      accept: () => aceptar_archivo(archivo_info, documento),
      reject,
    });
  };

  /* HEader de archivos por usuario */
  const renderHeader2 = (archi) => {
    return (
      <Navbar
        expand="md"
        variant="dark"
        bg="dark"
        className="p-header-datatable2 bg-black"
      >
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id=" justify-content-end">
            <div className="navbar-nav me-auto mb-2 mb-md-0">
              <Button
                loading={loading}
                type="button"
                label="Otros archivos"
                className="btn btn-outline-primary color-icon"
                onClick={() => {
                  load();
                  /* buscarOtrosarchivos(); */
                  setVisible4(true);
                }}
              />
            </div>
            <Nav className="mr-sm-2">
              <div className="d-flex align-items-center">
                <span className="p-input-icon-left me-2">
                  <i className="pi pi-search"></i>
                  <InputText
                    value={globalFilter2}
                    onChange={(e) => setGlobalFilter2(e.target.value)}
                    placeholder="Filtrar nombre archivo"
                  />
                </span>
                <Button
                  type="button"
                  icon="pi pi-filter-slash"
                  label="Limpiar"
                  className="btn btn-outline-primary color-icon"
                  onClick={clearFilter2}
                />
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };
  return (
    <div className="tabla-2-gestion  ">
      <div className="p-datatable-responsive-scroll ">
        <div className="col-md-12 ">
          <ConfirmDialog className="" />
          {/* Dialog otros docume */}
          <Dialog
            visible={visible4}
            onHide={() => setVisible4(false)}
            maximizable
            style={{ width: "90vw", height: "90vw" }}
            header={`Otros archivos de ${NombreCompleto}`}
          >
            <TablaOtrosArchivosIngreso
              documento={documento}
              usuario={usuario}
              NombreCompleto={NombreCompleto}
              auxiliar={auxiliar}
            />
          </Dialog>
          {busquedaRealizada ? (
            <DataTable
              selectionMode="single"
              onRowSelect={onRowSelect}
              onRowUnselect={onRowUnselect}
              metaKeySelection={false}
              value={archivosIngreso[documento]}
              paginator
              rows={5}
              globalFilter={globalFilter2}
              emptyMessage="No se encontraron archivos"
              rowsPerPageOptions={[10, 25, 50]}
              className="mx-auto "
              header={renderHeader2(archivosIngreso[documento])}
              onGlobalFilter={(e) => setGlobalFilter2(e.target.value)}
            >
              {columns.map((column) => (
                <Column
                  key={column.field}
                  field={column.field}
                  header={column.header}
                  sortable
                  style={{ width: "60%" }}
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
                    disabled={auxiliar}
                  ></Button>
                )}
              ></Column>
              <Column
                field=""
                header="Aceptar archivo"
                body={(rowData) => (
                  <Button
                    className="button-succes btn btn-outline-primary"
                    raised
                    onClick={() => confirm2(rowData, documento)}
                    icon="pi pi-check"
                    label="Aceptar"
                    disabled={rowData.estado === "A" || auxiliar}
                  ></Button>
                )}
              ></Column>

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
                        handlePrevisualizarArchivo(rowData.contenido_base64);
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
