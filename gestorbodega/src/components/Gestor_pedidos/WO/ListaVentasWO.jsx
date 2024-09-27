import React, { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import useControl_WO from "../../../hooks/useControl_WO";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import { Menubar } from "primereact/menubar";

import { Skeleton } from "primereact/skeleton";
import { Dialog } from "primereact/dialog";
import { PedidoWO } from "./pedidoWO/PedidoWO";

export const ListaVentasWO = () => {
  const { listaventasWO, ListarDocumentoVenta, TicketVenta } = useControl_WO();
  const [visiblePedidos, setVisiblePedidos] = useState(false);
  const [nomPedido, setnomPedido] = useState("false");
  const [infoPedido, setinfoPedido] = useState("false");


  useEffect(() => {
    if (listaventasWO.length === 0) {
      ListarDocumentoVenta();
    }
    initFilters();
  }, [listaventasWO, ListarDocumentoVenta]);

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
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(ListaVentasWO);
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
  const end = (
    <div className="d-flex ">
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
                return (
                  // Asegúrate de retornar algo aquí
                  <i
                    className="pi pi-print"
                    onClick={() => {
                      TicketVenta(rowData.id);
                    }}
                  />
                );
              }}
              style={{ maxWidth: "3rem" }}
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
