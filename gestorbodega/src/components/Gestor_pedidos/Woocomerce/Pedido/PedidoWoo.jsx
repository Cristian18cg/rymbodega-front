import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import useControl_WO from "../../../../hooks/useControl_WO";
import useControl_Woocomerce from "../../../../hooks/useControl_Woocomerce";
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

export const PedidoWoo = (pedido) => {
  const { ListarVentas, ListaPedido, setListaPedido } = useControl_Woocomerce();
  const { CrearDocumentoVenta } = useControl_WO();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  useEffect(() => {
    console.log("repedido", pedido.pedido);
  }, [pedido]);
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
        src={product?.image?.src}
        alt={product.image.id}
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
        onClick={ListarVentas}
      />
      <Button
        type="button"
        label="Crear pedido"
        icon="pi pi-plus"
        outlined
        className="btn btn-outline-primary color-icon p-1"
        onClick={CrearDocumentoVenta}
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

  return (
    <div className="row">
      {pedido ? (
        <div className="col-md-12 ">
          <DataTable
            header={header}
            rows={10}
            paginator
            rowsPerPageOptions={[10, 20, 50]}
            value={pedido.pedido.line_items}
            filters={filters}
            globalFilterFields={["id", "name", "total", "quantity"]}
            emptyMessage="No se encontraron productos"
            scrollable
            tableStyle={{ minWidth: "50rem" }}
            removableSort
            className="header-woo"
            editMode="cell"
            stripedRows
          >
            <Column
              style={{ minWidth: "0.5rem" }}
              sortable
              field="sku"
              header="SKU"
            />
            <Column
              style={{ minWidth: "5rem" }}
              sortable
              field="quantity"
              header="Cantidad"
            />
            <Column
              style={{ minWidth: "5rem" }}
              sortable
              field="name"
              header="Nombre"
            />
            <Column header="Image" body={imageBodyTemplate}></Column>

            <Column
              sortable
              field="total"
              header="Total"
              body={(rowData) =>
                new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: "0",
                }).format(rowData.total)
              }
            />

            {/*  <Column
              sortable
              field="status"
              header="Estado"
              body={statusBodyTemplate}
            /> */}
          </DataTable>
        </div>
      ) : (
        <div className="card">
          <DataTable value={items} className="p-datatable-striped">
            <Column field="sku" header="SKU" body={<Skeleton />}></Column>
            <Column
              field="name"
              header="Nombre Completo"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>

            <Column
              sortable
              field="quantity"
              header="Cantidad"
              body={<Skeleton />}
            />
            <Column sortable field="name" header="Nombre" body={<Skeleton />} />
            <Column sortable field="total" header="Total" body={<Skeleton />} />
          </DataTable>
        </div>
      )}
    </div>
  );
};
