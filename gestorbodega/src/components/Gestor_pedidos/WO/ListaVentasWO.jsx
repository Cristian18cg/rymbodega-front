import React, { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import useControl_WO from "../../../hooks/useControl_WO";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";

import { Menubar } from "primereact/menubar";

import { Skeleton } from "primereact/skeleton";
import { Dialog } from "primereact/dialog";
import { PedidoWO } from "./pedidoWO/PedidoWO";

export const ListaVentasWO = () => {
  const {
    listaventasWO,
    ListarDocumentoVenta,
    TicketVenta,
    EliminarDocumentoVenta,
    AnularDocumentoVenta,
  } = useControl_WO();
  const [visiblePedidos, setVisiblePedidos] = useState(false);
  const [nomPedido, setnomPedido] = useState("false");
  const [infoPedido, setinfoPedido] = useState("false");
  const [filtroFecha, setFiltroFecha] = useState();
  const [calendar, setcalendar] = useState(false);
  const [dates, setDates] = useState(null);

  useEffect(() => {
    if (listaventasWO.length === 0) {
      ListarDocumentoVenta();
    }
    console.log(listaventasWO);
    initFilters();
  }, [listaventasWO, ListarDocumentoVenta]);
  useEffect(() => {
    // Llama a la función asincrónica para obtener los datos
    if (filtroFecha?.some((filtro) => filtro.name === "Rango")) {
      setcalendar(true);
    } else {
      setcalendar(false);
    }
  }, [filtroFecha]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e?.target?.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const exportExcel = () => {
    const date = new Date().toISOString().split("T")[0];
    // Transformar los datos para extraer solo la información relevante
    const ventasParaExportar = listaventasWO.map((venta) => {
      return {
        id: venta.id,
        prefijo: venta.prefijo,
        numero: venta.numero,
        fecha: venta.fecha,
        empresa: venta.empresa,
        terceroExterno: `${venta.primerNombreTerceroExterno} ${venta.primerApellidoTerceroExterno}`,
        terceroInterno: `${venta.primerNombreTerceroInterno} ${venta.primerApellidoTerceroInterno}`,
        formaPago: venta.formaPago,
        concepto: venta.concepto,
        productos: venta.productos
          .map((producto) => producto.inventario.descripcion)
          .join(", "),
        cantidadTotal: venta.productos.reduce(
          (total, producto) => total + Number(producto.cantidad),
          0
        ),
        valorTotal: venta.productos.reduce(
          (total, producto) => total + Number(producto.valorTotalRenglon),
          0
        ),
      };
    });
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(ventasParaExportar);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ["data"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, `Lista ventas World Office  ${date}`);
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

  const start = (
    <div className="d-flex justify-content-between">
      <Button
        type="button"
        icon="pi pi-filter-slash"
        label="Limpiar"
        outlined
        className="btn btn-outline-primary color-icon "
        onClick={clearFilter}
      />
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          className="mx-2"
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Buscar palabra"
        />
      </IconField>
    </div>
  );
  const fechasFil = [
    { name: "Hoy", rango: "Hoy" },
    { name: "Mes pasado", rango: "Mes pasado" },
    { name: "Este mes", rango: "Este mes" },
    { name: "Rango", rango: "Rango" },
    { name: "Trimestre", rango: "Trimestre" },
    { name: "Semestre", rango: "Semestre" },
  ];
  const isDisabled = () => {
    // Verifica si cada objeto en el array tiene las propiedades 'name' y 'rango' definidas
    return (
      filtroFecha?.length === 0 ||
      filtroFecha?.some((filtro) => !filtro.name || !filtro.rango)
    );
  };

  const obtenerRangoFechas = (rango) => {
    const hoy = new Date();
    let fechaInicio;
    let fechaFin = hoy;

    switch (rango) {
      case "Hoy":
        // Hoy
        fechaInicio = hoy;
        fechaFin = hoy;
        break;
      case "Este mes":
        // Este mes
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1); // Primer día del mes actual
        fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0); // Último día del mes actual
        break;
      case "Mes pasado":
        // Mes pasado
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        fechaFin = new Date(hoy.getFullYear(), hoy.getMonth(), 0); // Último día del mes pasado
        break;
      case "Rango":
        // Rango personalizado, aquí puedes agregar tu lógica personalizada
        fechaInicio = null;
        fechaFin = null;
        break;
      case "Trimestre":
        // Trimestre pasado
        const mesActual = hoy.getMonth();
        const trimestreActual = Math.floor((mesActual + 3) / 3);
        fechaInicio = new Date(hoy.getFullYear(), (trimestreActual - 2) * 3, 1); // Inicio del trimestre pasado
        fechaFin = new Date(hoy.getFullYear(), (trimestreActual - 1) * 3, 0); // Fin del trimestre pasado
        break;
      case "Semestre":
        // Semestre pasado
        const mesInicioSemestre = hoy.getMonth() < 6 ? 0 : 6; // Determinar si el semestre es la primera mitad o la segunda mitad del año
        const añoSemestre =
          hoy.getMonth() < 6 ? hoy.getFullYear() - 1 : hoy.getFullYear(); // Ajustar el año si estamos en la primera mitad del año
        fechaInicio = new Date(añoSemestre, mesInicioSemestre, 1); // Inicio del semestre pasado
        fechaFin = new Date(añoSemestre, mesInicioSemestre + 5, 0); // Fin del semestre pasado
        break;
      default:
        fechaInicio = null;
        fechaFin = null;
        break;
    }

    return {
      fechaInicio: fechaInicio ? fechaInicio.toISOString().split("T")[0] : null,
      fechaFin: fechaFin ? fechaFin.toISOString().split("T")[0] : null,
    };
  };
  const funcionFiltrar = () => {
    if (filtroFecha?.some((filtro) => filtro.name === "Rango")) {
      ListarDocumentoVenta(
        dates[0].toISOString().split("T")[0],
        dates[1].toISOString().split("T")[0]
      );
    } else {
      const fecha = obtenerRangoFechas(filtroFecha[0].name);
      ListarDocumentoVenta(fecha.fechaInicio, fecha.fechaFin);
    }
  };
  const end = (
    <div className="d-flex ">
      <MultiSelect
        value={filtroFecha}
        onChange={(e) => setFiltroFecha(e.value)}
        options={fechasFil}
        placeholder="Seleccione filtro de fecha"
        selectAll={false}
        selectionLimit={1}
        optionLabel="name"
        display="chip"
      />
      <Calendar
        visible={calendar}
        value={dates}
        onChange={(e) => setDates(e.value)}
        selectionMode="range"
        readOnlyInput
        maxDate={new Date()}
        hideOnRangeSelection
        style={{ maxWidth: "15vw" }}
        className={calendar ? "mx-2" : "d-none"}
        showButtonBar
        locate="es"
        showIcon
        placeholder="Rango de fecha"
      />

      <Button
        disabled={isDisabled()}
        type="button"
        icon="pi pi-filter"
        label="Filtrar"
        outlined
        className="btn btn-outline-primary color-icon "
        onClick={() => {
          funcionFiltrar();
        }}
      />
      <Button
        type="button"
        icon="pi pi-refresh"
        outlined
        className="btn btn-outline-primary color-icon p-1"
        onClick={ListarDocumentoVenta}
      />
      <Button
        type="button"
        icon="pi pi-file-excel"
        className=" btn btn-outline-primary color-icon p-1"
        outlined
        rounded
        onClick={exportExcel}
        data-pr-tooltip="XLS"
      />
    </div>
  );
  const header = () => {
    return (
      <Menubar start={start} end={end} className="p-header-datatable2  " />
    );
  };
  const items = Array.from({ length: 15 }, (v, i) => i);
  const footer = () => {
    // Asumiendo que tienes acceso a un array global llamado 'productosTotales' con todos los productos
    if (listaventasWO && Array.isArray(listaventasWO)) {
      // Sumar el precioRenglon de todos los productos de la tabla
      const totalFooter = listaventasWO.reduce((total, pedido) => {
        const precio = parseFloat(pedido.totalPedido) || 0;
        return total + precio;
      }, 0);

      const totalFormatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(totalFooter);

      return <h5>Total Dia: {totalFormatted}</h5>;
    } else {
      return <strong>0.00</strong>;
    }
  };

  return (
    <div className="row">
      <Dialog
        header={`Pedido de World Office ${nomPedido} `}
        visible={visiblePedidos}
        onHide={() => {
          setVisiblePedidos(false);
        }}
        maximizable
        style={{ width: "80vw", height: "95vh" }}
      >
        <PedidoWO pedido={infoPedido} />
      </Dialog>
      {listaventasWO?.length > 0 ? (
        <div className="col-md-12 ">
          <DataTable
            header={header}
            rows={10}
            paginator
            rowsPerPageOptions={[10, 20, 50]}
            value={listaventasWO}
            filters={filters}
            globalFilterFields={[
              "id",
              "prefijo",
              "terceroExterno",
              "concepto",
              "fecha",
            ]}
            emptyMessage="No se encontraron ventas de la api"
            scrollable
            tableStyle={{ minWidth: "50rem" }}
            removableSort
            className="header-woo"
            editMode="cell"
            stripedRows
            footer={footer}
            currentPageReportTemplate="hola"
          >
            <Column
              className="mx-3"
              body={(rowData) => {
                return (
                  <Button
                    icon="pi pi-window-maximize"
                    className="color-icon2"
                    onClick={() => {
                      setVisiblePedidos(true);
                      setnomPedido(`${rowData.terceroExterno}`);
                      setinfoPedido(rowData.productos);
                    }}
                  />
                );
              }}
              style={{ maxWidth: "3rem" }}
            />
            <Column
              style={{ minWidth: "0.5rem" }}
              sortable
              field="id"
              header="ID"
            />
            <Column sortable field="prefijo" header="Prefijo" />
            <Column sortable field="fecha" header="Fecha" />
            <Column
              style={{ minWidth: "5rem" }}
              sortable
              field="terceroExterno"
              header="Tercero"
            />
            <Column
              style={{ minWidth: "5rem" }}
              sortable
              field="concepto"
              header="Concepto"
            />
            <Column
              style={{ minWidth: "5rem" }}
              sortable
              field="totalPedido"
              header="Total Pedido"
              body={(rowData) =>
                new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: "2",
                }).format(rowData.totalPedido)
              }
            />{" "}
            <Column
              className="mx-3"
              body={(rowData) => {
                console.log(rowData.concepto);
                const isAnulada = rowData.concepto === "ANULADA"; // Verificar si el documento está anulado

                return (
                  <div className="d-flex justify-content-start">
                    {/* Icono de impresión, se desactiva si está anulado */}
                    <i
                      className={`pi pi-print hover-grow mx-2 ${
                        isAnulada ? "text-muted" : ""
                      }`}
                      onClick={() => {
                        if (!isAnulada) TicketVenta(rowData.id);
                      }}
                      style={{ cursor: isAnulada ? "not-allowed" : "pointer" }}
                    />

                    {/* Icono de anulación, se desactiva si está anulado */}
                    <i
                      className={`pi pi-times hover-grow mx-2 ${
                        isAnulada ? "text-muted" : ""
                      }`}
                      onClick={() => {
                        if (!isAnulada) AnularDocumentoVenta(rowData.id);
                      }}
                      style={{
                        cursor: isAnulada ? "not-allowed" : "pointer",
                        color: isAnulada ? "gray" : "orange",
                      }}
                    />

                    {/* Icono de eliminación, se desactiva si está anulado */}
                    <i
                      className={`pi pi-trash hover-grow mx-2 ${
                        isAnulada ? "text-muted" : ""
                      }`}
                      onClick={() => {
                        if (!isAnulada) EliminarDocumentoVenta(rowData.id);
                      }}
                      style={{
                        cursor: isAnulada ? "not-allowed" : "pointer",
                        color: isAnulada ? "gray" : "red",
                      }}
                    />
                  </div>
                );
              }}
            />
          </DataTable>
        </div>
      ) : (
        <div className="card">
          <DataTable value={items} className="p-datatable-striped">
            <Column
              style={{ minWidth: "0.5rem" }}
              sortable
              field="id"
              header="ID"
              body={<Skeleton />}
            />

            <Column
              sortable
              field="prefijo"
              header="Prefijo"
              body={<Skeleton />}
            />
            <Column sortable field="fecha" header="Fecha" body={<Skeleton />} />

            <Column
              style={{ minWidth: "5rem" }}
              sortable
              field="terceroExterno"
              header="Tercero"
              body={<Skeleton />}
            />
            <Column
              style={{ minWidth: "5rem" }}
              sortable
              field="concepto"
              header="Concepto"
              body={<Skeleton />}
            />
          </DataTable>
        </div>
      )}
    </div>
  );
};
