import React, { useState, useEffect, useRef, Children } from "react";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Badge } from "primereact/badge";
import { Column } from "primereact/column";
import { Navbar, Container, Nav } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabMenu } from "primereact/tabmenu";
import { ProgressBar } from "primereact/progressbar";
import useControlCarpetaRetiro from "../../../hooks/useControl_Documentos_Retiro";
import useControl from "../../../hooks/useControl";
import { CargarFaltante } from "./CargarFaltante";
import { ComponenteMenu } from "./ComponenteMenu";
import { Comentarios } from "./Comentarios";
import { debounce } from "lodash";

const ListaDocumentosRetiro = ({ auxiliar }) => {
  const navigate = useNavigate();
  const { usuario } = useControl();
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    setBbusquedaCrearCarpeta,
    registoComentarioValor,
    ListarColabRetiro,
    setcolaboradoresRetiro,
    visibleCargarArchivosRetiro,
    setvisibleCargarArchivosRetiro,
    colaboradoresRetiro,
    setfiltroGlobalRetiro,
    filtroGlobalRetiro,
    vistaretiro,
    setvistaretiro,
    setvisibleComentarios,
    visibleComentarios,
    RegistrosComentariosRetiro,
  } = useControlCarpetaRetiro();
  const [loading, setLoading] = useState(true);
  const [field, setfield] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [descripcion, setDescripcion] = useState();
  const [visible, setVisible] = useState(false);

  const [NombreCompleto, setNombreCompleto] = useState("");
  const [documento, setDocumento] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");

  const delayedRequest = debounce(() => {
    if (colaboradoresRetiro.length === 0) {
      ListarColabRetiro();
    }
    if (registoComentarioValor.length === 0) {
      RegistrosComentariosRetiro();
    }
  }, 500);

  useEffect(() => {
    delayedRequest();
    setBbusquedaCrearCarpeta(true);
  }, []);

  useEffect(() => {
    setGlobalFilter(filtroGlobalRetiro);
  }, [ListarColabRetiro, filtroGlobalRetiro]);
  const load = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const clearFilter = () => {
    setGlobalFilter("");
    setfiltroGlobalRetiro("");
  };
  /* Funcion para imprimir el excel */
  const exportExcel = () => {
    const data = colaboradoresRetiro;

    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);

      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ["data"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "Documentos_Retiro");
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
    setvisibleCargarArchivosRetiro(true);
    setfield(event.field);
  };
  const funcionProgreso = (rowData) => {
    const archivosEstados = [
      rowData.cartaRenuncia_archivo_estado,
      rowData.entregaPuesto_archivo_estado,
      rowData.pazysalvo_archivo_estado,
      rowData.liquidacion_archivo_estado,
      rowData.certificadoLaboraldeRetiro_archivo_estado,
      rowData.certificadoretiroCesantias_archivo_estado,
      rowData.entregaActivos_archivo_estado,
      rowData.examenesMedicosdeEgreso_archivo_estado,
      rowData.entrevistadeRetiro_archivo_estado,
      rowData.aceptacionRenuncia_archivo_estado,
    ];
    const porcentajeIncremento = 10;
    let value = 0;

    archivosEstados.forEach((estado) => {
      if (estado === "A" || estado === "C") {
        value += porcentajeIncremento;
      }
    });

    return parseInt(value);
  };
  /* Header principar */
  const renderHeader = () => {
    return (
      <Navbar
        expand="md"
        variant="dark"
        bg="dark"
        className="p-header-datatable2 bg-black "
      >
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id=" justify-content-end">
            <div className="navbar-nav me-auto mb-2 mb-md-0">
              <Button
                type="button"
                icon="pi pi-folder"
                label="Crear nueva carpeta"
                outlined
                className="btn btn-outline-primary color-icon "
                onClick={() => {
                  navigate("/crear_carpeta_doc_retiro");
                }}
              />
              <Button
                type="button"
                icon="pi pi-filter-slash"
                label="Limpiar"
                outlined
                className="btn btn-outline-primary color-icon mx-1 "
                onClick={() => {
                  clearFilter();
                }}
              />
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Filtrar documento, nombre o apellido"
                />
              </span>
              <h4 className="text-center">
                Documentos Retiro de colaboradores
              </h4>
            </div>

            <Nav className="mr-sm-2">
              <div className="d-flex align-items-center">
                <Button
                  type="button"
                  icon="pi pi-refresh"
                  label="Recargar"
                  outlined
                  className="btn btn-outline-primary color-icon "
                  onClick={() => {
                    ListarColabRetiro();
                  }}
                />
                <Button
                  type="button"
                  icon="pi pi-file-excel"
                  className="color-icon"
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
  const itemRenderer = (item, itemIndex) => (
    <a
      className="p-menuitem-link flex align-items-center a-menu"
      onClick={() => {
        setvistaretiro(itemIndex);
        setActiveIndex(itemIndex);
      }}
    >
      <img
        alt={item.name}
        src={require(`../../../img/gestion_humana/carpeta_activo/${item.image}`)}
        style={{ width: "32px" }}
      />
      <span className="font-bold texto-menu">{item.name}</span>
    </a>
  );
  const items = [
    {
      name: "Archivos generales",
      image: "2.png",
      template: (item) => itemRenderer(item, 0),
    },
    {
      name: "Otros",
      image: "7.png",
      template: (item) => itemRenderer(item, 1),
    },
  ];
  return (
    <div className="">
      {colaboradoresRetiro.length > 0 ? (
        <div className="row">
          <div className="col-md-12 ">
            <Dialog
              className="dialog"
              header={`Documentos de retiro de: ${NombreCompleto}`}
              visible={visible}
              onHide={() => {
                setVisible(false);
              }}
              maximizable
              style={{ width: "90vw", height: "100vw" }}
            >
              <TabMenu
                model={items}
                activeIndex={activeIndex}
                onTabChange={(e) => {
                  setActiveIndex(e.index);
                }}
                className="tab-menu-gestion"
              />
              <ComponenteMenu
                vista={vistaretiro}
                documento={documento}
                NombreCompleto={NombreCompleto}
                auxiliar={auxiliar}
              />
            </Dialog>
            <Dialog
              header={`Cargar documento ${field}  de: ${NombreCompleto}`}
              visible={visibleCargarArchivosRetiro}
              onHide={() => {
                setvisibleCargarArchivosRetiro(false);
              }}
              style={{ width: "50vw" }}
            >
              <CargarFaltante
                usuario={usuario}
                documento={documento}
                nombreCompleto={NombreCompleto}
                field={field}
              />
            </Dialog>
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
                documento={documento}
                Descripcion={descripcion}
                auxiliar={auxiliar}
              />
            </Dialog>
            <DataTable
              rows={10}
              paginator
              rowsPerPageOptions={[10, 20, 50]}
              value={colaboradoresRetiro}
              header={renderHeader()}
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
                    onClick={() => {
                      setNombreCompleto("");
                      setNombreCompleto(
                        `${rowData.nombre_colaborador} ${rowData.apellidos}`
                      );
                      setDocumento(rowData.numero_documento);
                      setVisible(true);
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
                    className="barra-tabla"
                    value={funcionProgreso(rowData)}
                  ></ProgressBar>
                )}
              />

              <Column
                field="cartaRenuncia_archivo_estado"
                header="Renuncia"
                body={(rowData) =>
                  statusBodyTemplate(rowData.cartaRenuncia_archivo_estado)
                }
              />
              <Column
                field="entregaPuesto_archivo_estado"
                header="Entrega de puesto"
                body={(rowData) =>
                  statusBodyTemplate(rowData.entregaPuesto_archivo_estado)
                }
              />
              <Column
                field="pazysalvo_archivo_estado"
                header="Paz y salvo"
                body={(rowData) =>
                  statusBodyTemplate(rowData.pazysalvo_archivo_estado)
                }
              />
              <Column
                field="liquidacion_archivo_estado"
                header="Liquidación"
                body={(rowData) =>
                  statusBodyTemplate(rowData.liquidacion_archivo_estado)
                }
              />
              <Column
                field="certificadoLaboraldeRetiro_archivo_estado"
                header="Certificado laboral "
                body={(rowData) =>
                  statusBodyTemplate(
                    rowData.certificadoLaboraldeRetiro_archivo_estado
                  )
                }
              />
              <Column
                field="certificadoretiroCesantias_archivo_estado"
                header="Retiro cesantias"
                body={(rowData) =>
                  statusBodyTemplate(
                    rowData.certificadoretiroCesantias_archivo_estado
                  )
                }
              />
              <Column
                field="entregaActivos_archivo_estado"
                header="Entrega activos"
                body={(rowData) =>
                  statusBodyTemplate(rowData.entregaActivos_archivo_estado)
                }
              />
              <Column
                field="examenesMedicosdeEgreso_archivo_estado"
                header="Examenes medicos"
                body={(rowData) =>
                  statusBodyTemplate(
                    rowData.examenesMedicosdeEgreso_archivo_estado
                  )
                }
              />
              <Column
                field="entrevistadeRetiro_archivo_estado"
                header="Entrevista retiro"
                body={(rowData) =>
                  statusBodyTemplate(rowData.entrevistadeRetiro_archivo_estado)
                }
              />
              <Column
                field="aceptacionRenuncia_archivo_estado"
                header="Aceptacion Renuncia"
                body={(rowData) =>
                  statusBodyTemplate(rowData.aceptacionRenuncia_archivo_estado)
                }
              />
              <Column
                field="Descripcion"
                header="Comentarios"
                body={(rowData) => (
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
                    {registoComentarioValor.some(
                      (registro) =>
                        registro.numero_documento === rowData.numero_documento
                    ) && (
                      <Badge
                        value={
                          registoComentarioValor.find(
                            (registro) =>
                              registro.numero_documento ===
                              rowData.numero_documento
                          ).total
                        }
                        severity="success"
                      ></Badge>
                    )}
                  </Button>
                )}
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

export default ListaDocumentosRetiro;
