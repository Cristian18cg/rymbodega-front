import React, { useState, useEffect, useRef } from "react";
import useControlCarpetaActivo from "../../../hooks/useControl_Contrato_Activo";
import useControl from "../../../hooks/useControl";
import Swal from "sweetalert2";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Navbar, Container, Nav } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import PDFViewer from "../PDFViewer";
import { ProgressSpinner } from "primereact/progressspinner";
import PDFViewer_aux from "../PDFViewer_aux";
import { debounce } from "lodash";
export const TablaDocumentosActivo = ({
  documento,
  nombrecompleto,
  auxiliar,
}) => {
  const {
    archivosActivo,
    BuscarArchivosActivo,
    setarchivosActivo,
    aprobarArchivoActivo,
    respuestaAprobar,
    setfiltroGlobal,
    eliminarArchivoActivo,
  } = useControlCarpetaActivo();
  const { usuario } = useControl();
  const [visible2, setVisible2] = useState(false);
  const [Documento, setDocumento] = useState(documento);
  const [NombreCompleto, setNombreCompleto] = useState(nombrecompleto);
  const [archivosEncontrados, setArchivosEncontrados] = useState([]);
  const [globalFilter2, setGlobalFilter2] = useState("");
  const [pdfBase64String, setPdfBase64String] = useState("");
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const columns = [{ field: "nombre_archivo", header: "Nombre del Archivo" }];

  const delayedRequest = debounce(() => {
    if (archivosActivo[documento]) {
      setBusquedaRealizada(true);
    }
    traerArchivos(); // Envía la solicitud al servidor aquí
  }, 500);
  useEffect(() => {
    // Llama a la función asincrónica para obtener los datos
    delayedRequest();
  }, [archivosActivo]);

  
  /* Toast de mensajes exitosos */
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
  /* confirmar eliminar archivo */
  const confirm1 = (archivo_info, documento) => {
    confirmDialog({
      mahmut: "mahmut",
      message: `Estas seguro(a) de querer eliminar este archivo ${usuario}?`,
      header: "Confirmar eliminacion",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => Elimiar_archivo(archivo_info, documento),
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
      accept: () => aceptar_archvio(archivo_info, documento),
      reject,
    });
  };
  /* Mensaje de cancelar proceso eliminar o aprobar archivo */

  const reject = () => {
    showError("Has cancelado el proceso");
  };
  /* Funcion eliminar archivos */
  const Elimiar_archivo = async (archivo, documento) => {
    const user = usuario;
    await eliminarArchivoActivo(
      archivo.nombre_archivo,
      archivo.ruta_completa,
      documento,
      user
    );
  };
  /* Funcion para aceptar archivos */
  const aceptar_archvio = async (archivo, documento) => {
    try {
      const user = usuario;
      await aprobarArchivoActivo(archivo.nombre_archivo, documento, user);
      if (
        respuestaAprobar === "" ||
        respuestaAprobar !== null ||
        respuestaAprobar !== undefined
      ) {
        BuscarArchivosActivo(documento, true);
        showSuccess(
          `Has aprobado este archivo ${user} -> archivo: ${archivo.nombre_archivo}`
        );
      }
    } catch (error) {
      showError(error);
    }
  };
  /* Trae los archivos por persona  */
  const traerArchivos = async () => {
    const datos = Documento;

    if (archivosActivo[datos] || datos === undefined) {
    } else {
      await BuscarArchivosActivo(datos);
    }
  };
  /* header de archivos por usuario */
  const renderHeader = () => {
    return (
      <Navbar variant="dark" bg="dark" className="p-header-datatable2 bg-black">
        <Container fluid>
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
                onClick={() => {
                  setGlobalFilter2("");
                }}
              />
            </div>
          </Nav>
        </Container>
      </Navbar>
    );
  };
  const nohayarchivos = () => {
    return (
      <>
        <div className="d-flex align-items-center flex-column">
          <i
            className="pi pi-folder-open  p-3"
            style={{
              fontSize: "5em",
              borderRadius: "50%",
              backgroundColor: "var(--surface-b)",
              color: "var(--surface-d)",
            }}
          ></i>
          <p>No hay archivos de {NombreCompleto}</p>
        </div>
      </>
    );
  };
  const onRowSelect = (event) => {
    setPdfBase64String(event.data.contenido_base64);
    setVisible2(true);
  };

  const onRowUnselect = (event) => {
    setVisible2(false);
  };
  return (
    <div className="tabla-2-gestion tabla-fondo ">
      <div className="p-datatable-responsive-scroll aling-items-center">
        <div className="col-md-12 ">
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
                {pdfBase64String && (
                  <PDFViewer_aux base64String={pdfBase64String} />
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
          <ConfirmDialog />
          {busquedaRealizada ? (
            <DataTable
              selectionMode="single"
              onRowSelect={onRowSelect}
              onRowUnselect={onRowUnselect}
              metaKeySelection={false}
              value={archivosActivo[documento]}
              paginator
              rows={5}
              globalFilter={globalFilter2}
              emptyMessage={nohayarchivos}
              rowsPerPageOptions={[10, 25, 50]}
              className="mx-auto "
              header={renderHeader(archivosEncontrados[documento])}
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
