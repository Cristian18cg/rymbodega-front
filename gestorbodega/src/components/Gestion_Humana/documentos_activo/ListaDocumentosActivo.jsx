import React, { useState, useEffect } from "react";
import useControlCarpetaActivo from "../../../hooks/useControl_Contrato_Activo";
import useControl from "../../../hooks/useControl";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Badge } from "primereact/badge";
import { Column } from "primereact/column";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";
import { CargarFaltante } from "./CargarFaltante";
import { TabMenu } from "primereact/tabmenu";
import { ComponenteMenu } from "./ComponenteMenu";
import { ProgressBar } from "primereact/progressbar";
import { Comentarios } from "./Comentarios";
import { debounce } from "lodash";
const ListaDocumentosActivo = ({ auxiliar }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const { usuario } = useControl();
  const {
    registoComentarioValor,
    setvisibleComentarios,
    visibleComentarios,
    vista,
    setVista,
    colaboradoresActivo,
    errorColabActivo,
    ListarColabActivo,
    setfiltroGlobal,
    filtroGlobal,
    visibleCargarArchivos,
    setVisibleCargarArchivos,
    RegistrosComentariosActivo,
  } = useControlCarpetaActivo();
  const [activeIndex, setActiveIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [documento, setDocumento] = useState("");
  const [NombreCompleto, setNombreCompleto] = useState("");
  const [visible, setVisible] = useState(false);

  const [descripcion, setDescripcion] = useState();
  const [field, setfield] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  // useEffect para ejecutar ListaDocumentosActivo al montar el componente o cuando ListarColabActivo cambie
  const delayedRequest = debounce(() => {
    if (colaboradoresActivo.length === 0) {
    // Envía la solicitud al servidor aquí
      ListarColabActivo();
    }
  }, 500);
  useEffect(() => {
    delayedRequest();
  }, []);
  const delayedRequest2 = debounce(() => {
    RegistrosComentariosActivo();
  }, 500);

  useEffect(() => {
    delayedRequest2()
   
  }, []);
  // useEffect para establecer el filtro global cuando filtroGlobal cambie
  useEffect(() => {
    setGlobalFilter(filtroGlobal);
  }, [ListarColabActivo, filtroGlobal]);

  const load = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const clearFilter = (numero) => {
    switch (numero) {
      case 1:
        setGlobalFilter("");
        setfiltroGlobal("");
        break;
      default:
        break;
    }
  };

  /* Funcion para imprimir el excel */
  const exportExcel = () => {
    const data = colaboradoresActivo;

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

      saveAsExcelFile(excelBuffer, "Documentos_Activo");
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
    setVisibleCargarArchivos(true);
    setfield(event.field);
  };

  const itemRenderer = (item, itemIndex) => (
    <a
      className="p-menuitem-link flex align-items-center a-menu"
      onClick={() => {
        setVista(itemIndex);
        setActiveIndex(itemIndex);
      }}
    >
      <img
        alt={item.name}
        src={require(`../../../img/gestion_humana/carpeta_activo/${item.image}`)}
        style={{ width: "30px" }}
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
      name: "Inducciones",
      image: "1.png",
      template: (item) => itemRenderer(item, 1),
    },
    {
      name: "Dotacion y EPP",
      image: "3.png",
      template: (item) => itemRenderer(item, 2),
    },
    {
      name: "Procesos disciplinarios",
      image: "6.png",
      template: (item) => itemRenderer(item, 3),
    },
    {
      name: "Cartas de responsabilidad",
      image: "5.png",
      template: (item) => itemRenderer(item, 4),
    },
    {
      name: "Novedades",
      image: "8.png",
      template: (item) => itemRenderer(item, 5),
    },
    {
      name: "Examenes Medicos",
      image: "4.png",
      template: (item) => itemRenderer(item, 6),
    },
    {
      name: "Funciones",
      image: "9.png",
      template: (item) => itemRenderer(item, 7),
    },
    {
      name: "Otros",
      image: "7.png",
      template: (item) => itemRenderer(item, 8),
    },
  ];

  const funcionProgreso = (rowData) => {
    const archivosEstados = [
      rowData.acuerdoconfidencialidad_archivo_estado,
      rowData.contratodetrabajo_archivo_estado,
      rowData.ccf_archivo_estado,
      rowData.arl_archivo_estado,
      rowData.eps_archivo_estado,
      rowData.autorizacionmanejodatos_archivo_estado,
    ];
    const porcentajeIncremento = 16.7;
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
        className="p-header-datatable2 bg-black"
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
                  navigate("/crear_carpeta_contrato_activo");
                }}
              />
              <Button
                type="button"
                icon="pi pi-filter-slash"
                label="Limpiar"
                outlined
                className="btn btn-outline-primary color-icon mx-1 "
                onClick={() => {
                  clearFilter(1);
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
              <h4 className="text-center ">
                Documentos Activo de colaboradores
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
                    ListarColabActivo();
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
  const header = renderHeader();
  return (
    <div className="tabla-2-gestion">
      {colaboradoresActivo.length > 0 ? (
        <div className="row">
          <div className="col-md-12 ">
            {/* Dialog componente de ver archivos y subarchivos */}
            <Dialog
              className="dialog"
              header={`Documentos colaborador activo  de: ${NombreCompleto}`}
              visible={visible}
              onHide={() => {
                setActiveIndex(0);
                setVista(0);
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
                vista={vista}
                documento={documento}
                NombreCompleto={NombreCompleto}
                auxiliar={auxiliar}
              />
            </Dialog>
            {/* Cargar faltante  */}
            <Dialog
              header={`Cargar documento ${field}  de: ${NombreCompleto}`}
              visible={visibleCargarArchivos}
              onHide={() => {
                setVisibleCargarArchivos(false);
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
            {/* Comentarios del colaborador  */}
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
              value={colaboradoresActivo}
              header={header}
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
                field="eps_archivo_estado"
                header="EPS"
                body={(rowData) =>
                  statusBodyTemplate(rowData.eps_archivo_estado)
                }
              />
              <Column
                field="arl_archivo"
                header="ARL"
                body={(rowData) =>
                  statusBodyTemplate(rowData.arl_archivo_estado)
                }
              />
              <Column
                field="ccf_archivo"
                header="CCF"
                body={(rowData) =>
                  statusBodyTemplate(rowData.ccf_archivo_estado)
                }
              />
              <Column
                field="contratodetrabajo_archivo_estado"
                header="Contrato"
                body={(rowData) =>
                  statusBodyTemplate(rowData.contratodetrabajo_archivo_estado)
                }
              />
              <Column
                field="autorizacionmanejodatos_archivo_estado"
                header="Autorizacion de datos"
                body={(rowData) =>
                  statusBodyTemplate(
                    rowData.autorizacionmanejodatos_archivo_estado
                  )
                }
              />
              <Column
                field="acuerdoconfidencialidad_archivo"
                header="Acuerdo de confidencialidad"
                body={(rowData) =>
                  statusBodyTemplate(
                    rowData.acuerdoconfidencialidad_archivo_estado
                  )
                }
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
                field="inducciones_num_archivos"
                header="# Archivos Inducciones"
                body={(rowData) => rowData.inducciones_num_archivos}
              />
              <Column
                field="dotacion_num_archivos"
                header="# Archivos dotaciones"
                body={(rowData) => rowData.dotacion_num_archivos}
              />
              <Column
                field="procesosdiciplinarios_num_archivos"
                header="# Archivos procesos disciplinarios"
                body={(rowData) => rowData.procesosdiciplinarios_num_archivos}
              />
              <Column
                field="cartaresponsabilidad_num_archivos"
                header="# Archivos cartas de respon"
                body={(rowData) => rowData.cartaresponsabilidad_num_archivos}
              />
              <Column
                field="novedades_num_archivos"
                header="# Archivos  novedades"
                body={(rowData) => rowData.novedades_num_archivos}
              />
              <Column
                field="examenesmedicos_num_archivos"
                header="# Archivos examenes medicos"
                body={(rowData) => rowData.examenesmedicos_num_archivos}
              />
              <Column
                field="funciones_num_archivos"
                header="# Archivos funciones"
                body={(rowData) => rowData.funciones_num_archivos}
              />
              <Column
                field="otro_num_archivos"
                header="# Archivos otros"
                body={(rowData) => rowData.otro_num_archivos}
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

export default ListaDocumentosActivo;
