import React, { useState, useEffect } from "react";
import useContextVentas from "../../hooks/useControlVentas";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import Spinner from "react-bootstrap/Spinner";
import CargaArchivos from "./cargaArchivos";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { MultiSelect } from "primereact/multiselect";
import { ProgressBar } from "primereact/progressbar";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Button } from "primereact/button";
import { useNavigate, useLocation } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import NavDropdown from "react-bootstrap/NavDropdown";

const TablaSolicitudes = ({ nit, info }) => {
  const {
    obtenerSolicitudeNit,
    solicitudesNit,
    modalremisiones,
    setModalRemisiones,
    solicitudesBus,
    setsolicitudesBus,
  
  } = useContextVentas();
  const navigate = useNavigate();
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [creadores, setcreadores] = useState([]);
  const [datetime24h, setDateTime24h] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCell, setSelectedCell] = useState(null);
  const [estadoActualizado, setestadoActualizado] = useState(false);
  const [solicitud, setsolicitud] = useState();
  const [rowData, setrowData] = useState()
  const [filters, setFilters] = useState({
    estado: { value: null, matchMode: FilterMatchMode.CONTAINS },
    numero_solicitud: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nit_cliente: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tipo_solicitud: { value: null, matchMode: FilterMatchMode.EQUALS },
    numero_documento: { value: null, matchMode: FilterMatchMode.CONTAINS },
    creado_por: { value: null, matchMode: FilterMatchMode.CONTAINS },
    quien_recibe: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fecha_pactada: {
      value: null,
      matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
    },
    fecha_creacion: {
      value: null,
      matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
    },
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!solicitudesNit[nit] && nit) {
      obtenerSolicitudeNit(nit);
    } else {
      setLoading(true);
    }
  }, [solicitudesNit]);

  useEffect(() => {
    if (solicitudesNit[nit] || solicitudesBus) {
      obtenerCreadores();
    }
  }, [solicitudesNit, solicitudesBus]);
  /* Funcion para imprimir el excel */
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(solicitudesBus);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "listado_solicitudes");
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
  /* obtenemos los creadores para el filtro */
  const obtenerCreadores = () => {
    if (creadores?.length === 0) {
      if (nit) {
        const nombresUnicos = solicitudesNit[nit]?.reduce(
          (nombresUnicos, registro) => {
            if (!nombresUnicos.includes(registro.creado_por)) {
              nombresUnicos.push(registro.creado_por);
            }
            return nombresUnicos;
          },
          []
        );
        setcreadores(nombresUnicos);
      } else {
        const nombresUnicos = solicitudesBus.reduce(
          (nombresUnicos, registro) => {
            if (!nombresUnicos.includes(registro.creado_por)) {
              nombresUnicos.push(registro.creado_por);
            }
            return nombresUnicos;
          },
          []
        );
        setcreadores(nombresUnicos);
      }
    }
  };
  /* Funcion que valida si se puede seleccionar una casilla solo se puede la 'P' */
  const isCellSelectable = (event) => {
    const field = event.data.field;
    const row = event.data.rowData;
    const value = event.data.value;
    if (value === "SOLICITUD DE REMISIÓN" && nit) {
      return true;
    }
  };
  /* Evento de casilla seleccionada */
  const onCellSelect = (event) => {
    setsolicitud(event.rowData.numero_solicitud);
    setModalRemisiones(true);
    setrowData(event.rowData)
  };
  /* TAG DE TIPO DE ENTREGA */
  const isCortes = (value) => {
    switch (value) {
      case "CORTES":
        return "danger";
      case "MERCANCIA":
        return "contrast";
      default:
        return null;
    }
  };
  /* tag tipo de entrega */
  const statusTipoSolicitud = (rowData) => {
    const mensaje = rowData;
    return (
      <Tag
        value={mensaje}
        severity={isCortes(mensaje)}
        className="tag-tipo_de_entrega"
      />
    );
  };
  /* Template del tag del estado de la solicitud */
  const statusBodyTemplate = (rowData) => {
    const mensaje = rowData.estado;
    return (
      <Tag
        value={mensaje}
        severity={getSeverity(mensaje)}
        className="tag-estado"
      />
    );
  };
  /* colores del tag del estado de la solicitud */
  const getSeverity = (value) => {
    console.log(value)
    switch (value) {
      case "REPORTADO":
        return "danger";
      case "REMISIONADO":
        return "success";
      case "ASIGNADO":
        return "info";
      case "RECHAZADO":
        return "contrast";
      case "EN ALISTAMIENTO":
        return "warning";
      case "SOLICITUD DE REMISIÓN":
        return "contrast-rem";
      case "ACTUALIZADO":
        return "contrast-act";
      case "ALISTADO":
        return "contrast-alist";
      default:
        return null;
    }
  };
  /* opciones para el filto de estados*/
  const [statuses] = useState([
    "REPORTADO",
    "EN ALISTAMIENTO",
    "ALISTADO",
    "ACTUALIZADO",
    "SOLICITUD DE REMISIÓN",
    "REMISIONADO",
    "ASIGNADO",
    "RECHAZADO",
    "FINALIZADO",
  ]);
  /*template de el filtro del estado de la solicitud */
  const statusItemTemplate = (option) => {
    return (
      <Tag
        value={option}
        severity={getSeverity(option)}
        className="tag-estado"
      />
    );
  };
  /* Filtro de estados de  solicitud*/
  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Selecciona uno"
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };

  const [statuses3] = useState(["Transportadora", "Personal Autorizado"]);
  /* Filtro de estado 3 */
  const statusRowFilterTemplate3 = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses3}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Selecciona uno"
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };
  /* Opciones para filtro de tipo de entrega */
  const [statuses2] = useState(["MERCANCIA", "CORTES"]);
  /* template  Filtro de tipo de entrega */
  const statusItemTemplate2 = (option) => {
    return (
      <Tag
        value={option}
        severity={isCortes(option)}
        className="tag-tipo_de_entrega"
      />
    );
  };

  /* Filtro tipo de entrega */
  const statusRowFilterTemplate2 = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses2}
        onChange={(e) => {
          options.filterApplyCallback(e.value);
        }}
        itemTemplate={statusItemTemplate2}
        placeholder="Selecciona uno"
        className="p-column-filter"
        showClear
        style={{ minWidth: "8rem" }}
      />
    );
  };
  /* Filtro de creador de la solicitud */
  const creadorRowFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={options.value}
        options={creadores}
        onChange={(e) => {
          options.filterApplyCallback(e.value);
        }}
        placeholder="Creado por"
        className="p-column-filter"
        maxSelectedLabels={1}
        style={{ minWidth: "10rem" }}
      />
    );
  };

  /* filtro fecha */
  const fechaFilterTemplate = (options) => {
    return (
      <Calendar
        value={datetime24h}
        onChange={(e) => {
          const year = e.value?.getFullYear();
          const month = (e.value?.getMonth() + 1).toString().padStart(2, "0"); // Los meses empiezan desde 0
          const day = e.value?.getDate().toString().padStart(2, "0");
          const hours = e.value?.getHours().toString().padStart(2, "0");
          const minutes = e.value?.getMinutes().toString().padStart(2, "0");
          const seconds = e.value?.getSeconds().toString().padStart(2, "0");
          // Forma la cadena en el formato deseado
          const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
          options.filterApplyCallback(formattedDate);
          setDateTime24h(e.value);
        }}
        className="p-column-filter"
        style={{ minWidth: "12rem" }}
        showIcon
        showTime
        hourFormat="24"
        showButtonBar
        ariaLabel="hola"
      />
    );
  };

  /* calcular progreso solicitud */
  const calcularprogreso = (estado) => {
    switch (estado) {
      case "REPORTADO":
        return 0;
      case "SOLICITUD DE REMISIÓN":
        return 25;
      case "REMISIONADO":
        return 50;
      case "EN ALISTAMIENTO":
        return 75;
      case "RECHAZADO":
        return 0;
      case "FINALIZADO":
        return 100;
      default:
        return 0;
    }
  };
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options).replace(",", "");
  };
  const elegirTabla = () => {
    if (nit && solicitudesNit[nit]) {
      return solicitudesNit[nit];
    } else if (!nit && solicitudesBus?.length !== 0) {
      return solicitudesBus;
    }
  };
  /* Header principar */
  const renderHeader = () => {
    if (!nit && solicitudesNit) {
      return (
        <Navbar
          expand="md"
          variant="dark"
          bg="dark"
          className=" bg-black"
          data-bs-theme="dark"
        >
          <Container fluid>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <h4 className="text-center mx-md-5  mt-md-2 ">
              solicitudes de nit: {info}
            </h4>

            <Navbar.Collapse className="justify-content-between">
              <div className="d-flex mt-2">
                <IconField iconPosition="left">
                  <InputIcon className="pi pi-search" />
                  <InputText
                    className="input-filter-header "
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Buscar ..."
                  />
                </IconField>
                <Button
                  type="button"
                  icon="pi pi-filter-slash"
                  label="Limpiar filtro"
                  outlined
                  className="btn btn-outline-primary color-icon  "
                  onClick={() => {
                    setGlobalFilterValue("");
                  }}
                />
              </div>

              <Nav className="mr-sm-2 justify-content-md-end justify-content-xl-end ">
                <div className="d-flex align-items-center justify-content-md-end">
                  <Button
                    type="button"
                    icon="pi pi-search"
                    label="Nueva busqueda"
                    outlined
                    className="color-icon  d-none d-md-block d-lg-block"
                    onClick={() => {
                      setsolicitudesBus(null);
                    }}
                  />
                  <Button
                    type="button"
                    icon="pi pi-file-excel"
                    className="color-icon  d-none d-md-block d-lg-block"
                    outlined
                    rounded
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
                        icon="pi pi-search"
                        label="Nueva busqueda"
                        outlined
                        className="btn btn-outline-primary color-icon "
                        onClick={() => {
                          setsolicitudesBus(null);
                        }}
                      />
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Button
                        type="button"
                        icon="pi pi-file-excel"
                        className=" btn btn-outline-primary color-icon color-icon"
                        outlined
                        rounded
                        label="descargar excel"
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
      );
    } else if (solicitudesBus) {
      return false;
    }
  };

  const handleClose = () => {
    console.log("En handleClose ");
    setModalRemisiones(false)
    if (estadoActualizado == true) {
      setestadoActualizado(false);
    } else {
      setestadoActualizado(true);
    }
  };


  return (
    <div>
      {loading ? (
        <>
          <Dialog
            header={
              "Por favor adjunte las remisiones necesarias para el numero de solicitud " +
              solicitud
            }
            onHide={() => setModalRemisiones(false)}
            visible={modalremisiones}
            style={{ width: "50vw" }}
            maximized={window.innerWidth < 768}
          >
            <div className="card flex justify-content-center">
              <Toast></Toast>
              <CargaArchivos numero_solicitud={solicitud} rowData={rowData} handleClose={handleClose}  />
            </div>
          </Dialog>
          <DataTable
            globalFilter={globalFilter}
            value={elegirTabla()}
            tableStyle={{ minWidth: "50rem" }}
            columnResizeMode="expand"
            isDataSelectable={isCellSelectable}
            cellSelection
            selectionMode="single"
            selection={selectedCell}
            onCellSelect={onCellSelect}
            emptyMessage="No se encontraron solicitudes..."
            sortable
            scrollable
            filterDisplay="row"
            filters={filters}
            header={renderHeader()}
          >
            <Column
              field="estado"
              header="Progreso"
              body={(rowData) => (
                <ProgressBar
                  className="barra-tabla "
                  value={calcularprogreso(rowData.estado)}
                ></ProgressBar>
              )}
            />
            {/* Identificación */}
            {!nit && (
              <Column
                field="nit_cliente"
                header="Nit Cliente"
                style={{ minWidth: "12rem" }}
                filterHeaderStyle={{ minWidth: "13rem" }}
                filter
                filterPlaceholder="Buscar por número"
              />
            )}
            <Column
              field="tipo_solicitud"
              header="Tipo de Solicitud"
              filter
              filterElement={statusRowFilterTemplate2}
              showFilterMenu={false}
              body={(rowData) => statusTipoSolicitud(rowData.tipo_solicitud)}
            />
            {/* Identificación */}
            <Column
              field="numero_solicitud"
              header="Número Solicitud"
              style={{ minWidth: "12rem" }}
              filterHeaderStyle={{ minWidth: "13rem" }}
              filter
              filterPlaceholder="Buscar por número"
            />

            <Column
              body={statusBodyTemplate}
              field="estado"
              header="Estado"
              style={{ minWidth: "9rem" }}
              filter
              filterElement={statusRowFilterTemplate}
              showFilterMenu={false}
            />

            {/* Datos del receptor */}
            <Column
              field="quien_recibe"
              header="Quién Recibe"
              style={{ minWidth: "16rem" }}
              filter
              filterElement={statusRowFilterTemplate3}
              showFilterMenu={false}
            />
            <Column
              field="nombres_y_apellidos_de_quien_recibe"
              body={(rowData) =>
                rowData.nombres_y_apellidos_de_quien_recibe
                  ? rowData.nombres_y_apellidos_de_quien_recibe
                  : "N/A"
              }
              header="Nombres y Apellidos"
              style={{ minWidth: "16rem" }}
            />
            <Column
              field="tipo_documento"
              body={(rowData) =>
                rowData.tipo_documento ? rowData.tipo_documento : "N/A"
              }
              header="Tipo Documento"
              style={{ flex: "1 1 auto" }}
            />
            <Column
              field="numero_documento"
              body={(rowData) =>
                rowData.numero_documento ? rowData.numero_documento : "N/A"
              }
              header="Número Documento"
              style={{ flex: "1 1 auto" }}
            />
            <Column
              field="nombre_tercero"
              body={(rowData) =>
                rowData.nombre_tercero ? rowData.nombre_tercero : "N/A"
              }
              header="Nombre del Tercero"
              style={{ flex: "1 1 auto" }}
            />

            {/* Detalles de la solicitud */}
            <Column
              sortable
              field="fecha_pactada"
              header="Fecha Pactada"
              style={{ minWidth: "16rem" }}
              body={(rowData) => formatDate(rowData.fecha_pactada)}
              filter
              filterElement={fechaFilterTemplate}
              showFilterMenu={false}
            />
            <Column
              sortable
              field="fecha_creacion"
              header="Fecha Creacion de la solicitud"
              style={{ minWidth: "16rem" }}
              body={(rowData) => formatDate(rowData.fecha_creacion)}
              filter
              filterElement={fechaFilterTemplate}
              showFilterMenu={false}
            />
            <Column
              sortable
              field="fecha_ultima_actualizacion"
              body={(rowData) =>
                rowData.fecha_ultima_actualizacion
                  ? formatDate(rowData.fecha_ultima_actualizacion)
                  : "N/A"
              }
              header="Última Actualización"
              style={{ flex: "1 1 auto" }}
            />
            <Column
              field="almacen_de_origen"
              header="Almacén de Origen"
              style={{ flex: "1 1 auto" }}
            />

            {/* Datos del creador */}
            <Column
              field="creado_por"
              header="Creador"
              style={{ flex: "1 1 auto" }}
              filter
              filterElement={creadorRowFilterTemplate}
              showFilterMenu={false}
            />

            {/* observaciones */}

            <Column
              body={(rowData) =>
                rowData.acepta_comunicacion_con_cortes ? "Si" : "N/A"
              }
              header="Acepta Comunicación"
              style={{ flex: "1 1 auto" }}
            />
            <Column
              body={(rowData) =>
                rowData.observacion ? rowData.observacion : "N/A"
              }
              header="Observación"
              style={{ flex: "1 1 auto" }}
            />
          </DataTable>
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner
            variant="warning"
            animation="border"
            role="status"
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      )}
    </div>
  );
};

export default TablaSolicitudes;
