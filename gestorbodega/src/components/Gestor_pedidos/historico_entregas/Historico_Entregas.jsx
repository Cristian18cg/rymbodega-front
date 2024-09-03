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
import { Calendar } from "primereact/calendar";
import { Chart } from "primereact/chart";
import { MultiSelect } from "primereact/multiselect";
export const Historico_Entregas = () => {
  const { historico_entregas, Listahistorico } = useControl_Pedidos();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filtroFecha, setFiltroFecha] = useState();
  const [calendar, setcalendar] = useState(false);
  const [dates, setDates] = useState(null);
  const delayedRequest = debounce(() => {
    if (Listahistorico?.length === 0) {
      historico_entregas();
    }
  }, 500);
  useEffect(() => {
    // Llama a la función asincrónica para obtener los datos
    delayedRequest();
  }, []);
  useEffect(() => {
    console.log(filtroFecha);
    // Llama a la función asincrónica para obtener los datos
    if (filtroFecha?.some((filtro) => filtro.name === "Rango")) {
      setcalendar(true);
    } else {
      setcalendar(false);
    }
  }, [filtroFecha]);
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
  const fechasFil = [
    { name: "Hoy", rango: "Hoy" },
    { name: "Mes pasado", rango: "Mes pasado" },
    { name: "Este mes", rango: "Este mes" },
    { name: "Rango", rango: "Rango" },
    { name: "Trimestre", rango: "Trimestre" },
    { name: "Semestre", rango: "Semestre" },
  ];

  const obtenerRangoFechas = (rango) => {
    const hoy = new Date();
    let fechaInicio;
    let fechaFin = hoy;

    switch (rango) {
      case "Hoy":
        // Hoy
        fechaInicio = hoy;
        fechaFin = hoy;
        break;
      case "Este mes":
        // Este mes
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1); // Primer día del mes actual
        fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0); // Último día del mes actual
        break;
      case "Mes pasado":
        // Mes pasado
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        fechaFin = new Date(hoy.getFullYear(), hoy.getMonth(), 0); // Último día del mes pasado
        break;
      case "Rango":
        // Rango personalizado, aquí puedes agregar tu lógica personalizada
        fechaInicio = null;
        fechaFin = null;
        break;
      case "Trimestre":
        // Trimestre pasado
        const mesActual = hoy.getMonth();
        const trimestreActual = Math.floor((mesActual + 3) / 3);
        fechaInicio = new Date(hoy.getFullYear(), (trimestreActual - 2) * 3, 1); // Inicio del trimestre pasado
        fechaFin = new Date(hoy.getFullYear(), (trimestreActual - 1) * 3, 0); // Fin del trimestre pasado
        break;
      case "Semestre":
        // Semestre pasado
        const mesInicioSemestre = hoy.getMonth() < 6 ? 0 : 6; // Determinar si el semestre es la primera mitad o la segunda mitad del año
        const añoSemestre =
          hoy.getMonth() < 6 ? hoy.getFullYear() - 1 : hoy.getFullYear(); // Ajustar el año si estamos en la primera mitad del año
        fechaInicio = new Date(añoSemestre, mesInicioSemestre, 1); // Inicio del semestre pasado
        fechaFin = new Date(añoSemestre, mesInicioSemestre + 5, 0); // Fin del semestre pasado
        break;
      default:
        fechaInicio = null;
        fechaFin = null;
        break;
    }

    return {
      fechaInicio: fechaInicio ? fechaInicio.toISOString().split("T")[0] : null,
      fechaFin: fechaFin ? fechaFin.toISOString().split("T")[0] : null,
    };
  };

  const funcionFiltrar = () => {
    console.log(filtroFecha[0].name);
    if (filtroFecha?.some((filtro) => filtro.name === "Rango")) {
      console.log(dates[0]);
      historico_entregas(dates[0].toISOString().split("T")[0] , dates[1].toISOString().split("T")[0] );
    } else {
      const fecha = obtenerRangoFechas(filtroFecha[0].name);
      historico_entregas(fecha.fechaInicio, fecha.fechaFin);
    }
  };
  const isDisabled = () => {
    // Verifica si cada objeto en el array tiene las propiedades 'name' y 'rango' definidas
    return (
      filtroFecha?.length === 0 ||
      filtroFecha?.some((filtro) => !filtro.name || !filtro.rango)
    );
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
                <MultiSelect
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.value)}
                  options={fechasFil}
                  placeholder="Seleccione filtro de fecha"
                  selectAll={false}
                  selectionLimit={1}
                  optionLabel="name"
                  display="chip"
                />
                <Calendar
                  visible={calendar}
                  value={dates}
                  onChange={(e) => setDates(e.value)}
                  selectionMode="range"
                  readOnlyInput
                  maxDate={new Date()}
                  hideOnRangeSelection
                  style={{ maxWidth: "15vw" }}
                  className={calendar ? "mx-2" : "d-none"}
                  showButtonBar
                  locate="es"
                  showIcon
                  placeholder="Rango de fecha"
                />

                <Button
                  disabled={isDisabled()}
                  type="button"
                  icon="pi pi-filter"
                  label="Filtrar"
                  outlined
                  className="btn btn-outline-primary color-icon "
                  onClick={() => {
                    funcionFiltrar();
                  }}
                />
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
            usePointStyle: true,
          },
        },
      },
    };

    setChartOptions(options);
  }, []);
  const datafuntion = (dato1, dato2) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ["Tiendas", "Mayoristas"],
      datasets: [
        {
          data: [dato1, dato2],
          backgroundColor: [
            documentStyle.getPropertyValue("--blue-500"),
            documentStyle.getPropertyValue("--yellow-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--blue-400"),
            documentStyle.getPropertyValue("--yellow-400"),
          ],
        },
      ],
    };
    return data;
  };

  const grafica = (rowData) => {
    return (
      <Chart
        type="pie"
        data={datafuntion(rowData.tiendas, rowData.mayoristas)}
        options={setChartOptions}
        style={{ maxWidth: "10rem" }}
      />
    );
  };
  const footer = `Fecha filtrada (${Listahistorico.rango_fechas.fecha_inicio})-(${Listahistorico.rango_fechas.fecha_fin})`;

  return (
    <div className="row">
      <div className="col-md-12 ">
        <DataTable
          rows={10}
          paginator
          rowsPerPageOptions={[10, 20, 50]}
          value={Listahistorico.data}
          header={renderHeader()}
          filters={filters}
          globalFilterFields={["nombres", "documento", "apellidos"]}
          emptyMessage="No se encontraron rutas"
          scrollable
          tableStyle={{ minWidth: "50rem" }}
          removableSort
          footer={footer}
        >
          <Column
            style={{ minWidth: "10rem" }}
            sortable
            field="entregador"
            header="Nombre Completo"
          />
          <Column sortable header="Total pedidos" field="total_pedidos" />
          <Column sortable header="Total acompañado" field="acompanado" />
          <Column
            sortable
            header="Total mayorista"
            field="valor_mayoristas"
            body={(rowData) =>
              new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(rowData.valor_mayoristas)
            }
          />
          <Column
            sortable
            header="Total tiendas"
            field="valor_tiendas"
            body={(rowData) =>
              new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(rowData.valor_tiendas)
            }
          />
          <Column
            sortable
            header="Total valor"
            field="total_valor"
            body={(rowData) =>
              new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(rowData.total_valor)
            }
          />
          <Column header="Pedidos" body={grafica} />
        </DataTable>
      </div>
    </div>
  );
};
