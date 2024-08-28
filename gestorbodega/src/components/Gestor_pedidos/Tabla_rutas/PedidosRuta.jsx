import React, { useState, useEffect } from "react";
import useControl_Pedidos from "../../../hooks/useControl_Pedidos";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Tag } from "primereact/tag";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "react-bootstrap";
export const PedidosRuta = ({ data, documento }) => {
  const { actualizar_pedidos, eliminar_pedido, Listar_pedidos, Pedidos,setPedidos } = useControl_Pedidos();
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
    let str = String(val);  // Convertir el valor a cadena
    str = str.trim();       // Eliminar espacios en blanco al principio y al final
  
    if (!str) {
      return false;  // Si la cadena está vacía, devolver false
    }
  
    // Eliminar ceros a la izquierda solo si no hay un punto decimal
    if (!str.includes('.')) {
      str = str.replace(/^0+/, "") || "0";
    }
  
    // Intentar convertir la cadena a un número
    let n = Number(str);
  
    // Comprobar si el número es finito, coincide con la cadena original y es mayor o igual a cero
    return n !== Infinity && !isNaN(n) && n >= 0;
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

  const completarpedido = (dato, ud) => {
    const doc = documento;
    // Verifica si `Pedidos` es un array, y si no lo es, lo inicializamos como un array vacío
  if (!Array.isArray(Pedidos)) {
    console.error('Pedidos no está definido como un array. Inicializando como array vacío.');
    setPedidos([]);
    return;
  } // Actualiza el campo 'completado' del pedido específico
  const updatedPedidos = Pedidos.map((ruta) => {
    // Verifica que la propiedad `pedidos` exista y sea un array
    if (!ruta.pedidos || !Array.isArray(ruta.pedidos)) {
      console.error('La propiedad pedidos no está definida o no es un array en la ruta:', ruta);
      return ruta;
    }

    // Mapea sobre los pedidos para encontrar y actualizar el que tiene el id igual a `ud`
    const nuevosPedidos = ruta.pedidos.map((pedido) => {
      if (pedido.id === ud) {
        return { ...pedido, completado: dato };
      }
      return pedido;
    });

    // Retorna la ruta con los pedidos actualizados
    return { ...ruta, pedidos: nuevosPedidos };
  });

  // Actualiza el estado con los pedidos actualizados
  setPedidos(updatedPedidos);
    actualizar_pedidos(ud, "completado", dato, doc);
  };
  const completadoSwitch = (rowData) => {
    return (
      <InputSwitch
        checked={rowData.completado}
        onChange={(e) => completarpedido(e.value, rowData.id)}
      />
    );
  };
  return (
    <div className="p-3">
      <DataTable value={data.pedidos} editMode="cell" >
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
        <Column body={(data)=>{
          return <a className="pi pi-trash trashb" style={{ color: 'red' }} onClick={()=> eliminar_pedido(data.id,documento)}></a>
        }}/>
        
      </DataTable>
    </div>
  );
};
