
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { FilterMatchMode } from "primereact/api";
import { ProgressBar } from "primereact/progressbar";
import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { TabMenu } from "primereact/tabmenu";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Badge } from "primereact/badge";
import { Tag } from "primereact/tag";
import { debounce } from "lodash";
import useControl_Compras from "../../../hooks/useControl_Compras";
import useControl from "../../../hooks/useControl";
import CargarArchivosProveedores from "../archivos/CargarArchivosFaltantes";
import TablaArchivosProveedor from "../tablas/TablaArchivosProveedor";
import { Comentarios } from "./Comentarios";
import { ComponenteMenu } from "../tablas/ComponenteMenu";
import { Skeleton } from "primereact/skeleton";
import { Dropdown } from "primereact/dropdown";
import Swal from "sweetalert2";

const ListadoProveedores = () => {
  const navigate = useNavigate();
  const { usuario } = useControl();
  const [activeIndex, setActiveIndex] = useState(0);
  const [registros, setRegistros] = useState([""]);
  const {
    ListadoProveedores,
    listarProveedores,
    filtroGlobalCompras,
    setfiltroGlobalCompras,
    visibleCargarArchivos,
    setvisibleCargarArchivos,
    setvistatabla,
    vistatabla,
    visibleNovedades,
    setvisibleNovedades,
    comentariosActualizacion,
    RegistrosComentarios,
    ActualizarProveedor

  } = useControl_Compras();
  const delayedRequest = debounce(() => {
    if (ListadoProveedores.length === 0) {
      listarProveedores();
    }
    if (comentariosActualizacion.length === 0) {
      RegistrosComentarios();
    }
  }, 500);
  const [documentoProveedor, setDocumentoProveedor] = useState("");
  const [NombreProveedor, setNombreProveedor] = useState("");
  const [selectedCell, setSelectedCell] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [descripcion, setDescripcion] = useState();
  const [visible, setVisible] = useState(false);
  const [field, setfield] = useState(false);
  const [filters, setFilters] = useState({
    tipo_de_proveedor: { value: null, matchMode: FilterMatchMode.IN },
    numero_documento: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre_empresa: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [tipoProveedor] = useState(["productos", "servicios"]);
  const items2 = Array.from({ length: 5 }, (v, i) => i);
  useEffect(() => {
    setRegistros(comentariosActualizacion);
  }, [comentariosActualizacion]);
  useEffect(() => {
    delayedRequest();
    // Llama a la función asincrónica para obtener los datos
  }, []);
  useEffect(() => {
    setGlobalFilter(filtroGlobalCompras);
    // Llama a la función asincrónica para obtener los datos
  }, [ListadoProveedores, filtroGlobalCompras]);
  /* error mensaje */
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
  /* Limpiar filtro*/
  const clearFilter = () => {
    /*  setFilters(null); */ // Puedes establecer el filtro como null para borrarlo
    setfiltroGlobalCompras(""); // // También puedes limpiar el valor del filtro global
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
  /* Tag por casiila de documento convierte P, A, C a el tag con nombres */
  const statusBodyTemplate = (rowData) => {
    const mensaje = rowData;
    return <Tag value={getMensaje(mensaje)} severity={getSeverity(mensaje)} />;
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
      field === "Progreso" ||
      field === "field_14"
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
    setDocumentoProveedor(event.rowData.numero_documento);
    setNombreProveedor(event.rowData.nombre_empresa);
    setvisibleCargarArchivos(true);
    setfield(event.field);
  };
  /* Funcion para imprimir el excel */
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(ListadoProveedores);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "listado_documentos_proveedores");
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
  /* Header principar */
  const renderHeader = () => {
    return (
      <>
        <Navbar
          expand="md"
          data-bs-theme="dark"
          bg="dark"
          className=" bg-black "
        >
          <Container fluid>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <h5 className="mx-md-5 text-center titulonav ">
              Documentación de proveedores
            </h5>
            <Navbar.Collapse id="" className="justify-content-between">
              <div>
                <span className="p-input-icon-left m-2">
                  <i className="pi pi-search" />
                  <InputText
                    className="input-filter-header"
                    value={filtroGlobalCompras}
                    onChange={(e) => setfiltroGlobalCompras(e.target.value)}
                    placeholder="Filtrar documento, nombre o apellido"
                  />
                </span>
                <Button
                  type="button"
                  icon="pi pi-filter-slash"
                  label="Limpiar"
                  outlined
                  className="btn btn-outline-primary color-icon mx-1 "
                  onClick={clearFilter}
                />
              </div>
              <Nav className="mr-sm-2 justify-content-md-end justify-content-xl-end">
                <div className="d-flex align-items-center justify-content-end">
                  <Button
                    type="button"
                    icon="pi pi-user-plus"
                    label="Agregar Proveedor"
                    outlined
                    className="btn btn-outline-primary color-icon d-none d-md-block  d-lg-block"
                    onClick={() => {
                      navigate("/crear_proveedor");
                    }}
                  />
                  <Button
                    type="button"
                    icon="pi pi-file-excel"
                    className="color-icon  d-none d-md-block d-lg-block"
                    outlined
                    onClick={exportExcel}
                    data-pr-tooltip="XLS"
                  />
                  <NavDropdown
                    className=" d-md-none navcompras"
                    id="basic-nav-dropdown"
                    title="Opciones adicionales"
                  >
                    <NavDropdown.Item>
                      <Button
                        type="button"
                        icon="pi pi-user-plus"
                        label="Agregar Proveedor"
                        outlined
                        className="btn btn-outline-primary color-icon "
                        onClick={() => {
                          navigate("/crear_proveedor");
                        }}
                      />
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Button
                        type="button"
                        icon="pi pi-file-excel"
                        className="color-icon"
                        outlined
                        label="Exportar excel"
                        onClick={exportExcel}
                        data-pr-tooltip="XLS"
                      />
                    </NavDropdown.Item>
                  </NavDropdown>
                </div>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  };
  /* Renderizadores de los header */
  const header = renderHeader();

  const funcionProgreso = (rowData) => {
    const archivosEstados = [
      rowData.CamaradeComercio,
      rowData.Rut,
      rowData.CedulaRepresentanteLegal,
      rowData.ReferenciaBancaria,
      rowData.AutoevaluacionEstandares,
      rowData.CertificacionSGSST,
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
  /* Filtro de responsables */
  const responsableRowFilterTemplate = (options) => {
    const opcionestipo = ["productos", "servicios"];
    return (
      <MultiSelect
        value={options.value}
        options={opcionestipo}
        onChange={(e) => {
          options.filterApplyCallback(e.value);
        }}
        placeholder="Selec. tipo proveedor"
        maxSelectedLabels={1}
        style={{ maxWidth: "10rem" }}
      />
    );
  };

  const itemRenderer = (item, itemIndex) => (
    <a
      className="p-menuitem-link flex align-items-center a-menu"
      onClick={() => {
        setvistatabla(itemIndex);
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
    {
      name: "Archivos obsoletos",
      image: "9.png",
      template: (item) => itemRenderer(item, 2),
    },
  ];
  /* Obtener color de tag tipo proveedor */
  const getSeverity2 = (value) => {
    switch (value) {
      case "servicios":
        return "Warning";

      case "productos":
        return "success";

      default:
        return null;
    }
  };
  /* Tag por casiila de tipo proveedor*/
  const statusBodyTemplate2 = (rowData) => {
    return <Tag value={rowData} severity={getSeverity2(rowData)} />;
  };
  /* Enviar edicion de usuario */
  const onRowEditComplete = (e) => {
    let { newData, index } = e;
    const proveedor = ListadoProveedores.find(proveedor => proveedor.numero_documento === newData.numero_documento);
    if(JSON.stringify(proveedor) === JSON.stringify(newData)){
      showError('No se cambio ningún campo')
    }else{
      ActualizarProveedor(newData, usuario)
      setfiltroGlobalCompras(newData.numero_documento)
    }
  /*   ActualizarInfoColaboradores(newData,usuario);
    setGlobalFilter(newData.numero_documento) */
  };
/* EDITOR CAMBIOS DE TEXTO */
  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => {
          const inputValue = e.target.value
          options.editorCallback(inputValue);
        }}
                    
      />
    );
  };
  
  const estadosProveedor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={tipoProveedor}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Seleccione un estado"
        itemTemplate={(option) => {
          return (
            <Tag value={option} severity={getSeverity2(option)}></Tag>
          );
        }}
        
      />
    );
  };

  return (
    <div className="tabla-2-gestion">
      {ListadoProveedores.length > 0 ? (
        <div className="row">
          <div className="col-md-12 ">
            {/* tabla de documentos */}
            <Dialog
              className="dialog"
              header={`archivos de: ${NombreProveedor}`}
              visible={visible}
              onHide={() => setVisible(false)}
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
                vista={vistatabla}
                usuario={usuario}
                documentoProveedor={documentoProveedor}
                NombreProveedor={NombreProveedor}
              />
            </Dialog>
            {/* Cargar archivos faltantes */}
            <Dialog
              maximizable
              header={`Cargar documento ${field} de: ${NombreProveedor}`}
              visible={visibleCargarArchivos}
              onHide={() => {
                setvisibleCargarArchivos(false);
              }}
              style={{ width: "50vw" }}
            >
              <CargarArchivosProveedores
                documento={documentoProveedor}
                field={field}
                usuario={usuario}
                NombreProveedor={NombreProveedor}
                numero_carpeta={0}
              />
            </Dialog>
            <Dialog
              maximizable
              header={`Actualizar novedades de ${NombreProveedor}`}
              visible={visibleNovedades}
              onHide={() => {
                setvisibleNovedades(false);
              }}
              style={{ width: "50vw" }}
            >
              <Comentarios
                documento={documentoProveedor}
                Descripcion={descripcion}
              />
            </Dialog>
            <DataTable
              className="tabla-compras"
              rows={10}
              paginator
              rowsPerPageOptions={[10, 20, 50]}
              value={ListadoProveedores}
              header={header}
              isDataSelectable={isCellSelectable}
              cellSelection
              selectionMode="single"
              selection={selectedCell}
              onCellSelect={onCellSelect}
              sortable
              globalFilter={globalFilter}
              emptyMessage="No se encontraron proveedores"
              scrollable
              tableStyle={{ minWidth: "50rem" }}
              filters={filters}
              filterDisplay="row"
              globalFilterFields={[
                "tipo_de_proveedor",
                "numero_documento",
                "nombre_empresa",
              ]}
              editMode="row"
              onRowEditComplete={onRowEditComplete}

            >
              <Column
                field=""
                header="Archivos"
                body={(rowData) => (
                  <Button
                    className="button-gestion"
                    raised
                    outlined
                    onClick={async () => {
                      setNombreProveedor(rowData?.nombre_empresa);
                      setVisible(true);
                      setDocumentoProveedor(rowData?.numero_documento);
                    }}
                    icon="pi pi-folder-open"
                  ></Button>
                )}
              />
              <Column
                style={{ minWidth: "12rem" }}
                sortable
                field="numero_documento"
                header="Numero de identificación"
                filter
                filterPlaceholder="Buscar por número"
                body={(rowData) => rowData.numero_documento}
              />  
              <Column
                style={{ minWidth: "12rem" }}
                sortable
                filter
                editor={(options) => textEditor(options)}
                filterPlaceholder="Buscar por nombre"
                field="nombre_empresa"
                header="Nombre del proveedor"
                body={(rowData) => {
                  return `${rowData.nombre_empresa}`;
                }}
              />
              <Column
                style={{ maxWidth: "10rem" }}
                sortable
                field="tipo_de_proveedor"
                header="Tipo"
                body={(rowData) =>
                  statusBodyTemplate2(rowData.tipo_de_proveedor)
                }
                filterField="tipo_de_proveedor"
                showFilterMenu={false}
                filterMenuStyle={{ minWidth: "10rem" }}
                filter
                filterElement={responsableRowFilterTemplate}
                editor={(options) => estadosProveedor(options)}
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
                field="CamaradeComercio"
                header="Camara de comercio"
                body={(rowData) => statusBodyTemplate(rowData.CamaradeComercio)}
              />
              <Column
                field="Rut"
                header="Rut"
                body={(rowData) => statusBodyTemplate(rowData.Rut)}
              />
              <Column
                field="CedulaRepresentanteLegal"
                header="CC representante legal"
                body={(rowData) =>
                  statusBodyTemplate(rowData.CedulaRepresentanteLegal)
                }
              />
              <Column
                field="ReferenciaBancaria"
                header="Referencia Bancaria"
                body={(rowData) =>
                  statusBodyTemplate(rowData.ReferenciaBancaria)
                }
              />
              <Column
                field="AutoevaluacionEstandares"
                header="Autoevaluación Estandares"
                body={(rowData) =>
                  statusBodyTemplate(rowData.AutoevaluacionEstandares)
                }
              />
              <Column
                field="CertificacionSGSST"
                header="Certificado SG-SST"
                body={(rowData) =>
                  statusBodyTemplate(rowData.CertificacionSGSST)
                }
              />
              <Column
                field="CartaAsignacionResponsableSGSST"
                header="Carta asignacion res SG-SST"
                body={(rowData) =>
                  statusBodyTemplate(rowData.CartaAsignacionResponsableSGSST)
                }
              />
              <Column
                field="LicenciaSST"
                header="Licencia SST"
                body={(rowData) => statusBodyTemplate(rowData.LicenciaSST)}
              />
              <Column
                field="Descripcion"
                header="Novedades"
                body={(rowData) => (
                  <Button
                    icon="pi pi-book"
                    raised
                    outlined
                    className="button-gestion"
                    onClick={() => {
                      setvisibleNovedades(true);
                      setNombreProveedor(`${rowData.nombre_empresa}`);
                      setDescripcion(rowData.descripcion_novedades);
                      setDocumentoProveedor(rowData.numero_documento);
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
                )}
              />
               <Column
                header="Editar proveedor"
                rowEditor={true}
                headerStyle={{ width: "10%", minWidth: "8rem" }}
                bodyStyle={{ textAlign: "center" }}
              ></Column>
            </DataTable>
          </div>
        </div>
      ) : (
        /* Skeleton mientras cargan los archivos */
        <div className="d-flex aling-items-center ">
           <div className="row">
          <div className="col-md-12 ">
          <DataTable
            scrollable
            header={renderHeader}
            value={items2}
            className="tabla-compras"
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              header="Archivos"
              body={() => (
                <Button
                  disabled={true}
                  className="button-gestion"
                  outlined
                  icon="pi pi-folder-open"
                ></Button>
              )}
            />
            <Column header="Numero de identificación" body={<Skeleton />} />
            <Column header="Nombre del proveedor" body={<Skeleton />} />
            <Column header="Tipo" body={<Skeleton />} />
            <Column header="Progreso" body={<Skeleton />} />
            <Column header="Camara de comercio" body={<Skeleton />} />
            <Column header="Rut" body={<Skeleton />} />
            <Column header="CC representante legal" body={<Skeleton />} />
            <Column header="Referencia Bancaria" body={<Skeleton />} />
            <Column header="Autoevaluación Estandares" body={<Skeleton />} />
            <Column header="Certificado SG-SST" body={<Skeleton />} />
            <Column header="Carta asignacion res SG-SST" body={<Skeleton />} />
            <Column header="Licencia SST" body={<Skeleton />} />
            <Column
              header="Novedades"
              body={() => (
                <Button
                  disabled
                  icon="pi pi-book"
                  raised
                  outlined
                  className="button-gestion"
                ></Button>
              )}
            />
          </DataTable>
        </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default ListadoProveedores;
