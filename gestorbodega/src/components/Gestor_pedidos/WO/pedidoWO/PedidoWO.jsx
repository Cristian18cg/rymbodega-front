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

export const PedidoWO = (pedido) => {
  const { ListarVentas, ListaPedido, setListaPedido } = useControl_Woocomerce();
  const { CrearDocumentoVenta, loadingPedido, listaventasWO } = useControl_WO();
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
        onClick={listaventasWO}
      />
    </div>
  );

  const header = () => {
    return (
      <Menubar start={start} end={end} className="p-header-datatable2  " />
    );
  };
  const footer = () => {
    // Asumiendo que tienes acceso a un array global llamado 'productosTotales' con todos los productos
    if (pedido.pedido && Array.isArray(pedido.pedido)) {
      // Sumar el precioRenglon de todos los productos de la tabla
      const totalFooter = pedido.pedido.reduce((total, producto) => {
        const precio = parseFloat(producto.precioRenglon) || 0;
        return total + precio;
      }, 0);

      const totalFormatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(totalFooter);

      return <h5>Total pedido: {totalFormatted}</h5>;
    } else {
      return <strong>0.00</strong>;
    }
  };

  const items = Array.from({ length: 15 }, (v, i) => i);

  return (
    <div className="row">
      {pedido ? (
        <div className="col-md-12 ">
          <DataTable
            header={header}
            rows={10}
            value={pedido.pedido}
            filters={filters}
            globalFilterFields={[
              "inventario.id",
              "cantidad",
              "inventario.descripcion",
              "porcentajeDescuento",
              "precio",
              "precioRenglon",
            ]}
            emptyMessage="No se encontraron productos"
            scrollable
            tableStyle={{ minWidth: "50rem" }}
            removableSort
            className="header-woo"
            editMode="cell"
            stripedRows
            footer={footer}
          >
            <Column
              style={{ minWidth: "0.5rem" }}
              sortable
              field="inventario.id"
              header="ID"
            />
            <Column
              style={{ minWidth: "5rem" }}
              sortable
              field="cantidad"
              header="Cantidad"
            />
            <Column
              style={{ minWidth: "5rem" }}
              sortable
              field="inventario.descripcion"
              header="Nombre"
            />
            {/*   <Column header="Image" body={imageBodyTemplate}></Column> */}
            <Column
              sortable
              field="porcentajeDescuento"
              header="Descuento"
              body={(rowData) => {
                return <span>{rowData.porcentajeDescuento}%</span>;
              }}
            />
            <Column
              sortable
              field="precio"
              header="Precio Unitario"
              body={(rowData) =>
                new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: "2",
                }).format(rowData.precio)
              }
            />
            <Column
              sortable
              field="precioRenglon"
              header="Precio Unitario"
              body={(rowData) =>
                new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: "2",
                }).format(rowData.precioRenglon)
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