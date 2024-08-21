import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import useControl_Pedidos from "../../../hooks/useControl_Pedidos";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Tag } from 'primereact/tag';
export const PedidosRuta = ({ data }) => {
    const getSeverityTienda = (value) => {
        switch (value) {
            case 'Tienda':
                return 'success';

            case 'Mayorista':
                return 'warning';
            default:
                return null;
        }
    };
    const statusBodyTipo = (rowData) => {
        return <Tag value={rowData.tipo_pedido} severity={getSeverityTienda(rowData.tipo_pedido)}></Tag>;
    };

  return (
    <div className="p-3">
      <DataTable value={data.pedidos}>
        <Column
          field="numero_factura"
          header="Número factura"
          body={(data) => {
            return data.numero_factura ? data.numero_factura : "no tiene";
          }}
        ></Column>
        <Column
          field="valor_pedido"
          header="Valor"
          sortable
          body={(rowData) =>
            new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(rowData.valor_pedido)
          }
        ></Column>
        <Column
          field="valor_tranferencia"
          header="Transferencia"
          sortable
          body={(rowData) =>
            new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(rowData.valor_transferencia)
          }
        ></Column>
        <Column field="tipo_pedido" header="Tipo" sortable body={statusBodyTipo}></Column>
      </DataTable>
    </div>
  );
};
