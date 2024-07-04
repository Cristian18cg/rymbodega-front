import React, { useState, useEffect, useRef, act } from "react";
import useControl from "../../hooks/useControl";
import useContextVentas from "../../hooks/useControlVentas";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Calendar } from "primereact/calendar";
import { Knob } from "primereact/knob";
import { debounce } from "lodash";
import Spinner from "react-bootstrap/Spinner";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FilterMatchMode } from "primereact/api";
import { MultiSelect } from "primereact/multiselect";
import TablaSolicitudes from "./tablaSolicitudes";
import { Tag } from "primereact/tag";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Tooltip } from "primereact/tooltip";

const ListarSolicitudes = () => {
  const navigate = useNavigate();
  const {
    obtenerSolicitudes,
    solicitudes,
    filtroGlobal,
    obtenerSolicitudeNit,
  } = useContextVentas();
  const { jsonlogin, token } = useControl();
  const [list, setList] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [expandedRows, setExpandedRows] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [consultaAlmacen, setConsultaAlmacen] = useState({
    almacen_de_origen: jsonlogin.almacen_de_origen,
    cargo: jsonlogin.id_cargo,
    area: jsonlogin.id_area,
    usuario: jsonlogin.nombre + " " + jsonlogin.apellido,
  });
  const [creadores, setcreadores] = useState([]);
  const [datetime24h, setDateTime24h] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [filters, setFilters] = useState({
    nit_cliente: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tipo_de_entrega: { value: null, matchMode: FilterMatchMode.EQUALS },
    creado_por: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fecha_creacion: { value: null, matchMode: FilterMatchMode.GREATER_THAN },
  });
  const delayedRequest = debounce(() => {
    if (obtenerSolicitudes(token, consultaAlmacen)) {
      setConsultaAlmacen(jsonlogin.almacen_de_origen);
    }
  }, 500);

  useEffect(() => {
    if (obtenerSolicitudes(token, consultaAlmacen)) {
      setTimeout(() => {
        setList(true);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    if (solicitudes.length > 0) {
      obtenerCreadores();
    }
  }, [solicitudes]);
  useEffect(() => {
    setGlobalFilter(filtroGlobal);
  }, [filtroGlobal]);

  const ws = useRef(null);
  const baseURL = process.env.REACT_APP_BASE_URL;
  const baseURLWithoutHttp = baseURL.replace("http://", "");

  useEffect(() => {
    // Inicializa WebSocket
    ws.current = new WebSocket(
      `ws://${baseURLWithoutHttp}ventas/ws/notificaciones/`
    );

    ws.current.onopen = () => {
      console.log("Conectado al WebSocket");
    };

    ws.current.onclose = () => {
      console.log("Desconectado del WebSocket");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Mensaje recibido del WebSocket:", data);
      if (data.mensaje) {
        // Aquí llamas a tu función para obtener las solicitudes actualizadas
        delayedRequest();
        if (data?.mensaje?.nit_cliente) {
          obtenerSolicitudeNit(data?.mensaje?.nit_cliente);
        }
      }
    };

    return () => {
      ws.current.close();
    };
  }, []);

  /* Funcion para imprimir el excel */
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(solicitudes);
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
  /* Header principar */
  const renderHeader = () => {
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
            Listado de solicitudes
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
                  setGlobalFilterValue("");
                }}
              />
            </div>

            <Nav className="mr-sm-2 justify-content-md-end justify-content-xl-end ">
              <div className="d-flex align-items-center justify-content-md-end">

                <Button
                  type="button"
                  icon="pi pi-file-excel"
                  className="
                  excelb color-icon  d-none d-md-block d-lg-block "
                  outlined
                  rounded
                  onClick={exportExcel}
                />

                <Button
                  type="button"
                  icon="pi pi-file-plus"
                  label="Crear reporte"
                  outlined
                  className="btn btn-outline-primary color-icon d-none d-md-block  d-lg-block"
                  onClick={() => {
                    navigate("/reporte");
                  }}
                />
                <Button
                  type="button"
                  icon="pi pi-sync"
                  className="color-icon  d-none d-md-block d-lg-block"
                  outlined
                  rounded
                  onClick={() => {
                    if (obtenerSolicitudes(token, consultaAlmacen)) {
                      setTimeout(() => {
                        setList(true);
                      }, 2000);
                    }
                  }}
                  data-pr-tooltip="XLS"
                  label="Recargar"
                />

                <NavDropdown
                  className=" d-md-none navcompras"
                  id="basic-nav-dropdown"
                  title="Opciones adicionales"
                >
                  <NavDropdown.Item>
                    <Button
                      type="button"
                      icon="pi pi-file-plus"
                      label="Crear reporte"
                      outlined
                      className="btn btn-outline-primary color-icon "
                      onClick={() => {
                        navigate("/reporte");
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
                      tooltip="Descargar Excel"
                      tooltipOptions={{
                        position: "bottom",
                        mouseTrack: true,
                        mouseTrackTop: 15,
                      }}
                    />
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };
  /* Cabecera de la tabla */
  const header = renderHeader();

  /* filtro fecha */
  const fechaFilterTemplate = (options) => {
    return (
      <Calendar
        value={datetime24h}
        onChange={(e) => {
          const year = e.value.getFullYear();
          const month = (e.value.getMonth() + 1).toString().padStart(2, "0"); // Los meses empiezan desde 0
          const day = e.value.getDate().toString().padStart(2, "0");
          const hours = e.value.getHours().toString().padStart(2, "0");
          const minutes = e.value.getMinutes().toString().padStart(2, "0");
          const seconds = e.value.getSeconds().toString().padStart(2, "0");
          // Forma la cadena en el formato deseado
          const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
          options.filterApplyCallback(formattedDate);
          setDateTime24h(e.value);
        }}
        className="p-column-filter"
        showIcon
        showTime
        hourFormat="24"
      />
    );
  };

  const allowExpansion = (rowData) => {
    return true;
  };
  /* funcion para obtener los creadores */
  const onRowExpand = (event) => {};
  const onRowCollapse = (event) => {};
  const rowExpansionTemplate = (data) => {
    return <TablaSolicitudes nit={data.nit_cliente} />;
  };
  const obtenerCreadores = () => {
    if (creadores.length === 0) {
      const nombresUnicos = solicitudes.reduce((nombresUnicos, registro) => {
        if (!nombresUnicos.includes(registro.creado_por)) {
          nombresUnicos.push(registro.creado_por);
        }
        return nombresUnicos;
      }, []);
      setcreadores(nombresUnicos);
    }
  };
  /* Filtro de creador */
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
  /* Formato de fecha */
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
  const tagnit = (NIT, solicitud, total_solicitudes) => {
    let activar = false;
    if (solicitud === total_solicitudes) {
      activar = true;
    }
    return (
      <Tag className="w-75 tag-nit ">
        <div className="d-flex align-items-center  ">
          {activar ? (
            <i className="pi pi-verified mx-2" style={{ color: "#339f0c  " }}>
              {" "}
            </i>
          ) : (
            <></>
          )}
          <span
            style={{ color: "black", fontSize: "17px", fontFamily: "revert" }}
          >
            {NIT}
          </span>
        </div>
      </Tag>
    );
  };

  return (
    <>
      {list ? (
        <div>
          <DataTable
            globalFilter={globalFilter}
            value={solicitudes}
            tableStyle={{ minWidth: "50rem" }}
            columnResizeMode="expand"
            header={header}
            emptyMessage="No se encontraron solicitudes..."
            sortable
            scrollable
            filterDisplay="row"
            filters={filters}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            onRowExpand={onRowExpand}
            onRowCollapse={onRowCollapse}
            rowExpansionTemplate={rowExpansionTemplate}
          >
            {/* expander */}
            <Column expander={allowExpansion} style={{ width: "5rem" }} />
            {/* Identificación */}
            <Column
              field="nit_cliente"
              header="Nit del cliente"
              style={{ minWidth: "12rem" }}
              filter
              filterPlaceholder="Buscar por número"
              body={(rowData) =>
                tagnit(
                  rowData.nit_cliente,
                  rowData.finalizadas,
                  rowData.total_solicitudes
                )
              }
            />
            <Column
              sortable
              field="fecha_creacion"
              header="Fecha Creacion Ultima Solicitud"
              style={{ minWidth: "16rem" }}
              filter
              filterElement={fechaFilterTemplate}
              showFilterMenu={false}
              body={(rowData) => formatDate(rowData.fecha_pactada)}
            />
            <Column field="almacen_de_origen" header="Almacén de Origen" />
            {/* Datos del creador */}
            <Column
              field="creado_por"
              header="Ultimo creador"
              filter
              filterElement={creadorRowFilterTemplate}
              showFilterMenu={false}
            />
            <Column field="almacen_de_origen" header="Almacén de Origen" />
            <Column
              header="Solicitudes finalizadas"
              field="finalizadas"
              body={(solicitudes) => (
                <Knob
                  value={solicitudes.finalizadas}
                  min={0}
                  max={solicitudes.total_solicitudes}
                  readOnly
                  size={80}
                  valueTemplate={`${solicitudes.finalizadas} / ${solicitudes.total_solicitudes}`}
                  valueColor="#07c407"
                  rangeColor="#44464460"
                />
              )}
            />
          </DataTable>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Spinner
            variant="warning"
            animation="border"
            role="status"
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      )}
    </>
  );
};

export default ListarSolicitudes;
