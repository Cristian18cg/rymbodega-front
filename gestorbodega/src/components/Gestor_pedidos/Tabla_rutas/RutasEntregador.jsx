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
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { InputSwitch } from "primereact/inputswitch";
import { Tag } from "primereact/tag";
import { Crear_pedido } from "../Crear_pedido";
import { PedidosRuta } from "./PedidosRuta";
import { InputNumber } from "primereact/inputnumber";
export const Rutas_entregador = ({
  documento,
  nombreentregador,
  Entregadores,
}) => {
  const {
    Pedidos,
    Listar_pedidos,
    data,
    setData,
    setPedidos,
    actualizar_pedidos,
    completar_ruta,
    Visibleagregar,
    setVisibleagregar,
  } = useControl_Pedidos();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [numruta, setnumruta] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [expandedRows, setExpandedRows] = useState(null);

  useEffect(() => {
    // Llama a la función asincrónica para obtener los datos
  }, [Pedidos]);
  const clearFilter = () => {
    /*  setFilters(null); */ // Puedes establecer el filtro como null para borrarlo
    setGlobalFilterValue(""); // // También puedes limpiar el valor del filtro global
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const renderHeader = () => {
    return (
      <Navbar expand="md" variant="" className="p-header-datatable3">
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <div className="navbar-nav me-auto mb-2 mb-md-0">
              <Button
                type="button"
                icon="pi pi-filter-slash"
                label="Limpiar"
                outlined
                className="btn btn-outline-primary color-icon mx-1 "
                onClick={clearFilter}
              />
              <div className="flex justify-content-end">
                <IconField iconPosition="left">
                  <InputIcon className="pi pi-search" />
                  <InputText
                    style={{ maxWidth: "15vw" }}
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Filtrar"
                  />
                </IconField>
              </div>
              <h5 className="text-center mx-5  mt-2">
                RUTAS {nombreentregador}
              </h5>
            </div>

            <Nav className="mr-sm-2">
              <div className="d-flex align-items-center">
                <Button
                  type="button"
                  icon="pi pi-refresh"
                  label="Recargar"
                  outlined
                  className="btn btn-outline-primary color-icon "
                  onClick={() => {
                    Listar_pedidos(documento);
                  }}
                />
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };
  const allowExpansion = () => {
    return true;
  };
  const rowExpansionTemplate = (dato) => {
    setData(dato);
    return <PedidosRuta data={dato} documento={documento} />;
  };
  const vehiculofuncion = (data) => {
    const vehiculo = data.pedidos[0].tipo_vehiculo;
    return vehiculo;
  };

  const getSeverityAcompanado = (value) => {
    switch (value) {
      case true:
        return "success";

      case false:
        return "danger";
      default:
        return null;
    }
  };
  const getvalueAcompanado = (value) => {
    switch (value) {
      case true:
        return "Si";

      case false:
        return "No";
      default:
        return null;
    }
  };
  const statusBodyAcompanado = (rowData) => {
    return (
      <Tag
        className="mx-4"
        value={getvalueAcompanado(rowData.pedidos[0].acompanado)}
        severity={getSeverityAcompanado(rowData.pedidos[0].acompanado)}
      ></Tag>
    );
  };

  const valorbase = (data) => {
    // Filtra los pedidos que pertenecen a la ruta específica
    const pedidosRuta = data.pedidos;
    // Calcula el total de valores de los pedidos
  
    const total = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(pedidosRuta[0].base);
    return total;
  };
  const valorruta = (data) => {
    // Filtra los pedidos que pertenecen a la ruta específica
    const pedidosRuta = data.pedidos;
    // Calcula el total de valores de los pedidos
    const totalPedidos = pedidosRuta.reduce(
      (acc, pedido) => acc + pedido.valor_pedido,
      0
    );
    const total = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(totalPedidos);
    return total;
  };
  const valortransferencias = (data) => {
    // Filtra los pedidos que pertenecen a la ruta específica
    const pedidosRuta = data.pedidos;
    // Calcula el total de valores de los pedidos
    const totalPedidos = pedidosRuta.reduce(
      (acc, pedido) => acc + pedido.valor_transferencia,
      0
    );
    const total = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(totalPedidos);
    return total;
  };
  const valordevuelto = (data) => {
    // Filtra los pedidos que pertenecen a la ruta específica
    const pedidosRuta = data.pedidos;
    // Calcula el total de valores de los pedidos
    const totalPedidos = pedidosRuta.reduce(
      (acc, pedido) => acc + pedido.devolucion,
      0
    );
    const total = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(totalPedidos);
    return total;
  };
  const valorfaltante = (data) => {
    // Filtra los pedidos que pertenecen a la ruta específica
    const pedidosRuta = data.pedidos;
    // Calcula el total de valores de los pedidos
    const totalPedidos = pedidosRuta.reduce(
      (acc, pedido) => acc + pedido.valor_pedido,
      0
    );
    // Calcula el total de valores transferidos
    const totalTransferencia = pedidosRuta.reduce(
      (acc, pedido) => acc + pedido.valor_transferencia,
      0
    );
    const totaldevolucion = pedidosRuta.reduce(
      (acc, pedido) => acc + pedido.devolucion,
      0
    );

    const totalefectivo = pedidosRuta.reduce(
      (acc, pedido) => acc + pedido.efectivo,
      0
    );
    // Calcula el total faltante

    const totalFaltante = totalPedidos - totalTransferencia - totaldevolucion- totalefectivo;
    const total = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(totalFaltante);
    return total;
  };
  const valorefectivo = (data) => {
    // Filtra los pedidos que pertenecen a la ruta específica
    const pedidosRuta = data.pedidos;
    // Calcula el total de valores de los pedidos
    const totalPedidos = pedidosRuta.reduce(
      (acc, pedido) => acc + pedido.efectivo,
      0
    );
    const total = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(totalPedidos);
    return total;
  };

  const completadoFuncion = (data) => {
    // Filtra los pedidos para contar los completados, los de crédito y los totales
    const totalPedidos = data.pedidos.length;
    const pedidosCompletados = data.pedidos.filter(
      (pedido) => pedido.completado
    ).length;
    const pedidosConCredito = data.pedidos.filter(
      (pedido) => pedido.credito
    ).length;

    const pedidosSumados = pedidosCompletados + pedidosConCredito;
    // Calcula el porcentaje de completado y redondea a dos decimales
    const porcentajeCompletado =
      totalPedidos > 0 ? (pedidosSumados / totalPedidos) * 100 : 0;
    const porcentajeRedondeado = Math.round(porcentajeCompletado);
  
    // Determina la clase de progreso basada en la combinación de estados de pedidos
    let progressBarClass = "progressbarpedidos";
  
    if (pedidosConCredito === totalPedidos) {
      // Todos los pedidos son con crédito
      progressBarClass = "progressbarCredito";
    } else if (pedidosCompletados === totalPedidos) {
      // Todos los pedidos están completados
      progressBarClass = "progressbarpedidos";
    } else if (pedidosConCredito + pedidosCompletados === totalPedidos) {
      // Hay una combinación de pedidos completados y pedidos con crédito
      progressBarClass = "progressbarMixto";
    }
  
    return (
      <ProgressBar
        value={porcentajeRedondeado}
        className={progressBarClass}
      />
    );
  };

  const completarRuta = (Data) => {
    completar_ruta(Data.numero_ruta, documento);
  };
  const completadoSwitch = (rowData) => {
    const todosCompletados = rowData.pedidos.every(
      (pedido) => pedido.completado
    );

    return (
      <InputSwitch
        className="mx-4"
        checked={todosCompletados}
        onChange={(e) => completarRuta(rowData)}
        disabled={todosCompletados}
      />
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

    switch (field) {
      case "efectivo":
        if (isPositiveInteger(newValue)) {
           actualizar_pedidos(rowData.pedidos[0].id, 'efectivo', newValue, documento,true, rowData.numero_ruta);

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

  return (
    <div className="row">
      <div className="col-md-12 ">
        <Dialog
          header={`Crear ruta `}
          visible={Visibleagregar}
          onHide={() => {
            setVisibleagregar(false);
          }}
          maximizable
          style={{ width: "80vw" }}
        >
          <Crear_pedido
            Entregadores={Entregadores}
            agregar={true}
            docentregador={documento}
            numruta={numruta}
          ></Crear_pedido>
        </Dialog>
        <DataTable
          sortField="numero_ruta"
          sortOrder={-1}
          rows={10}
          paginator
          rowsPerPageOptions={[10, 20, 50]}
          value={Pedidos}
          header={renderHeader()}
          filters={filters}
          globalFilterFields={["numero_ruta"]}
          emptyMessage="No se encontraron rutas"
          scrollable
          tableStyle={{ minWidth: "50rem" }}
          removableSort
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          stripedRows
          editMode="cell"
        >
          <Column expander={allowExpansion} style={{ width: "5rem" }} />
          <Column
            sortable
            field="numero_ruta"
            header="# Ruta"
            style={{ maxWidth: "5.1rem" }}
          />
          <Column
            field="numero_ruta"
            header="# Pedidos "
            body={(rowData) => {
              return rowData.pedidos.length;
            }}
          />
          <Column header="Valor Ruta" body={valorruta} />
          <Column
            field="base"
            header="Base"
            body={valorbase}
          />
          <Column header="$ Transferencias" body={valortransferencias} />
          <Column header="$ devuelto" body={valordevuelto} />
          <Column
            header="$ efectivo"
            field="efectivo"
            body={valorefectivo}
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column header="$ faltante" body={valorfaltante} />

          <Column header="Vehiculo" body={vehiculofuncion} />
          <Column header="Acompañado" body={statusBodyAcompanado} />
          <Column header="Completado" body={completadoFuncion} />
          <Column header="Completar ruta" body={completadoSwitch} />
          <Column
            body={(data) => {
              return (
                <a
                  className="pi pi-plus trashb"
                  style={{ color: "blue" }}
                  onClick={() => {
                    setnumruta(data.numero_ruta);
                    setVisibleagregar(true);
                  }}
                ></a>
              );
            }}
          />
        </DataTable>
      </div>
    </div>
  );
};
