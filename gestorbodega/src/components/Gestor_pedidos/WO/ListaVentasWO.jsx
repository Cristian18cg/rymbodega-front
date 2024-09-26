import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import useControl_Pedidos from "../../../hooks/useControl_Pedidos";
import useControl_Woocomerce from "../../../hooks/useControl_Woocomerce";
import useControl_WO from "../../../hooks/useControl_WO";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Tag } from "primereact/tag";
import { InputNumber } from "primereact/inputnumber";
import { Menubar } from "primereact/menubar";
import { MultiSelect } from "primereact/multiselect";
import Swal from "sweetalert2";
import { Skeleton } from "primereact/skeleton";
import { Dialog } from "primereact/dialog";
import { PedidoWO } from "./pedidoWO/PedidoWO";

export const ListaVentasWO = () => {
  const { listaventasWO, setlistaventasWO, ListarDocumentoVenta,TicketVenta } =
    useControl_WO();
  const [visiblePedidos, setVisiblePedidos] = useState(false);
  const [nomPedido, setnomPedido] = useState("false");
  const [infoPedido, setinfoPedido] = useState("false");

  useEffect(() => {
    if (listaventasWO.length === 0) {
      ListarDocumentoVenta();
    }
    console.log(listaventasWO);
    initFilters();
  }, [listaventasWO]);

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);

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

  const imageBodyTemplate = (product) => {
    return (
      <img
        src={product?.images[0]?.src}
        alt={product.image}
        className="w-6rem shadow-2 border-round"
        style={{ height: "5vw", width: "5vw" }}
      />
    );
  };
  const statusBodyTemplate = (estado) => {
    return (
      <Tag
        value={getEstado(estado.status)}
        severity={getSeverity(estado.status)}
      ></Tag>
    );
  };

  const getSeverity = (product) => {
    switch (product) {
      case "on-hold":
        return "warning";

      case "processing":
        return "success";

      case "canceled":
        return "danger";

      default:
        return null;
    }
  };
  const getSeverity2 = (product) => {
    switch (product) {
      case "instock":
        return "success";

      case "lowstock":
        return "warning";

      case "outofstock":
        return "danger";

      default:
        return null;
    }
  };

  const getEstado2 = (pedidoEstado) => {
    switch (pedidoEstado) {
      case "instock":
        return "En Stock";

      case "lowstock":
        return "Poco Stock";

      case "outofstock":
        return "Sin Stock";

      default:
        return null;
    }
  };
  const getEstado = (pedidoEstado) => {
    switch (pedidoEstado) {
      case "on-hold":
        return "Facturado";

      case "processing":
        return "Procesando";

      case "canceled":
        return "cancelado";

      default:
        return null;
    }
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
    </div>
  );

  const header = () => {
    return (
      <Menubar start={start} end={end} className="p-header-datatable2  " />
    );
  };

  const [statuses] = useState(["instock", "lowstock", "outofstock"]);

  const StockEditor = (options) => {
    console.log(options);
    return (
      <MultiSelect
        value={getEstado(options.value)}
        onChange={(e) => options.editorCallback(e.value)}
        options={statuses}
        placeholder="Seleccione estado"
        itemTemplate={(option) => {
          return (
            <Tag
              value={getEstado2(option)}
              severity={getSeverity2(option)}
            ></Tag>
          );
        }}
      />
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
        header={`Pedido de woocomerce ${nomPedido} `}
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
                      TicketVenta(rowData.id)
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
