import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { ActualizarDescripcion } from "../../../actions/Gestion_Humana/archivos";
import useControl_DocumentosIngreso from "../../../hooks/useControl_DocumentosIngreso";
import { ProgressSpinner } from "primereact/progressspinner";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import "primeicons/primeicons.css";
import useControl from "../../../hooks/useControl";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { ProgressBar } from "primereact/progressbar";
import { TablaDocumentosIngreso } from "./TablaDocumentosIngreso";
import CargarArchivosIngreso from "./CargarArchivosIngreso";
import Comentarios from "./Comentarios";
import { debounce } from "lodash";

const ListaColaboradores = ({auxiliar}) => {
  const navigate = useNavigate();
  const {
    filtoGlobalIngreso,
    setfiltoGlobalIngreso,
    ListaColaboradores,
    setListaColaboradores,
    ListarColab,
    visibleComentarios,
    setvisibleComentarios,
    visibleCargarArchivos,
    setvisibleCargarArchivos,
    badgeComentarios,
    setbadgeComentarios,
    RegistrosComentarios,
    setvisibleCargar,visibleCargar
  } = useControl_DocumentosIngreso();
  const [globalFilter, setGlobalFilter] = useState("");

  const [data, setData] = useState([ListaColaboradores]);
  const [registros, setRegistros] = useState([""]);
  const [visible, setVisible] = useState(false);
  const [descripcion, setDescripcion] = useState(" ");
  const [activarBoton, setactivarBoton] = useState(true);
  const [field, setfield] = useState(false);

  const { usuario } = useControl();
  const [selectedCell, setSelectedCell] = useState(null);
  const [documento, setDocumento] = useState("");
  const [NombreCompleto, setNombreCompleto] = useState("");
  const location = useLocation();

  const delayedRequest = debounce(() => {
    if (ListaColaboradores.length === 0) {
      ListarColab();
    }
    RegistrosComentarios()
  }, 500)

  /* Inicia la pagina al cargar y reinicia filtros */
  useEffect(() => {
    delayedRequest()
  // Llama a la función asincrónica para obtener los datos
  }, []);

  useEffect(() => {
    setGlobalFilter(filtoGlobalIngreso);
  }, [ListaColaboradores, filtoGlobalIngreso]);

  useEffect(() => {
    setRegistros(badgeComentarios);
  }, [badgeComentarios]);
  /* Limpiar filtro*/
  const clearFilter = () => {
    /*  setFilters(null); */ // Puedes establecer el filtro como null para borrarlo
    setfiltoGlobalIngreso(""); // // También puedes limpiar el valor del filtro global
  };

  /* Funcion que valida si se puede seleccionar una casilla solo se puede la 'P' */
  const isCellSelectable = (event) => {
    const field = event.data.field;
    const row = event.data.rowData;
    const value = event.data.value;
    if (
      (value !== "P" && value !== undefined) ||
      field === "field_0" ||
      field === "Descripcion" ||
      field === "Progreso"
    ) {
      return false;
    } else {
      for (let clave in row) {
        if (clave.includes(field) && row[clave] !== "P") {
          return false;
        }
      }
      return true;
    }
  };
  /* Evento de casilla seleccionada */
  const onCellSelect = (event) => {
    setDocumento(event.rowData.numero_documento);
    setNombreCompleto(
      `${event.rowData.nombre_colaborador} ${event.rowData.apellidos}`
    );
    setvisibleCargarArchivos(true);
    setfield(event.field);
  };

  /* Obtener color de tag segun su valor  */
  const getSeverity = (value) => {
    switch (value) {
      case "C":
        return "info";

      case "P":
        return "danger";

      case "A":
        return "success";
      default:
        return null;
    }
  };
  /* Obtener que tipo de tag es segun su valor  */
  const getMensaje = (value) => {
    switch (value) {
      case "C":
        return "Cargado";

      case "P":
        return "Pendiente";

      case "A":
        return "Aprobado";
      default:
        return null;
    }
  };
  /* Funcion para imprimir el excel */
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(ListaColaboradores);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "Documentos_ingreso");
    });
  };
  /* guarda el excel */
  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };
  /* Tag por casiila de documento convierte P, A, C a el tag con nombres */
  const statusBodyTemplate = (rowData) => {
    const mensaje = rowData;
    return <Tag value={getMensaje(mensaje)} severity={getSeverity(mensaje)} />;
  };

  /* Header principar */
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
              <Button
                type="button"
                icon="pi pi-user-plus"
                label="Agregar colaborador"
                outlined
                className="btn btn-outline-primary color-icon "
                onClick={() => {
                  navigate("/agregar_documento");
                }}
              />
              <Button
                type="button"
                icon="pi pi-filter-slash"
                label="Limpiar"
                outlined
                className="btn btn-outline-primary color-icon mx-1 "
                onClick={clearFilter}
              />
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  value={filtoGlobalIngreso}
                  onChange={(e) => setfiltoGlobalIngreso(e.target.value)}
                  placeholder="Filtrar documento, nombre o apellido"
                />
              </span>
              <h4 className="text-center ">
                Documentos ingreso de colaboradores
              </h4>
            </div>

            <Nav className="mr-sm-2">
              <div className="d-flex align-items-center">
                <Button
                  type="button"
                  icon="pi pi-file-excel"
                  className=" btn btn-outline-primary color-icon color-icon"
                  outlined
                  rounded
                  onClick={exportExcel}
                  data-pr-tooltip="XLS"
                />
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };
  /* Renderizadores de los header */
  const header = renderHeader();

  const funcionProgreso = (rowData) => {
    const archivosEstados = [
      rowData.cedula_archivo_estado,
      rowData.hojadevida_archivo_estado,
      rowData.afp_archivo_estado,
      rowData.eps_archivo_estado,
      rowData.certificacioneslaborales_archivo_estado,
      rowData.certificadocuenta_archivo_estado,
      rowData.antecedentesjudiciales_archivo_estado,
      rowData.certificacionesdeestudio_archivo_estado,
      rowData.pruebaconocimiento_archivo_estado,
      rowData.pruebapsicotecnicas_archivo_estado,
      rowData.examenmedico_archivo_estado,
      rowData.poligrafo_archivo_estado,
      rowData.actaentrega_archivo_estado,
    ];
    const porcentajeIncremento = 7.7;
    let value = 0;

    archivosEstados.forEach((estado) => {
      if (estado === "A" || estado === "C") {
        value += porcentajeIncremento;
      }
    });

    return parseInt(value);
  };

  return (
    <div className="tabla-2-gestion">
      {ListaColaboradores.length > 0 ? (
        <div className="row">
          <div className="col-md-12 ">
            {/* Dialog de descripcion */}
            <Dialog
              header={`Descripcion de: ${NombreCompleto}`}
              visible={visibleComentarios}
              onHide={() => {
                setvisibleComentarios(false);
              }}
              maximizable
              style={{ width: "50vw" }}
            >
              <Comentarios
                descripcion={descripcion}
                documento={documento}
                usuario={usuario}
                auxiliar={auxiliar}
              />
            </Dialog>
            {/* Dialog para cargar archivos faltantes */}
            <Dialog
              header={`Cargar documento ${field}  de: ${NombreCompleto}`}
              visible={visibleCargarArchivos}
              onHide={() => {
                setvisibleCargarArchivos(false);
              }}
              style={{ width: "50vw" }}
            >
              <CargarArchivosIngreso
                documento={documento}
                field={field}
                usuario={usuario}
              />
            </Dialog>
            {/* Dialog tabla documentos ingreso */}
            <Dialog
              className="dialog"
              header={`Documentos ingreso de: ${NombreCompleto}`}
              visible={visible}
              onHide={() => setVisible(false)}
              maximizable
              style={{ width: "90vw", height: "100vw" }}
            >
              <TablaDocumentosIngreso
                documento={documento}
                usuario={usuario}
                NombreCompleto={NombreCompleto}
                auxiliar = {auxiliar}
              />
            </Dialog>
            <DataTable
              rows={10}
              paginator
              rowsPerPageOptions={[10, 20, 50]}
              value={ListaColaboradores}
              header={header}
              sortable
              globalFilter={globalFilter}
              emptyMessage="No se encontraron archivos"
              scrollable
              tableStyle={{ minWidth: "50rem" }}
              isDataSelectable={isCellSelectable}
              cellSelection
              selectionMode="single"
              selection={selectedCell}
              onCellSelect={onCellSelect}
              removableSort
              onSelectionChange={(e) => {
                setSelectedCell(e.value);
              }}
            >
              <Column
                field="numero_documento"
                header=" ver archivos"
                body={(rowData) => (
                  <Button
                    className="button-gestion"
                    raised
                    outlined
                    onClick={async () => {
                      setNombreCompleto("");
                      setNombreCompleto(
                        `${rowData.nombre_colaborador} ${rowData.apellidos}`
                      );

                      setVisible(true);
                      setDocumento(rowData.numero_documento);
                    }}
                    icon="pi pi-folder-open"
                  ></Button>
                )}
              />
              <Column
                sortable
                field="numero_documento"
                header="Numero Documento"
                body={(rowData) => rowData.numero_documento}
              />
              <Column
                style={{ minWidth: "15rem" }}
                sortable
                field="nombre_colaborador"
                header="Nombre Completo"
                body={(rowData) => {
                  return `${rowData.nombre_colaborador} ${rowData.apellidos}`;
                }}
              />
              <Column
                field="Progreso"
                header="Progreso"
                body={(rowData) => (
                  <ProgressBar
                    className="barra-tabla barra-tabla2"
                    value={funcionProgreso(rowData)}
                  ></ProgressBar>
                )}
              />
              <Column
                field="cedula_archivo"
                header="Cedula"
                body={(rowData) =>
                  statusBodyTemplate(rowData.cedula_archivo_estado)
                }
              />
              <Column
                field="hojadevida_archivo"
                header="Hoja de Vida"
                body={(rowData) =>
                  statusBodyTemplate(rowData.hojadevida_archivo_estado)
                }
              />
              <Column
                field="afp_archivo"
                header="AFP"
                body={(rowData) =>
                  statusBodyTemplate(rowData.afp_archivo_estado)
                }
              />
              <Column
                field="eps_archivo"
                header="EPS"
                body={(rowData) =>
                  statusBodyTemplate(rowData.eps_archivo_estado)
                }
              />
              <Column
                field="certificacioneslaborales_archivo_"
                header="Certificaciones Laborales"
                body={(rowData) =>
                  statusBodyTemplate(
                    rowData.certificacioneslaborales_archivo_estado
                  )
                }
              />
              <Column
                field="certificadocuenta_archivo"
                header="Certificado de Cuenta"
                body={(rowData) =>
                  statusBodyTemplate(rowData.certificadocuenta_archivo_estado)
                }
              />
              <Column
                field="antecedentesjudiciales_archivo"
                header="Antecedentes Judiciales"
                body={(rowData) =>
                  statusBodyTemplate(
                    rowData.antecedentesjudiciales_archivo_estado
                  )
                }
              />
              <Column
                field="certificacionesdeestudio_archivo"
                header="Certificaciones de Estudio"
                body={(rowData) =>
                  statusBodyTemplate(
                    rowData.certificacionesdeestudio_archivo_estado
                  )
                }
              />
              <Column
                field="pruebaconocimiento_archivo"
                header="Prueba de Conocimiento"
                body={(rowData) =>
                  statusBodyTemplate(rowData.pruebaconocimiento_archivo_estado)
                }
              />
              <Column
                field="pruebapsicotecnicas_archivo"
                header="Prueba Psicotécnica"
                body={(rowData) =>
                  statusBodyTemplate(rowData.pruebapsicotecnicas_archivo_estado)
                }
              />
              <Column
                field="examenmedico_archivo"
                header="Examen Médico"
                body={(rowData) =>
                  statusBodyTemplate(rowData.examenmedico_archivo_estado)
                }
              />
              <Column
                field="actaentrega_archivo"
                header="Acta de entrega"
                body={(rowData) =>
                  statusBodyTemplate(rowData.actaentrega_archivo_estado)
                }
              />
              <Column
                field="poligrafo_archivo"
                header="Poligrafo"
                body={(rowData) =>
                  statusBodyTemplate(rowData.poligrafo_archivo_estado)
                }
              />
              <Column
                field="Descripcion"
                header="Novedades"
                body={
                  (rowData) => (
                    <Button
                      icon="pi pi-book"
                      className="button-gestion"
                      onClick={() => {
                        setvisibleComentarios(true);
                        setNombreCompleto(`${rowData.nombre_colaborador}`);
                        setDescripcion(rowData.descripcion_novedades);
                        setDocumento(rowData.numero_documento);
                      }}
                    >
                      {/* Lógica para mostrar el Badge con el valor de 'total' del registro correspondiente */}
                      {registros.some(
                        (registro) =>
                          registro.numero_documento === rowData.numero_documento
                      ) && (
                        <Badge
                          value={
                            registros.find(
                              (registro) =>
                                registro.numero_documento ===
                                rowData.numero_documento
                            ).total
                          }
                          severity="success"
                        ></Badge>
                      )}
                    </Button>
                  )
                }
              />
            </DataTable>
          </div>
        </div>
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
  );
};
export default ListaColaboradores;
