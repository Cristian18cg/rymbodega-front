import React, { useState, useEffect, useRef, Children } from "react";
import useControlCarpetaActivo from "../../../hooks/useControl_Contrato_Activo";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Navbar, Container, Nav } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
import { useNavigate, useLocation } from "react-router-dom";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import { MultiSelect } from "primereact/multiselect";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { debounce } from "lodash";

export const LogRegistrosActivo = () => {
  const navigate = useNavigate();
  const { LogRegistroActivo, setlogregistroActivo, logregistroActivo } =
    useControlCarpetaActivo();
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({
    tipo_registro: { value: null, matchMode: FilterMatchMode.EQUALS },
    nombre_responsable: { value: null, matchMode: FilterMatchMode.IN },
    colaborador_numero_documento: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
  });
  const [statuses] = useState(["CR", "ER", "MR", "AC", "NA", "NC"]);
  const [responsables, setresponsables] = useState([]);
  const [documentosColaboradores, setdocumentosColaboradores] = useState([]);
  const [docseleccionado, setdocseleccionado] = useState([]);
  const [filtrarColab, setfiltrarColab] = useState(null);


  const delayedRequest = debounce(() => {
    if (logregistroActivo.length === 0) {
      LogRegistroActivo();
    }// Envía la solicitud al servidor aquí
  }, 500);

  
  useEffect(() => {
    delayedRequest()
  }, [logregistroActivo]);

  const statusBodyTemplate = (rowData) => {
    const mensaje = rowData;
    return <Tag value={getMensaje(mensaje)} severity={getSeverity(mensaje)} />;
  };
  /* Obtener color de tag segun su valor  */
  const getSeverity = (value) => {
    switch (value) {
      case "MR" || "AC":
        return "info";

      case "ER":
        return "danger";
      case "NA":
        return "warning";

      case "CR" || "NC":
        return "success";
      default:
        return null;
    }
  };
  const getMensaje = (value) => {
    switch (value) {
      case "ER":
        return "Eliminacion de archivo";

      case "CR":
        return "Creacion";

      case "MR":
        return "Modificacion registro";
      case "NA":
        return "Nuevo archivo";
      case "AC":
        return "Actualizacion comentario";
      case "NC":
        return "Nuevo comentario";
      default:
        return null;
    }
  };

  /* Funcion para imprimir el excel */
  const exportExcel = () => {
    const data = logregistroActivo;

    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);

      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ["data"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "registros_ingreso");
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
  const renderHeader = () => {
    return (
      <Navbar
        expand="md"
        variant="dark"
        bg="dark"
        className="p-header-datatable2 bg-black"
      >
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id=" justify-content-end">
            <div className="navbar-nav me-auto mb-2 mb-md-0">
              <Button
                type="button"
                icon="pi pi-filter-slash"
                label="Limpiar"
                outlined
                className="btn btn-outline-primary color-icon mx-1 "
                onClick={() => {
                  setGlobalFilter("");
                }}
              />
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Filtrar documento, nombre o apellido"
                />
              </span>
              <h4 className="text-center ">
                Registros carpeta contrato activo
              </h4>
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
                    LogRegistroActivo();
                  }}
                />
                <Button
                  type="button"
                  icon="pi pi-file-excel"
                  className="color-icon"
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

  /* Filtro de status  */
  const statusItemTemplate = (option) => {
    return <Tag value={getMensaje(option)} severity={getSeverity(option)} />;
  };
  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Selecciona uno"
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };
  /* Obtener los posibles responsables creados */
  const obtenerResponsable = () => {
    if (responsables.length === 0) {
      const nombresUnicos = logregistroActivo.reduce(
        (nombresUnicos, registro) => {
          if (!nombresUnicos.includes(registro.nombre_responsable)) {
            nombresUnicos.push(registro.nombre_responsable);
          }
          return nombresUnicos;
        },
        []
      );
      setresponsables(nombresUnicos);
    }
  };

  /* Filtro de responsables */
  const responsablesItemTemplate = (option) => {
    return <p>{option}</p>;
  };
  const responsableRowFilterTemplate = (options) => {
    obtenerResponsable();

    return (
      <MultiSelect
        itemTemplate={responsablesItemTemplate}
        value={options.value}
        options={responsables}
        onChange={(e) => {
          options.filterApplyCallback(e.value);
        }}
        placeholder="Responsable"
        className="p-column-filter"
        maxSelectedLabels={1}
        style={{ minWidth: "14rem" }}
      />
    );
  };
  /* Obtener los posibles responsables creados */
  const obtenerDocumento = () => {
    if (responsables.length === 0) {
      const nombresUnicos = logregistroActivo.reduce(
        (nombresUnicos, registro) => {
          if (!nombresUnicos.includes(registro.colaborador_numero_documento)) {
            nombresUnicos.push(registro.colaborador_numero_documento);
          }
          return nombresUnicos;
        },
        []
      );
      setdocumentosColaboradores(nombresUnicos);
    }
  };
  const search = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filtrarColab;

      if (!event.query.trim().length) {
        _filtrarColab = [];
      } else {
        _filtrarColab = documentosColaboradores.filter((colaborador) => {
          return colaborador.toString().startsWith(event.query);
        });
      }

      setfiltrarColab(_filtrarColab);
    }, 250);
  };
  /* Filtro de responsables */
  const documentoItemTemplate = (option) => {
    return <p>{option}</p>;
  };
  const documentoRowFilterTemplate = (options) => {
    obtenerDocumento();
    return (
      <AutoComplete
        placeholder="Escribe un numero de documento"
        className=""
        field=""
        style={{ minWidth: "8rem" }}
        value={docseleccionado}
        completeMethod={search}
        suggestions={filtrarColab}
        onChange={(e) => {
          setdocseleccionado(e.value);
          options.filterApplyCallback(e.value);
        }}
        itemTemplate={documentoItemTemplate}
      />
    );
  };

  return (
    <div className="tabla-2-gestion tabla-fondo ">
      {logregistroActivo.length > 0 ? (
        <div className="row">
          <div className="col-md-12 ">
            <DataTable
              rows={10}
              paginator
              rowsPerPageOptions={[10, 20, 50]}
              filters={filters}
              filterDisplay="row"
              globalFilterFields={[
                "tipo_registro",
                "nombre_responsable",
                "colaborador_numero_documento",
              ]}
              value={logregistroActivo}
              header={renderHeader()}
              sortable
              globalFilter={globalFilter}
              emptyMessage="No se encontraron archivos"
              scrollable
              tableStyle={{ minWidth: "50rem" }}
              removableSort
            >
              <Column
                sortable
                field="id"
                header="id"
                body={(rowData) => rowData.id}
              />
              <Column
                sortable
                field="nombre_responsable"
                header="Responsable"
                body={(rowData) => rowData.nombre_responsable}
                filterField="nombre_responsable"
                showFilterMenu={false}
                filterMenuStyle={{ width: "14rem" }}
                filter
                filterElement={responsableRowFilterTemplate}
              />
              <Column
                sortable
                field=" colaborador_numero_documento"
                header="#Documento Colaborador"
                body={(rowData) => rowData.colaborador_numero_documento}
                filterField="colaborador_numero_documento"
                showFilterMenu={false}
                filterMenuStyle={{ width: "14rem" }}
                filter
                filterElement={documentoRowFilterTemplate}
              />
              <Column
                style={{ width: "15%" }}
                field="tipo_registro"
                header="Tipo de registro"
                body={(rowData) => statusBodyTemplate(rowData.tipo_registro)}
                filter
                filterElement={statusRowFilterTemplate}
                showFilterMenu={false}
              />
              <Column
                sortable
                field="hora_registro"
                header="Hora de registro"
                body={(rowData) => rowData.hora_registro}
              />
              <Column
                field="descripcion_registro"
                header="Descripcion"
                body={(rowData) => rowData.descripcion_registro}
              />
            </DataTable>
          </div>
        </div>
      ) : (
        <div className="d-flex aling-items-center ">
          {" "}
          <ProgressSpinner
            className="spinner"
            fill="var(--surface-ground)"
            strokeWidth="8"
          />
        </div>
      )}
    </div>
  );
};
