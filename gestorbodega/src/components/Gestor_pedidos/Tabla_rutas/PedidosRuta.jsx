import React, { useState, useEffect } from "react";
import useControl_Pedidos from "../../../hooks/useControl_Pedidos";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Tag } from "primereact/tag";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "react-bootstrap";
import { MultiSelect } from "primereact/multiselect";

import { SelectButton } from "primereact/selectbutton";
export const PedidosRuta = ({ data, documento }) => {
  const {
    actualizar_pedidos,
    eliminar_pedido,
    Listar_pedidos,
    Pedidos,
    setPedidos,
  } = useControl_Pedidos();
  const [id, setID] = useState("");
  const [completado, setCompletado] = useState("");
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

  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    if (rowData[field] === newValue) {
      event.preventDefault(); // No hacer nada si el valor no cambia
      return;
    }

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
      case "efectivo":
        if (isPositiveInteger(newValue)) {
          actualizar_pedidos(rowData.id, field, newValue, documento);
          rowData[field] = newValue;
        } else event.preventDefault();
        break;
      case "numero_factura":
        actualizar_pedidos(rowData.id, field, newValue, documento);
        rowData[field] = newValue;

        break;
      case "tipo_pedido":
        actualizar_pedidos(rowData.id, field, newValue, documento);
        rowData[field] = newValue;

        break;
      default:
        if (newValue?.trim().length > 0) rowData[field] = newValue;
        else event.preventDefault();
        break;
    }
  };

  const cellEditor = (options) => {
    if (options.field === "numero_factura") return textEditor(options);
    else if (options.field === "tipo_pedido") return optionEditor(options);
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
  const options2 = ["Tienda", "Mayorista"];
  const optionEditor = (options) => {

    return (
      <SelectButton
        value={[options.value]}
        onChange={(e) => {
          options?.editorCallback(e?.value);
        }}
        options={options2}
        onKeyDown={(e) => e.stopPropagation()}
        itemTemplate={(option) => {
          return (
            <Tag
              value={option}
              severity={getSeverityTienda(option)}
            ></Tag>
          );
        }}
      />
    );
  };

  const valorfaltante = (data) => {
    // Asegúrate de que los valores sean numéricos
    const valorPedido = Number(data.valor_pedido) || 0;
    const valorTransferencia = Number(data.valor_transferencia) || 0;
    const devolucion = Number(data.devolucion) || 0;
    const efectivo = Number(data.efectivo) || 0;

    // Calcula el total faltante
    const totalFaltante =
      valorPedido - valorTransferencia - devolucion - efectivo;

    // Formatea el resultado a la moneda COP
    const total = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(totalFaltante);

    return total;
  };

  const completarpedido = (dato, ud) => {
    const doc = documento;
    // Actualiza el campo 'completado' del pedido específico

    actualizar_pedidos(ud, "completado", dato, doc);
    Listar_pedidos(doc);
    if (dato) {
      // Actualiza el campo 'completado' del pedido específico

      // Encuentra el pedido con el id `ud` y verifica si 'credito' es true
      const pedidoConCredito = Pedidos.some((ruta) =>
        ruta.pedidos.some((pedido) => pedido.id === ud && pedido.credito)
      );

      // Si se encuentra un pedido con 'credito' true, llama a la función `credito`
      if (pedidoConCredito) {
        credito(false, ud);
      } else {
        Listar_pedidos(doc);
      }
    } else {
      Listar_pedidos(doc);
    }
  };
  const completadoSwitch = (rowData) => {
    return (
      <InputSwitch
        checked={rowData.completado}
        onChange={(e) => completarpedido(e.value, rowData.id)}
      />
    );
  };
  const credito = (dato, ud) => {
    const doc = documento;
    actualizar_pedidos(ud, "credito", dato, doc);
    Listar_pedidos(doc);
  };
  const creditoSwitch = (rowData) => {
    return (
      <InputSwitch
        disabled={rowData.completado}
        checked={rowData.credito}
        onChange={(e) => credito(e.value, rowData.id)}
      />
    );
  };
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
        <Column
          field="efectivo"
          header="Efectivo"
          sortable
          body={(rowData) =>
            new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(rowData.efectivo)
          }
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
        ></Column>
        <Column header="Valor faltante" body={valorfaltante} />
        <Column header="Completados" body={completadoSwitch} />
        <Column header="Credito" body={creditoSwitch} />

        <Column
          field="tipo_pedido"
          header="Tipo"
          sortable
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
          body={statusBodyTipo}
        ></Column>
        <Column
          body={(data) => {
            return (
              <a
                className="pi pi-trash trashb"
                style={{ color: "red" }}
                onClick={() => eliminar_pedido(data.id, documento)}
              ></a>
            );
          }}
        />
      </DataTable>
    </div>
  );
};
