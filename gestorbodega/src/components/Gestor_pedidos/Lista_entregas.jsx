import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import useControl_Pedidos from "../../hooks/useControl_Pedidos";
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
import { Crear_pedido } from "./Crear/Crear_pedido";
import {Rutas_entregador} from './Tabla_rutas/RutasEntregador'
export const Lista_entregas = () => {
  const {
    EntregadoresTotal,
    ListadoEntregadores,
    Listar_entregadores,
    Listar_entregadores_rutas,
    VisibleRuta,
    setVisibleRuta,
    VisibleRutaEntregador,
    setVisibleRutaEntregador,
    Listar_pedidos
  } = useControl_Pedidos();

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [DocEntregador, setDocEntregador] = useState("");
  const [nomEntregador, setnomEntregador] = useState("");

  const delayedRequest = debounce(() => {
    if (ListadoEntregadores?.length === 0) {
      Listar_entregadores_rutas();
    }
    if (EntregadoresTotal?.length === 0) {
      Listar_entregadores();
    }
  }, 500);
  useEffect(() => {
    // Llama a la función asincrónica para obtener los datos
    delayedRequest();
  }, []);
  /* limpia filtros */
  const clearFilter = () => {
    /*  setFilters(null); */ // Puedes establecer el filtro como null para borrarlo
    setGlobalFilterValue(""); // // También puedes limpiar el valor del filtro global
  };
  /* exporta excel */

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(ListadoEntregadores);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ["data"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "Entregas");
    });
  };
  /* guarda el excel */
  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
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
      <Navbar expand="md" variant="dark" className="p-header-datatable2 ">
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <div className="navbar-nav me-auto mb-2 mb-md-0">
              <Button
                type="button"
                icon="pi pi-plus"
                label="Crear Ruta"
                outlined
                className="btn btn-outline-primary color-icon "
                onClick={() => {
                  setVisibleRuta(true);
                }}
              />
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
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Filtrar por nombre"
                  />
                </IconField>
              </div>
              <h4 className="text-center mt-1 ">Lista entregas</h4>
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
                    Listar_entregadores_rutas();
                  }}
                />
                <Button
                  type="button"
                  icon="pi pi-file-excel"
                  className=" btn btn-outline-primary color-icon p-1"
                  outlined
                  rounded
                  onClick={exportExcel}
                  data-pr-tooltip="XLS"
                />
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };
    const valorruta = (data) => {
    // Filtra los pedidos que pertenecen a la ruta específica
    const pedidosRuta = data.total_valor;
    
    const total = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(pedidosRuta);
    return total;
  };
  return (
    <div className="row">
      <div className="col-md-12 ">
        {/* Dialog de crear ruta */}
        <Dialog
          header={`Crear ruta `}
          visible={VisibleRuta}
          onHide={() => {
            setVisibleRuta(false);
          }}
          maximizable
          style={{ width: "80vw" }}
        >
          <Crear_pedido Entregadores={EntregadoresTotal} agregar={false}></Crear_pedido>
        </Dialog>
        {/* Dialog de rutas*/}

        <Dialog
          header={`Lista rutas ${nomEntregador} `}
          visible={VisibleRutaEntregador}
          onHide={() => {
            setVisibleRutaEntregador(false);
          }}
          maximizable
          style={{ width: "98vw", height: "90vh"  }}
        >
          <Rutas_entregador documento={DocEntregador} nombreentregador={nomEntregador} Entregadores={EntregadoresTotal}/>
        </Dialog>
        <DataTable
          rows={10}
          paginator
          rowsPerPageOptions={[10, 20, 50]}
          value={ListadoEntregadores}
          header={renderHeader()}
          filters={filters}
          globalFilterFields={["nombres", "documento", "apellidos"]}
          emptyMessage="No se encontraron rutas"
          scrollable
          tableStyle={{ minWidth: "50rem" }}
          removableSort
        >
          <Column
          header="Ver pedidos"
            className="mx-3"
            body={(rowData) => {
              return ( // Asegúrate de retornar algo aquí
                <Button
                  icon="pi pi-window-maximize"
                  className="color-icon2"
                  onClick={() => {
                    setVisibleRutaEntregador(true);
                    setDocEntregador(rowData.documento);
                    setnomEntregador(rowData.entregador);
                    Listar_pedidos(rowData.documento)
                  }}
                />
              );
            }}
            style={{ maxWidth: "3rem" }}
          />

          <Column
            style={{ minWidth: "10rem" }}
            sortable
            field="entregador"
            header="Nombre Completo"
          />
           <Column header="Cantidad de creditos" field="creditos" />

           <Column header="Valor pedidos" body={valorruta} />

          <Column
            style={{ minWidth: "15rem" }}
            field="completados"
            header="Numero de pedidos"
            body={(rowData) => (
              <Knob
                readOnly
                value={rowData.completados}
                valueColor="#f80909"
                rangeColor="#ecb2b2"
                max={rowData.total_rutas}
                valueTemplate={`${rowData.completados} / ${rowData.total_rutas}`}
              />
            )}
          />
        </DataTable>
      </div>
    </div>
  );
};
