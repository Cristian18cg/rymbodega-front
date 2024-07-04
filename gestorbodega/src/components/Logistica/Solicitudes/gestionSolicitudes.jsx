import React, { useState, useEffect, useRef } from "react";
import useControl from "../../../hooks/useControl";
import useContextVentas from "../../../hooks/useControlVentas";
import Estados from "./estadosSolicitudes";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { debounce } from "lodash";
import Spinner from "react-bootstrap/Spinner";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode, FilterOperator, FilterService } from "primereact/api";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Button } from "primereact/button";
import Remisiones from "./Archivos/remisiones"

const GestionSolicitudes = () => {
  const { obtenerSolicitudes, archivosRemisionesApi, solicitudes = [] } = useContextVentas();
  const { jsonlogin, token } = useControl();
  const [list, setList] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalController, setModalController] = useState(false);
  const [solicitud, setSolicitud] = useState();
  const [estadoActualizado, setestadoActualizado] = useState(false);
  const [numeroSolicitud, setNumeroSolicitud] = useState();
  const [archivosRemisiones, setarchivosRemisiones] = useState(false)
  const ws = useRef(null);
  const [consultaAlmacen, setConsultaAlmacen] = useState({
    almacen_de_origen: jsonlogin.almacen_de_origen,
    cargo: jsonlogin.id_cargo,
    area: jsonlogin.id_area,
    usuario: `${jsonlogin.nombre} ${jsonlogin.apellido}`,
  });
  const [selectedCell, setSelectedCell] = useState(null);
  const toast = useRef(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    almacen_de_origen: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    nit_cliente: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    numero_solicitud: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    observacion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    quien_recibe: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    estado: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [statuses] = useState([
    "EN ALISTAMIENTO",
    "RECHAZADO",
    "REPORTADO",
    "ACTUALIZADO",
  ]);
  const delayedRequest = debounce(() => {
    obtenerSolicitudes(token, consultaAlmacen).then(() => {
      setTimeout(() => {
        setList(true);
      }, 2000);
    });
  }, 500);

  useEffect(() => {
    delayedRequest();
  }, [estadoActualizado]);
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
      }
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const getSeverity = (value) => {
    switch (value) {
      case "REPORTADO":
        return "danger";
      case "EN ALISTAMIENTO":
        return "warning";
      case "RECHAZADO":
        return "contrast";
      case "ACTUALIZADO":
        return "contrast-act";
      case "SOLICITUD DE REMISIÓN":
        return "contrast-rem";
      case "ALISTADO":
        return "contrast-alis";
      case "REMISIONADO":
        return "warning-rem2";
      case "FINALIZADO":
        return "warning-rem3";
      default:
        return null;
    }
  };

  const handleClose = () => {
    console.log("En handleClose ");
    setModal(false);
    if (estadoActualizado == true) {
      setestadoActualizado(false);
    } else {
      setestadoActualizado(true);
    }
  };

  const handleCloseArchivos = () => {
    setarchivosRemisiones(false)
  };

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

  const isCortes = (value) => {
    switch (value) {
      case "Cortes y mercancia":
      case "Cortes":
        return "danger";
      case "Mercancia":
        return "contrast";
      default:
        return null;
    }
  };

  const statusTipoEntrega = (rowData) => {
    const mensaje = rowData.tipo_de_entrega;
    return (
      <Tag
        value={mensaje}
        severity={isCortes(mensaje)}
        className="tag-tipo_de_entrega"
      />
    );
  };

  const isCellSelectable = (event) => {
    const field = event.data.field;
    const row = event.data.rowData;
    const value = event.data.value;
    if (value === "REPORTADO") {
      return true;
    } else if (value === "EN ALISTAMIENTO" && jsonlogin.id_cargo == 8) {
      return true;
    } else if (value === "ALISTADO" && jsonlogin.id_cargo == 2) {
      return true;
    } else if (value === "ACTUALIZADO" && jsonlogin.id_cargo == 2) {
      return true;
    } else if (value === "REMISIONADO" && jsonlogin.id_cargo == 2) {
      return true;
    } else if (value === "ASIGNADO" && jsonlogin.id_cargo == 3) {
      return true;
    } else if (value === "FINALIZADO" && jsonlogin.id_cargo == 2) {
      return true;
    }

  };

  const onCellSelect = async (event) => {
    console.log("event.rowData.estado :: : : " + event.rowData.estado);
    if (event.rowData.estado === "ASIGNADO") {
      setSolicitud(event.rowData);
      setNumeroSolicitud(event.rowData.numero_solicitud);
      setModalController(true);
    } else if (event.rowData.estado === "REMISIONADO"){
      const url = event.rowData.url_carpeta
      const confirmacion = await archivosRemisionesApi(url)
      if (confirmacion ){
        setSolicitud(event.rowData);
        setarchivosRemisiones(true)
      }
      
    }else if (event.rowData.estado === "FINALIZADO"){
      const url = event.rowData.url_carpeta_entregas
      const confirmacion = await archivosRemisionesApi(url)
      if (confirmacion ){
        setSolicitud(event.rowData);
        setarchivosRemisiones(true)
      }
      
    }else {
      setSolicitud(event.rowData);
      setNumeroSolicitud(event.rowData.numero_solicitud);
      setModal(true);
    }
  };

  const onclick = () => {
    console.log("ENTREA A ONCLICK");
    setList(false);
    obtenerSolicitudes(token, consultaAlmacen).then(() => {
      setTimeout(() => {
        setList(true);
      }, 2000);
    });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
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
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id=" justify-content-end">
            <div className="navbar-nav me-auto mb-2 mb-md-0">
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
              <div className="flex justify-content-end">
                <IconField iconPosition="left">
                  <InputIcon className="pi pi-search" />
                  <InputText
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Buscar ..."
                  />
                </IconField>
              </div>
              <h4 className="text-center ">Listado de solicitudes</h4>
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
            <Button
              icon="pi pi-refresh "
              onClick={onclick}
              className="color-icon custom-button"
              rounded
              raised
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };

  const statusItemTemplate = (option) => {
    return (
      <Tag
        value={option}
        severity={getSeverity(option)}
        className="tag-estado"
      />
    );
  };
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

  const header = renderHeader();

  const abrirArchivos = async (rowData) => {};

  const bodyCarpetas = async (rowData) => {
    if (rowData.url_carpetas !== null) {
      return (
        <Button
          icon="pi pi-eye"
          className="btn btn-outline-primary color-icon color-icon"
          onClick={() => {
            abrirArchivos(rowData);
          }}
        />
      );
    }
  };

  return (
    <>
      {list ? (
        <div>
          <DataTable
            value={Array.isArray(solicitudes) ? solicitudes : []}
            tableStyle={{ minWidth: "50rem" }}
            columnResizeMode="expand"
            isDataSelectable={isCellSelectable}
            cellSelection
            selectionMode="single"
            selection={selectedCell}
            onCellSelect={onCellSelect}
            sortMode="multiple"
            filters={filters}
            sortable
            scrollable
            emptyMessage="No se encontraron solicitudes..."
            globalFilterFields={[
              "numero_solicitud",
              "estado",
              "quien_recibe",
              "fecha_pactada",
            ]}
            filterDisplay="row"
            header={header}
          >
            <Column
              field="numero_documento"
              header=" ver archivos"
              body={(rowData) => (
                <Button
                  className="button-gestion"
                  icon="pi pi-folder-open"
                  onClick={() => abrirArchivos(rowData)}
                />
              )}
            />
            <Column
              field="almacen_de_origen"
              header="Almacén de Origen"
              filter
              filterPlaceholder="Buscar por almacen"
              style={{ flex: "1 1 auto" }}
            />
            <Column
              field="nit_cliente"
              header="nit cliente"
              filter
              filterPlaceholder="Buscar por nit"
              style={{ minWidth: "15rem" }}
            />
            <Column
              field="numero_solicitud"
              header="Número Solicitud"
              filter
              filterPlaceholder="Search by name"
              style={{ minWidth: "15rem" }}
            />
            <Column
              body={statusBodyTemplate}
              field="estado"
              header="Estado"
              style={{ minWidth: "12rem" }}
              filter
              filterElement={statusRowFilterTemplate}
              showFilterMenu={false}
            />
            <Column
              field="quien_recibe"
              header="Quién Recibe"
              style={{ minWidth: "16rem" }}
            />
            <Column
              field="nombres_y_apellidos_de_quien_recibe"
              body={(solicitudes) =>
                solicitudes.nombres_y_apellidos_de_quien_recibe
                  ? solicitudes.nombres_y_apellidos_de_quien_recibe
                  : "N/A"
              }
              header="Nombres y Apellidos"
              style={{ minWidth: "16rem" }}
            />
            <Column
              field="tipo_documento"
              body={(solicitudes) =>
                solicitudes.tipo_documento ? solicitudes.tipo_documento : "N/A"
              }
              header="Tipo Documento"
              style={{ flex: "1 1 auto" }}
            />
            <Column
              field="numero_documento"
              body={(solicitudes) =>
                solicitudes.numero_documento
                  ? solicitudes.numero_documento
                  : "N/A"
              }
              header="Número Documento"
              style={{ flex: "1 1 auto" }}
            />
            <Column
              body={(solicitudes) =>
                solicitudes.nombre_tercero ? solicitudes.nombre_tercero : "N/A"
              }
              header="Nombre del Tercero"
              style={{ flex: "1 1 auto" }}
            />
            <Column
              field="fecha_pactada"
              header="Fecha Pactada"
              style={{ minWidth: "16rem" }}
            />
            <Column
              field="fecha_creacion"
              header="Fecha Creacion de la solicitud"
              style={{ minWidth: "16rem" }}
            />
            <Column
              field="fecha_ultima_actualizacion"
              body={(solicitudes) =>
                solicitudes.fecha_ultima_actualizacion
                  ? solicitudes.fecha_ultima_actualizacion
                  : "N/A"
              }
              header="Última Actualización"
              style={{ flex: "1 1 auto" }}
            />
            <Column
              body={statusTipoEntrega}
              field="tipo_de_entrega"
              header="Tipo de Entrega"
              style={{ flex: "1 1 auto" }}
            />
            <Column
              field="creado_por"
              header="Creador"
              style={{ flex: "1 1 auto" }}
            />
            <Column
              body={(solicitudes) =>
                solicitudes.acepta_comunicacion_con_cortes ? "Si" : "N/A"
              }
              header="Acepta Comunicación"
              style={{ flex: "1 1 auto" }}
            />
            <Column
              body={(solicitudes) =>
                solicitudes.observacion ? solicitudes.observacion : "N/A"
              }
              header="Observación"
              style={{ flex: "1 1 auto" }}
            />
          </DataTable>
          <Dialog
            header={`Seleccione el nuevo estado para la solicitud #${numeroSolicitud}`}
            onHide={() => setModal(false)}
            visible={modal}
            style={{ width: "50vw" }}
            className="custom-dialog"
          >
            <div className="card flex justify-content-center dialog-content">
              <Toast ref={toast} />
              <Estados rowData={solicitud} handleClose={handleClose} />
            </div>
          </Dialog>
          <Dialog
            header={`Adjunte las evidencias de entrega de la solicitud #${numeroSolicitud}`}
            onHide={() => setModalController(false)}
            visible={modalController}
            style={{ width: "50vw" }}
            className="custom-dialog"
          >
            <div className="card flex justify-content-center dialog-content">
              <Toast ref={toast} />
              <Estados rowData={solicitud} handleClose={handleClose} />
            </div>
          </Dialog>
          {archivosRemisiones && (<Remisiones solicitud={solicitud} archivosRemisiones={archivosRemisiones} handleCloseArchivos={handleCloseArchivos}/>)} 
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

export default GestionSolicitudes;
