import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import useControl_Pedidos from "../../../hooks/useControl_Pedidos";
import useControl_Woocomerce from "../../../hooks/useControl_Woocomerce";
import useControl_WO from '../../../hooks/useControl_WO'
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
import { debounce } from "lodash";

export const ProductosWO = () => {
    const { ListarProductosWO,listaProductosW_O  } = useControl_WO();
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState(null);

    const delayedRequest = debounce(() => {
        if (listaProductosW_O?.length === 0) {
            ListarProductosWO();
        }
       
      }, 500);
      useEffect(() => {
        // Llama a la función asincrónica para obtener los datos
        delayedRequest();
        initFilters();
      }, []);
   
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
            onClick={ListarProductosWO}
          />
        </div>
      );
    
      const header = () => {
        return (
          <Menubar start={start} end={end} className="p-header-datatable2  " />
        );
      };
  const items = Array.from({ length: 15 }, (v, i) => i);

  return (
    <div className="row">
    {listaProductosW_O?.length > 0 ? (
      <div className="col-md-12 ">
        <DataTable
          header={header}
          rows={10}
          paginator
          rowsPerPageOptions={[10, 20, 50]}
          value={listaProductosW_O}
          filters={filters}
          globalFilterFields={["codigo", "descripcion"]}
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
            field="codigo"
            header="codigo"
            body={(data) => {
              return data.codigo ? data.codigo : "No tiene";
            }}
          />

          <Column
            style={{ minWidth: "5rem" }}
            sortable
            field="descripcion"
            header="Nombre Completo"
          />
          <Column
            style={{ minWidth: "0.5rem" }}
            sortable
            field="grupo"
            header="Grupo"
            body={(data) => {
              return data.grupo[0]?.nombreGrupo ? data.grupo[0]?.nombreGrupo : "No tiene";
            }}
          />
            <Column
            style={{ minWidth: "0.5rem" }}
            sortable
            field="inventarioClasificacion"
            header="Clasificacion"
            body={(data) => {
              return data.inventarioClasificacion.nombre ? data.inventarioClasificacion.nombre : "No tiene";
            }}
          />
            <Column
            style={{ minWidth: "0.5rem" }}
            sortable
            field="senFavorito"
            header="Favorito"
            
          />
          {/* <Column
            sortable
            field="regular_price"
            header="Precio Regular"
            body={(rowData) =>
              new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: "0",
              }).format(rowData?.regular_price)
            }
          /> */}
        
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
  )
}
