import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import useControl_Pedidos from "../../../hooks/useControl_Pedidos";
import useControl_Woocomerce from "../../../hooks/useControl_Woocomerce";
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

export const ListaProductos = () => {
  const {
    listaProductos,
    setlistaProductos,
    ListarProductos,
    ModificarProducto,
  } = useControl_Woocomerce();
  useEffect(() => {
    ListarProductos();
    // Llama a la función asincrónica para obtener los datos
    initFilters();
  }, []);
  useEffect(() => {
    console.log(listaProductos);
    // Llama a la función asincrónica para obtener los datos
  }, [listaProductos]);
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
        src={product.images[0].src}
        alt={product.image}
        className="w-6rem shadow-2 border-round"
        style={{ height: "5vw", width: "5vw" }}
      />
    );
  };
  const statusBodyTemplate = (product) => {
    return (
      <Tag value={getEstado(product)} severity={getSeverity(product)}></Tag>
    );
  };

  const getSeverity = (product) => {
    switch (product.stock_status) {
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

  const getEstado2 = (product) => {
    switch (product) {
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
  const getEstado = (product) => {
    switch (product.stock_status) {
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
        onClick={ListarProductos}
      />
    </div>
  );

  const header = () => {
    return (
      <Menubar start={start} end={end} className="p-header-datatable2  " />
    );
  };
  const isPositiveInteger = (val) => {
    let str = String(val); // Convertir el valor a cadena
    str = str.trim(); // Eliminar espacios en blanco al principio y al final

    if (!str) {
      return false; // Si la cadena está vacía, devolver false
    }

    // Eliminar ceros a la izquierda solo si no hay un punto decimal
    if (!str.includes(".")) {
      str = str.replace(/^0+/, "") || "0";
    }

    // Intentar convertir la cadena a un número
    let n = Number(str);

    // Comprobar si el número es finito, coincide con la cadena original y es mayor o igual a cero
    return n !== Infinity && !isNaN(n) && n >= 0;
  };
  const cellEditor = (options) => {
    if (options.field === "name" || options.field === "sku")
      return textEditor(options);
    else if (options.field === "stock_status") return StockEditor(options);
    else return priceEditor(options);
  };
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    console.log(newValue);
    // Comprobar si el nuevo valor es diferente al valor actual
    if (rowData[field] === newValue) {
      event.preventDefault(); // No hacer nada si el valor no cambia
      return;
    }

    switch (field) {
      case "stock_status":
        if (newValue !== "") {
          const valueAsText = newValue[0]; // Extrae el primer elemento del array
          if (rowData[field] === valueAsText) {
            event.preventDefault(); // No hacer nada si el valor no cambia
            return;
          }
          ModificarProducto(rowData.id, field, valueAsText);
          rowData[field] = valueAsText;
        } else {
          showError("El campo no puede estar vacio");
          event.preventDefault();
        }
        break;
      case "sku":
        if (newValue && newValue.trim() !== "") {
          ModificarProducto(rowData.id, field, newValue);
          rowData[field] = newValue;
        } else {
          showError("El campo no puede estar vacio");
          event.preventDefault();
        }
        break;
      case "regular_price":
        if (isPositiveInteger(newValue)) {
          if (
            rowData.sale_price &&
            parseFloat(rowData.sale_price) >= parseFloat(newValue)
          ) {
            showError(
              "El precio de oferta debe ser menor que el precio regular."
            );
            event.preventDefault();
          } else {
            ModificarProducto(rowData.id, field, newValue);
            rowData[field] = newValue;
          }
        } else {
          event.preventDefault();
        }
        break;
      case "sale_price":
        if (isPositiveInteger(newValue)) {
          if (
            rowData.regular_price &&
            parseFloat(newValue) >= parseFloat(rowData.regular_price)
          ) {
            showError(
              "El precio de oferta debe ser menor que el precio regular."
            );
            event.preventDefault();
          } else {
            console.log(field);
            console.log(newValue);
            ModificarProducto(rowData.id, field, newValue);
            rowData[field] = newValue;
          }
        } else {
          showError("El campo no puede estar vacio");
          event.preventDefault();
        }
        break;
      case "name":
        if (newValue && newValue.trim() !== "") {
          ModificarProducto(rowData.id, field, newValue);
          rowData[field] = newValue;
        } else {
          event.preventDefault();
        }
        break;
      default:
        if (newValue && newValue.trim().length > 0) {
          ModificarProducto(rowData.id, field, newValue);
          rowData[field] = newValue;
        } else {
          event.preventDefault();
        }
        break;
    }
  };
  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  };
  const priceEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        mode="currency"
        currency="COP"
        locale="es"
        maxFractionDigits={0}
        onKeyDown={(e) => e.stopPropagation()}
      />
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
      {listaProductos.length > 0 ? (
        <div className="col-md-12 ">
          <DataTable
            header={header}
            rows={10}
            paginator
            rowsPerPageOptions={[10, 20, 50]}
            value={listaProductos}
            filters={filters}
            globalFilterFields={["name", "price", "categories.name"]}
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
              editor={(options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              body={(data) => {
                return data.sku ? data.sku : "No tiene";
              }}
            />

            <Column
              style={{ minWidth: "5rem" }}
              sortable
              field="name"
              header="Nombre Completo"
              editor={(options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
            />
            <Column header="Image" body={imageBodyTemplate}></Column>
            <Column
              sortable
              field="regular_price"
              header="Precio Regular"
              body={(rowData) =>
                new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: "0",
                }).format(rowData.regular_price)
              }
              editor={(options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
            />
            <Column
              sortable
              field="sale_price"
              header="Precio decuento"
              body={(rowData) =>
                new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: "0",
                }).format(rowData.sale_price)
              }
              editor={(options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
            />
            <Column
              sortable
              field="categories"
              header="Categoria padre"
              body={(rowData) => rowData.categories[0]?.name}
            />
            <Column
              sortable
              field="categories"
              header="Categoria hijo"
              body={(rowData) => rowData.categories[1]?.name}
            />
            <Column sortable field="stock_quantity" header="Stock" />
            <Column
              sortable
              field="stock_status"
              header="Stock Estado"
              body={statusBodyTemplate}
              editor={(options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
            />
          </DataTable>
        </div>
      ) : (
        <div className="card">
          <DataTable value={items} className="p-datatable-striped">
            <Column
              field="sku"
              header="SKU"
              body={<Skeleton />}
            ></Column>
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
            <Column sortable field="stock_quantity" header="Stock"  body={<Skeleton />} />
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
