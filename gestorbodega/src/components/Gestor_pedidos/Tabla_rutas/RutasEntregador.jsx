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
import { debounce } from "lodash";
import { Dialog } from "primereact/dialog";
import { Knob } from "primereact/knob";
import { ProgressBar } from 'primereact/progressbar';

import { PedidosRuta } from "./PedidosRuta";
export const Rutas_entregador = ({ documento, nombreentregador }) => {
  const { Pedidos, Listar_pedidos } = useControl_Pedidos();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [expandedRows, setExpandedRows] = useState(null);

  useEffect(() => {
    // Llama a la función asincrónica para obtener los datos
    console.log(Pedidos);
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
  const rowExpansionTemplate = (data) => {
    return <PedidosRuta data={data} />;
  };
  const vehiculofuncion = (data) => {
    const vehiculo = data.pedidos[0].tipo_vehiculo;
    return vehiculo;
  };

  const acompañadofuncion = (data) => {
    const acompañado = data.pedidos[0].acompanado;
    return acompañado;
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
  const valorfaltante = (data) => {
    // Filtra los pedidos que pertenecen a la ruta específica
    const pedidosRuta = data.pedidos;
    // Calcula el total de valores de los pedidos
    const totalPedidos = pedidosRuta.reduce((acc, pedido) => acc + pedido.valor_pedido, 0);
    // Calcula el total de valores transferidos
    const totalTransferencia = pedidosRuta.reduce((acc, pedido) => acc + pedido.valor_transferencia, 0);
    // Calcula el total faltante
    const totalFaltante = totalPedidos - totalTransferencia;
    const total = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(totalFaltante);
    return total;
  };

  const valueTemplate = (value) => {
    return (
        <React.Fragment>
            {value}/<b>100</b>
        </React.Fragment>
    );
};
const completadoFuncion = (data) => {
  // Filtra los pedidos para contar los completados y los totales
  const totalPedidos = data.pedidos.length;
  const pedidosCompletados = data.pedidos.filter(pedido => pedido.completado).length;
  
  // Calcula el porcentaje de completado
  const porcentajeCompletado = totalPedidos > 0 ? (pedidosCompletados / totalPedidos) * 100 : 0;
  return (
      <ProgressBar value={porcentajeCompletado} displayValueTemplate={valueTemplate} />
  );
};
  return (
    <div className="row">
      <div className="col-md-12 ">
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
        >
          <Column expander={allowExpansion} style={{ width: "5rem" }} />
          <Column sortable field="numero_ruta" header="# Ruta"style={{ maxWidth: "5.1rem" }} />
          <Column
            field="numero_ruta"
            header="# Pedidos "
            body={(rowData) => {
              return rowData.pedidos.length;
            }}
          />
          <Column header="Valor Ruta" body={valorruta} />
          <Column header="Valor transferencias" body={valortransferencias} />
          <Column header="Valor faltante" body={valorfaltante} />
          <Column header="Vehiculo" body={vehiculofuncion} />
          <Column header="Acompañado" body={acompañadofuncion} />
          <Column header="Completado" body={completadoFuncion} />
        </DataTable>
      </div>
    </div>
  );
};