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
import { Chart } from 'primereact/chart';
export const Historico_Entregas = () => {
  const {
    historico_entregas,
    Listahistorico,

  } = useControl_Pedidos();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const delayedRequest = debounce(() => {
    if (Listahistorico?.length === 0) {
      historico_entregas();
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
      const worksheet = xlsx.utils.json_to_sheet(Listahistorico);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ["data"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "Historico entregas");
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
              <h4 className="text-center mt-1 ">Reporte entregas</h4>
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
                    historico_entregas();
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
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
 
    const options = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true
                }
            }
        }
    };

    setChartOptions(options);
}, []);
const datafuntion = (dato1,dato2)=>{
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
        labels: ['Tiendas', 'Mayoristas'],
        datasets: [
            {
                data: [dato1, dato2],
                backgroundColor: [
                    documentStyle.getPropertyValue('--blue-500'), 
                    documentStyle.getPropertyValue('--yellow-500'), 
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--blue-400'), 
                    documentStyle.getPropertyValue('--yellow-400'), 
                ]
            }
        ]
    }
    return data
}


  const grafica=(rowData)=>{
    return (
        <div className="card flex justify-content-center">
            <Chart type="pie" data={datafuntion(rowData.tiendas,rowData.mayoristas)} options={setChartOptions} />
        </div>
    )
  }
  return (
    <div className="row">
      <div className="col-md-12 ">
        <DataTable
          rows={10}
          paginator
          rowsPerPageOptions={[10, 20, 50]}
          value={Listahistorico}
          header={renderHeader()}
          filters={filters}
          globalFilterFields={["nombres", "documento", "apellidos"]}
          emptyMessage="No se encontraron rutas"
          scrollable
          tableStyle={{ minWidth: "50rem" }}
          removableSort
        >
          <Column
            style={{ minWidth: "10rem" }}
            sortable
            field="entregador"
            header="Nombre Completo"
          />
          <Column sortable
           header="Total pedidos" field="total_pedidos" />
          <Column sortable header="Total acompañado" field="acompanado" />
          <Column sortable header="Total mayorista" field="valor_mayoristas" />
          <Column  sortable header="Total tiendas" field="valor_tiendas" />
          <Column  sortable header="Total valor" field="total_valor" />
          <Column header="Pedidos" body={grafica}  />
        </DataTable>
      </div>
    </div>
  );
};
