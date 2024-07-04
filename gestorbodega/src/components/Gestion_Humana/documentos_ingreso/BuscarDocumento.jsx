import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";

import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { descargarArchivo } from "../../../actions/Gestion_Humana/archivos";
import { Toast } from "primereact/toast";
import PDFViewer from "../PDFViewer";
import { Dialog } from "primereact/dialog";
import "primeicons/primeicons.css";
import Swal from "sweetalert2";
import { Navbar, Container, Nav } from "react-bootstrap";
import useControl_DocumentosIngreso from "../../../hooks/useControl_DocumentosIngreso";
const Buscar = () => {
  const { BuscarArchivos, archivosIngreso, OtrosArchivos } =
    useControl_DocumentosIngreso();
  const [nombreDocumento, setNombreDocumento] = useState("");
  const [archivosEncontrados, setArchivosEncontrados] = useState([]);
  const [otros_archivosEncontrados, setotrosArchivosEncontrados] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(""); // Define globalFilter
  const [globalFilter2, setGlobalFilter2] = useState(""); // Define globalFilter
  const [usuario, setUsuario] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false); //visible el dialog
  const [visible2, setVisible2] = useState(false); //visible el dialog
  const [busquedaRealizada, setBusquedaRealizada] = useState(true);
  const toast = useRef(null);
  const columns = [{ field: "nombre_archivo", header: "Nombre del Archivo" }];
  const [pdfBase64String, setPdfBase64String] = useState("");

  const initFilters = () => {
    // Define la estructura de los filtros
    return {
      global: { value: null, matchMode: "contains" },
      // ... otros filtros ...
    };
  };
  useEffect(() => {
    // Inicializa los filtros cuando se monta el componente
    initFilters();
  }, []);
  
  useEffect(() => {
    // Inicializa los filtros cuando se monta el componente
    setArchivosEncontrados(archivosIngreso);
  }, [archivosIngreso]);
  const load = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const clearFilter = () => {
    /*  setFilters(null); */ // Puedes establecer el filtro como null para borrarlo
    setGlobalFilter(""); // // También puedes limpiar el valor del filtro global
  };
  const clearFilter2 = () => {
    /*  setFilters(null); */ // Puedes establecer el filtro como null para borrarlo
    setGlobalFilter2(""); // // También puedes limpiar el valor del filtro global
  };

  const buscarOtrosarchivos = async () => {
    try {
      const archivosEncontrados = await OtrosArchivos(nombreDocumento);

      setotrosArchivosEncontrados(archivosEncontrados.archivos_encontrados);

      setUsuario(archivosEncontrados.usuario.nombre_colaborador);
      showSuccess(`Busqueda exitosa de:  ${usuario}`);
      setVisible2(true);
    } catch (error) {
      showError(
        "Ah ocurrido un error al buscar la carpeta otros archivos: " +
          error.response.data.error
      );
    }
  };
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

  const handleBuscarArchivos = async (nombreDocumento) => {
    if (!nombreDocumento.trim()) {
      showError("Por favor, completa el campo obligatorio.");
      return;
    }
    BuscarArchivos(nombreDocumento);
    setBusquedaRealizada(false);
  };

  const handleDescargarArchivo = async (nombreArchivo, enlace) => {
    try {
      await descargarArchivo(nombreArchivo, enlace);
      showSuccess(`Ya ha iniciado su descarga de ${nombreArchivo}`);
    } catch (error) {
      showError(
        "Ah ocurrido un error al descargar carpeta:" + error.response.data.error
      );
      console.error("Error aldescargar archivos:", error);
    }
  };

  const handlePrevisualizarArchivo = async (contenidoBase64) => {
    try {
      setPdfBase64String(contenidoBase64);
      setVisible(true);
    } catch (error) {
      showError("Error al cargar la previsualización del archivo.");
      console.error("Error al cargar la previsualización:", error);
    }
  };

  const renderHeader = () => {
    return (
      <Navbar
        expand="md"
        variant="dark"
        bg="dark"
        className="p-header-datatable2 bg-black"
      >
        <Container fluid>
          <Navbar.Brand href="#">
            <Button
              type="button"
              icon="pi pi-arrow-left"
              label="Volver"
              className="btn btn-outline-primary color-icon me-md-2 mb-2 mb-md-0"
              onClick={() => setBusquedaRealizada(true)}
            />
          </Navbar.Brand>
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
                  buscarOtrosarchivos();
                }}
              />
              <h5 className="text-center my-2 mx-4   align-items-center ">
                Archivos ingreso de :{" "}
                {archivosIngreso.usuario.nombre_colaborador}
              </h5>
            </div>
            <Nav className="mr-sm-2">
              <div className="d-flex align-items-center">
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
                  onClick={clearFilter}
                />
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };

  const renderHeader2 = () => {
    return (
      <div className="d-flex align-items-center p-header-datatable2 ">
        <span className="p-input-icon-left ">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter2}
            onChange={(e) => setGlobalFilter2(e.target.value)}
            placeholder="Filtrar nombre archivo"
          />
        </span>
        <Button
          type="button"
          icon="pi pi-filter-slash "
          label="Limpiar"
          className="btn btn-outline-primary color-icon mx-1"
          outlined
          onClick={clearFilter2}
        />
      </div>
    );
  };

  const header = renderHeader();
  const header2 = renderHeader2();
  return (
    <div className="tabla-2-gestion ">
      <Toast ref={toast} position="top-left" />
      {busquedaRealizada ? (
        <div className="row mt-5">
          <div className="col-md-8 offset-md-3 mx-auto">
            <div className="card text-center">
              <div className="card-body">
                <h2 className="font-weight-bold mb-4">
                  BUSCAR DOCUMENTOS INGRESO EMPLEADO
                </h2>
                <div className="form-group">
                  <span className="p-input-icon-left ">
                    <i className="pi pi-search" />
                    <InputText
                      className="ancho"
                      placeholder="Buscar"
                      inputid="nombreDocumento"
                      value={nombreDocumento}
                      onChange={(e) => setNombreDocumento(e.target.value)}
                      tooltip="Ingresa la cedula que vas a buscar"
                      required
                    />
                  </span>

                  <div className="text-center mt-3">
                    <Button
                      loading={loading}
                      outlined
                      label="Buscar carpeta"
                      className="button-gestion"
                      onClick={(e) => {
                        e.preventDefault();
                        handleBuscarArchivos(nombreDocumento);
                        load();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" tabla-2-gestion">
          <div className="col-md-12">
            <Dialog
              visible={visible2}
              onHide={() => setVisible2(false)}
              maximizable
              style={{ width: "90vw", height: "90vw" }}
              header={`Otros archivos de: ${usuario}`}
            >
              <DataTable
                scrollable
                value={otros_archivosEncontrados}
                paginator
                rows={5}
                globalFilter={globalFilter2}
                emptyMessage="No se encontraron archivos"
                rowsPerPageOptions={[10, 25, 50]}
                header={header2}
                onGlobalFilter={(e) => setGlobalFilter2(e.target.value)}
              >
                {columns.map((column) => (
                  <Column
                    key={column.field}
                    field={column.field}
                    header={column.header}
                    sortable
                    style={{ width: "95%" }}
                  ></Column>
                ))}

                <Column
                  field="nombre_archivo"
                  header="Descargar"
                  body={(rowData) => (
                    <Button
                      className="button-gestion"
                      outlined
                      label="Descargar"
                      onClick={() => {
                        handleDescargarArchivo(
                          rowData.nombre_archivo,
                          rowData.enlace_descarga
                        );
                      }}
                      raised
                      rounded
                    />
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
                          handlePrevisualizarArchivo(rowData.contenido_base64);
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
            </Dialog>
            <DataTable
              value={archivosEncontrados}
              paginator
              rows={5}
              globalFilter={globalFilter}
              emptyMessage="No se encontraron archivos"
              rowsPerPageOptions={[10, 25, 50]}
              header={header}
              onGlobalFilter={(e) => setGlobalFilter(e.target.value)}
            >
              {columns.map((column) => (
                <Column
                  key={column.field}
                  field={column.field}
                  header={column.header}
                  sortable
                  style={{ width: "95%" }}
                ></Column>
              ))}

              <Column
                field="nombre_archivo"
                header="Descargar"
                body={(rowData) => (
                  <Button
                    className="button-gestion"
                    outlined
                    label="Descargar"
                    onClick={() => {
                      handleDescargarArchivo(
                        rowData.nombre_archivo,
                        rowData.enlace_descarga
                      );
                    }}
                    raised
                    rounded
                  />
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
                        handlePrevisualizarArchivo(rowData.contenido_base64);
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
            <Dialog
              header="Previsualizacion"
              maximizable
              visible={visible}
              style={{ width: "96vw" }}
              onHide={() => setVisible(false)}
            >
              <div>
                {pdfBase64String && (
                  <PDFViewer base64String={pdfBase64String} />
                )}
              </div>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buscar;
