import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import useControl_Pedidos from "../../../hooks/useControl_Pedidos";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Tag } from "primereact/tag";
import { InputSwitch } from 'primereact/inputswitch';
import { DataViewLayoutOptions } from "primereact/dataview";
export const PedidosRuta = ({ data, documento }) => {
  const { actualizar_pedidos,Listar_pedidos } = useControl_Pedidos();
  const [id,setID] =useState("")
  const [completado,setCompletado] =useState("")
  const getSeverityTienda = (value) => {
    switch (value) {
      case "Tienda":
        return "success";

      case "Mayorista":
        return "warning";
      default:
        return null;
    }
  };
  const statusBodyTipo = (rowData) => {
    return (
      <Tag
        value={rowData.tipo_pedido}
        severity={getSeverityTienda(rowData.tipo_pedido)}
      ></Tag>
    );
  };
  const isPositiveInteger = (val) => {
    let str = String(val);

    str = str.trim();

    if (!str) {
      return false;
    }

    str = str.replace(/^0+/, "") || "0";
    let n = Math.floor(Number(str));

    return n !== Infinity && String(n) === str && n >= 0;
  };

  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
      case "valor_pedido":
        if (isPositiveInteger(newValue)) {
          actualizar_pedidos(rowData.id, field, newValue, documento);
          rowData[field] = newValue;
        } else event.preventDefault();
        break;
      case "valor_transferencia":
        if (isPositiveInteger(newValue)) {
          actualizar_pedidos(rowData.id, field, newValue, documento);
          rowData[field] = newValue;
        } else event.preventDefault();
        break;
      case "devolucion":
        if (isPositiveInteger(newValue)) {
          actualizar_pedidos(rowData.id, field, newValue, documento);
          rowData[field] = newValue;
        } else event.preventDefault();
        break;
      default:
        if (newValue?.trim().length > 0) rowData[field] = newValue;
        else event.preventDefault();
        break;
    }
  };

  const cellEditor = (options) => {
    if (options.field === "numero_factura") return textEditor(options);
    else return priceEditor(options);
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
        maxFractionDigits={2}
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  };

  const valorfaltante = (data) => {
    console.log(data);

    // Asegúrate de que los valores sean numéricos
    const valorPedido = Number(data.valor_pedido) || 0;
    const valorTransferencia = Number(data.valor_transferencia) || 0;
    const devolucion = Number(data.devolucion) || 0;

    // Calcula el total faltante
    const totalFaltante = valorPedido - valorTransferencia - devolucion;

    // Formatea el resultado a la moneda COP
    const total = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(totalFaltante);

    return total;
  };

  const completarpedido =(dato, ud)=>{
   console.log('dato',dato)
    Listar_pedidos(documento)
   const doc = documento
   console.log('doc',doc)
   console.log('ud',ud)
    actualizar_pedidos(ud,'completado', dato, doc);

  }
  const completadoSwitch = (rowData) => {

   
    return (
      <InputSwitch  checked={rowData.completado}  onChange={(e) => completarpedido(e.value, rowData.id)}/>
    )
  }
  return (
    <div className="p-3">
      <DataTable value={data.pedidos} editMode="cell">
        <Column
          field="numero_factura"
          header="Número factura"
          body={(data) => {
            return data.numero_factura ? data.numero_factura : "no tiene";
          }}
          style={{ width: "6rem" }}
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
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
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
        ></Column>
        <Column
          field="valor_transferencia"
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
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
        ></Column>
        <Column
          field="devolucion"
          header="Valor devolucion"
          sortable
          body={(rowData) =>
            new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(rowData.devolucion)
          }
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
        ></Column>

        <Column header="Valor faltante" body={valorfaltante} />
        <Column header="Completados" body={completadoSwitch} />

        <Column
          field="tipo_pedido"
          header="Tipo"
          sortable
          body={statusBodyTipo}
        ></Column>

      </DataTable>
    </div>
  );
};
