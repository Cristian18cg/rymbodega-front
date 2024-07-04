import React, { useState, useEffect, useRef } from "react";
import useControlCarpetaActivo from "../../../../hooks/useControl_Contrato_Activo";
import useControl from "../../../../hooks/useControl";
import Swal from "sweetalert2";
import { Navbar, Container, Nav } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { CargarArchivosSubcarpetas } from "./CargarArchivosSubcarpetas";
import PDFViewer_aux from "../../PDFViewer_aux";
import PDFViewer from "../../PDFViewer";
import { debounce } from "lodash";

export const SubCarpeta = ({
  documento,
  nombrecompleto,
  nombrecarpeta,
  auxiliar,
}) => {
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const columns = [{ field: "nombre_archivo", header: "Nombre del Archivo" }];
  const [NombreCompleto, setNombreCompleto] = useState(nombrecompleto);
  const [Documento, setDocumento] = useState(documento);
  const [visible2, setVisible2] = useState(false);
  const [pdfBase64String, setPdfBase64String] = useState("");
  const { usuario } = useControl();
  const {
    eliminarArchivoSubcarpeta,
    archivosInducciones,
    archivosOtros,
    archivosExamenes,
    archivosActaEntrega,
    archivosNovedades,
    archivosProcesos,
    archivosDotaciones,
    archivosFunciones,
    SubcarpetasArchivos,
    setvisibleCargarArchivosNuevos,
    visibleCargarArchivosNuevos,
  } = useControlCarpetaActivo();
  const delayedRequest = debounce(() => {
    switch (nombrecarpeta) {
      case "inducciones_y_reinducciones":
        if (archivosInducciones[documento]) {
          setBusquedaRealizada(true);
        } else {
          setBusquedaRealizada(false);
        }
        traerArchivos(nombrecarpeta);

        break;
      case "cartas_de_responsabilidad":
        if (archivosActaEntrega[documento]) {
          setBusquedaRealizada(true);
        } else {
          setBusquedaRealizada(false);
        }
        traerArchivos(nombrecarpeta);

        break;
      case "dotaciones_y_epp":
        if (archivosDotaciones[documento]) {
          setBusquedaRealizada(true);
        } else {
          setBusquedaRealizada(false);
        }
        traerArchivos(nombrecarpeta);

        break;

      case "examenes_medicos":
        if (archivosExamenes[documento]) {
          setBusquedaRealizada(true);
        } else {
          setBusquedaRealizada(false);
        }
        traerArchivos(nombrecarpeta);

        break;

      case "novedades":
        if (archivosNovedades[documento]) {
          setBusquedaRealizada(true);
        } else {
          setBusquedaRealizada(false);
        }
        traerArchivos(nombrecarpeta);

        break;

      case "otros":
        if (archivosOtros[documento]) {
          setBusquedaRealizada(true);
        } else {
          setBusquedaRealizada(false);
        }
        traerArchivos(nombrecarpeta);

        break;

      case "procesos_disciplinarios":
        if (archivosProcesos[documento]) {
          setBusquedaRealizada(true);
        } else {
          setBusquedaRealizada(false);
        }
        traerArchivos(nombrecarpeta);
        break;
      case "funciones_perfilcargo":
        if (archivosFunciones[documento]) {
          setBusquedaRealizada(true);
        } else {
          setBusquedaRealizada(false);
        }
        traerArchivos(nombrecarpeta);
        break;

      // Agrega más casos según sea necesario
      default:
        return null; // Devuelve algo por defecto si el valor de vista no coincide con ningún caso
    }
  }, 500);

  useEffect(() => {
    // Llama a la función asincrónica para obtener los datos
    delayedRequest()
  }, [
    archivosInducciones,
    archivosOtros,
    archivosExamenes,
    archivosActaEntrega,
    archivosNovedades,
    archivosProcesos,
    archivosDotaciones,
    archivosFunciones,
    nombrecarpeta,
  ]);
  const clearFilter = (numero) => {
    switch (numero) {
      case 2:
        setGlobalFilter("");
        break;
      default:
        break;
    }
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
  const Eliminararchivo_subcarpeta = async (archivo) => {
    try {
      await eliminarArchivoSubcarpeta(
        archivo.nombre_archivo,
        documento,
        usuario,
        nombrecarpeta
      );
    } catch (error) {
      showError("Ah ocurrido un error al eliminar el archivo: " + error);
    }
  };
  /* Trae los archivos por persona  */
  const traerArchivos = async (nom) => {
    const datos = Documento;

    SubcarpetasArchivos(datos, nom);
  };
  const confirm1 = (archivo_info) => {
    confirmDialog({
      mahmut: "mahmut",
      message: `Estas seguro(a) de querer eliminar este archivo ${usuario}?`,
      header: "Confirmar eliminacion",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => Eliminararchivo_subcarpeta(archivo_info),
      reject,
    });
  };
  const reject = () => {
    showError("Has cancelado el proceso");
  };

  /* Header de datatable */
  const renderHeader = () => {
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
              <span className="p-input-icon-left me-2">
                <i className="pi pi-search"></i>
                <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Filtrar nombre archivo"
                />
              </span>
              <Button
                type="button"
                icon="pi pi-filter-slash"
                label="Limpiar"
                className="btn btn-outline-primary color-icon"
                onClick={() => {
                  clearFilter(2);
                }}
              />
            </div>

            <Nav className="mr-sm-2">
              <div className="d-flex align-items-center">
                <Button
                  icon="pi pi-file-import"
                  iconPos="right"
                  label="Cargar nuevo archivo"
                  outlined
                  className="color-icon "
                  onClick={() => {
                    setvisibleCargarArchivosNuevos(true);
                  }}
                />
              </div>
            </Nav>
          </Navbar.Collapse>
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
          <p>
            No hay archivos de {nombrecarpeta} de {NombreCompleto}
          </p>
        </div>
      </>
    );
  };
  const funcionelegir = () => {
    switch (nombrecarpeta) {
      case "inducciones_y_reinducciones":
        return archivosInducciones[documento];

      case "cartas_de_responsabilidad":
        return archivosActaEntrega[documento];

      case "dotaciones_y_epp":
        return archivosDotaciones[documento];

      case "examenes_medicos":
        return archivosExamenes[documento];

      case "novedades":
        return archivosNovedades[documento];

      case "otros":
        return archivosOtros[documento];

      case "procesos_disciplinarios":
        return archivosProcesos[documento];
      case "funciones_perfilcargo":
        return archivosFunciones[documento];
      default:
        return null; // Devuelve algo por defecto si el valor de vista no coincide con ningún caso
    }
  };
  const onRowSelect = (event) => {
    setPdfBase64String(event.data.contenido_base64);
    setVisible2(true);
  };

  const onRowUnselect = (event) => {
    setVisible2(false);
  };
  return (
    <div className="tabla-2-gestion">
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
              </div>
            ) : (
              <div>
                {pdfBase64String && (
                  <PDFViewer_aux base64String={pdfBase64String} />
                )}
              </div>
            )}
          </Dialog>
          <Dialog
            header={`Cargar nuevo archivo en -> ${nombrecarpeta}`}
            visible={visibleCargarArchivosNuevos}
            onHide={() => {
              setvisibleCargarArchivosNuevos(false);
            }}
            style={{ width: "50vw" }}
          >
            <CargarArchivosSubcarpetas
              documento={documento}
              nombre_carpeta={nombrecarpeta}
            />
          </Dialog>
          <ConfirmDialog />
          {busquedaRealizada ? (
            <DataTable
              selectionMode="single"
              onRowSelect={onRowSelect}
              onRowUnselect={onRowUnselect}
              metaKeySelection={false}
              value={funcionelegir()}
              paginator
              rows={5}
              globalFilter={globalFilter}
              emptyMessage={nohayarchivos}
              rowsPerPageOptions={[10, 25, 50]}
              className="mx-auto "
              header={renderHeader()}
              onGlobalFilter={(e) => setGlobalFilter(e.target.value)}
            >
              {columns.map((column) => (
                <Column
                  key={column.field}
                  field={column.field}
                  header={column.header}
                  sortable
                  style={{ width: "75%" }}
                ></Column>
              ))}
              <Column
                field=""
                header="Eliminar archivo"
                body={(rowData) => (
                  <Button
                    className="button-cancel btn btn-outline-primary"
                    raised
                    onClick={() => confirm1(rowData)}
                    icon="pi pi-trash"
                    label="Eliminar"
                    disabled={auxiliar}
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
