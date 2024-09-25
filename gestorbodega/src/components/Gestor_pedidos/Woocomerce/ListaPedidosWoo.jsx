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
import { PedidoWoo } from "./Pedido/PedidoWoo";

export const ListaPedidosWoo = () => {
  const { ListarVentas, ListaPedido, setListaPedido } = useControl_Woocomerce();
  const { ListarProductosWO, listaProductosW_O,ListarTerceros,listaTerceros } = useControl_WO();
  const [visiblePedidos, setVisiblePedidos] = useState(false);
  const [nomPedido, setnomPedido] = useState("false");
  const [infoPedido, setinfoPedido] = useState("false");
  useEffect(() => {
    if (ListaPedido.length === 0) {
      ListarVentas();
    }
    if (listaProductosW_O.length === 0) {
      ListarProductosWO();
    } if (listaTerceros.length === 0) {
      ListarTerceros();
    }
    initFilters();
  }, [ListaPedido]);

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

      case "completed":
        return "primary";
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
      case "completed":
        return "Completo";

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
      <Dialog
        header={`Pedido de ${nomPedido} `}
        visible={visiblePedidos}
        onHide={() => {
          setVisiblePedidos(false);
        }}
        maximizable
        style={{ width: "80vw", height: "95vh" }}
      >
        <PedidoWoo pedido={infoPedido} />
      </Dialog>
      {ListaPedido?.length > 0 ? (
        <div className="col-md-12 ">
          <DataTable
            header={header}
            rows={10}
            paginator
            rowsPerPageOptions={[10, 20, 50]}
            value={ListaPedido}
            filters={filters}
            globalFilterFields={[
              "id",
              "billing.first_name",
              "billing.last_name",
              "categories.name",
              "date_created",
              "total",
            ]}
            emptyMessage="No se encontraron productos"
            scrollable
            tableStyle={{ minWidth: "50rem" }}
            removableSort
            className="header-woo"
            editMode="cell"
            stripedRows
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
                      setnomPedido(
                        `${rowData.billing.first_name} ${rowData.billing.last_name}`
                      );
                      setinfoPedido(rowData);
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

            <Column
              style={{ minWidth: "5rem" }}
              sortable
              field="billing"
              header="Nombre Completo"
              body={(rowData) =>
                `${rowData.billing.first_name} ${rowData.billing.last_name}`
              }
            />
            <Column
              style={{ minWidth: "5rem" }}
              sortable
              field="billing"
              header="Direccion"
              body={(rowData) => `${rowData.billing.address_1}`}
            />
            <Column
              style={{ minWidth: "5rem" }}
              sortable
              field="billing"
              header="Celular"
              body={(rowData) => `${rowData.billing.phone}`}
            />
            <Column
              sortable
              field="date_created"
              header="Fecha de creacion"
              body={(rowData) =>
                new Date(rowData.date_created).toLocaleString("es-ES", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              }
            />
            {/* <Column header="Image" body={imageBodyTemplate}></Column> */}

            <Column
              sortable
              field="discount_total"
              header="Descuento"
              body={(rowData) =>
                new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: "0",
                }).format(rowData.discount_total)
              }
            />
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

            <Column
              sortable
              field="status"
              header="Estado"
              body={statusBodyTemplate}
            />
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
              field="regular_price"
              header="Precio Regular"
              body={<Skeleton />}
            ></Column>
            <Column
              field="sale_price"
              header="Precio decuento"
              body={<Skeleton />}
            ></Column>
            <Column
              sortable
              field="categories"
              header="Categoria padre"
              body={<Skeleton />}
            />
            <Column
              sortable
              field="categories"
              header="Categoria hijo"
              body={<Skeleton />}
            />
            <Column
              sortable
              field="status"
              header="Stock"
              body={<Skeleton />}
            />
            <Column
              sortable
              field="stock_status"
              header="Stock Estado"
              body={<Skeleton />}
            />
          </DataTable>
        </div>
      )}
    </div>
  );
};
