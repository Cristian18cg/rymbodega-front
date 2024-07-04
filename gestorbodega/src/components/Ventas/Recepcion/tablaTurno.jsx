import React, { useState, useEffect, useRef } from "react";
import useContextVentas from "../../../hooks/useControlVentas";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import Spinner from "react-bootstrap/Spinner";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ProgressBar } from "primereact/progressbar";
import { useNavigate, useLocation } from "react-router-dom";
import { debounce } from "lodash";
import LightBulb from './LuzSvg'
const TablaTurno = () => {
  const { ListaTurno, setListaTurno, ListarTurnos } = useContextVentas();
  const navigate = useNavigate();
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [creadores, setcreadores] = useState([]);
  const [datetime24h, setDateTime24h] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCell, setSelectedCell] = useState(null);
  const [estadoActualizado, setestadoActualizado] = useState(false);
  const [solicitud, setsolicitud] = useState();
  const [rowData, setrowData] = useState();
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
  const [loading, setLoading] = useState(true);

  const delayedRequest = debounce(() => {
    ListarTurnos();
  }, 500);

  useEffect(() => {
  }, [ListaTurno]);

  useEffect(() => {
    delayedRequest();
  }, []);

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
      // Aquí llamas a tu función para obtener las solicitudes actualizadas
      if (
        data?.mensaje?.campos_cambiados.includes("hora_de_llegada") &&
        data?.mensaje?.campos_cambiados || data?.mensaje?.campos_cambiados.includes("estado")
      ) {
        ListarTurnos();
      }
    };

    return () => {
      ws.current.close();
    };
  }, []);

  /* calcular progreso solicitud */
  const calcularProgreso = (data) => {
    const estados = {
      "REPORTADO": 14.29,
      "EN ALISTAMIENTO": 28.57,
      "ALISTADO": 42.86,
      "ACTUALIZADO": 57.14,
      "SOLICITUD DE REMISIÓN": 71.43,
      "REMISIONADO": 85.71,
      "ASIGNADO": 100,
    };
  
    if (!data.solicitudes || data.solicitudes.length === 0) {
      return 0;
    }
  
    const totalSolicitudes = data.solicitudes.length;
    const progresoTotal = data.solicitudes.reduce((acc, solicitud) => {
      return acc + (estados[solicitud.estado] || 0);
    }, 0);
  
    const progresoPromedio = progresoTotal / totalSolicitudes;
    return Math.round(progresoPromedio);
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
  /* Opciones para filtro de tipo de entrega */
  const [statuses2] = useState(["MERCANCIA", "CORTES"]);
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
  return (
    <div className="fondo-turno" style={{ width: '100vw', height: '100vh', padding: '1rem' }}>
      
      {loading ? (
        <>
         <div className="fondo-turno-content">
          <DataTable
            globalFilter={globalFilter}
            value={ListaTurno}
            tableStyle={{ minWidth: "50rem", width: '100%' }}
            columnResizeMode="expand"
            emptyMessage="No se encontraron turnos..."
            scrollable
            sortField="fecha_ultima_actualizacion" 
            sortOrder={-1}
            className="tabla-turno mt-3 p-2 "

          >
           <Column
                field="nit_cliente"
                header="Nit Cliente"
                style={{maxWidth: "7.8vw" }}
                className="tabla-turno-column"
              />    
             <Column field="razon_social" 
              header="Razon Social"
              className="tabla-turno-column"
              style={{ minWidth: "5vw" }}
              />          
            <Column field="quien_recibe" 
              header="Tipo "
              className="tabla-turno-column"
              style={{ maxWidth: "9vw" }}

              />
            {/* Identificación */}

            <Column
              field="nombres_y_apellidos_de_quien_recibe"
              body={(rowData) =>
                rowData.nombres_y_apellidos_de_quien_recibe
                  ? rowData.nombres_y_apellidos_de_quien_recibe
                  : rowData.nombre_tercero
              }
              header="Entregar a: "
              style={{ minWidth: "9vw" }}
              className="tabla-turno-column"

            />
             <Column
              field="hora_de_llegada"
              header="Hora    de acceso    "
              body={(rowData) =>
                rowData.hora_de_llegada
                  ? formatDate(rowData.hora_de_llegada)
                  : "N/A"
              }
              style={{ maxWidth: "12vw" }}


            />
            <Column
              field="fecha_ultima_actualización"
              body={(rowData) =>
                rowData.fecha_ultima_actualizacion
                  ? formatDate(rowData.fecha_ultima_actualizacion)
                  : "N/A"
              }
              header="Hora actualizacion"
              style={{  maxWidth: "12vw" }}
            />
           
            <Column field="total_solicitudes" header="N° solicitudes"
              className="tabla-turno-column text-center"
              style={{ maxWidth: "6vw" }}
              />
              <Column
              field="estado"
              header="Progreso"
              body={(rowData) => (
               /*  <ProgressBar
                  className="barra-tabla progress-bar-turno"
                  value={calcularProgreso(rowData)}
                ></ProgressBar> */
                <LightBulb progress={calcularProgreso(rowData)} />

              )}
              className="barra-tabla-turno-col "
            />
          </DataTable>
          </div>
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

export default TablaTurno;
