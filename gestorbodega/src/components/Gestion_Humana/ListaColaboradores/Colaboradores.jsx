import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import useControl_DocumentosIngreso from "../../../hooks/useControl_DocumentosIngreso";
import { ProgressSpinner } from "primereact/progressspinner";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import "primeicons/primeicons.css";
import useControl from "../../../hooks/useControl";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

const Colaboradores = () => {
  const {
    ListarColaboradoresGeneral,
    ListaColaboradoresGeneral,
    ActualizarInfoColaboradores,
  } = useControl_DocumentosIngreso();
  const { usuario } = useControl();

  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [statuses] = useState(["SI", "NO"]);
  const [estadoColaborador] = useState(["ACTIVO", "INACTIVO", "REINTEGRO"]);
  useEffect(() => {
    if (ListaColaboradoresGeneral.length === 0) {
      ListarColaboradoresGeneral();
    }
    // Llama a la función asincrónica para obtener los datos
  }, []);
  
  const clearFilter = () => {
    /*  setFilters(null); */ // Puedes establecer el filtro como null para borrarlo
    setGlobalFilter(""); // // También puedes limpiar el valor del filtro global
  };
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(ListaColaboradoresGeneral);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ["data"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "Colaboradores");
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
  /* Obtener color de tag segun su valor  */
  const getSeverityEstado = (value) => {
    switch (value) {
      case "REINTEGRO":
        return "info";

      case "INACTIVO":
        return "danger";

      case "ACTIVO":
        return "success";
      default:
        return null;
    }
  };
  /* Obtener que tipo de tag es segun su valor  */
  /* Obtener que tipo de tag es segun su valor  */
  const getMensaje = (value) => {
    switch (value) {
      case false:
        return "NO";

      case true:
        return "SI";
      case "SI":
        return "SI";
      case "NO":
        return "NO";
      default:
        return null;
    }
  };
  const getSeverity = (value) => {
    switch (value) {
      case false:
        return "danger";

      case true:
        return "success";
      case "SI":
        return "success";
      case "NO":
        return "danger";
      default:
        return null;
    }
  };
  const getSeverity2 = (value) => {
    switch (value) {
      case "NO":
        return "danger";

      case "SI":
        return "success";
      default:
        return null;
    }
  };
  /*  */
  const statusBodyEstado = (rowData) => {
    const mensaje = rowData;
    return <Tag value={mensaje} severity={getSeverityEstado(mensaje)} />;
  };

  const statusBody = (rowData) => {
    const mensaje = rowData;
    return <Tag value={getMensaje(mensaje)} severity={getSeverity(mensaje)} />;
  };
  /* Header principar */
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
                icon="pi pi-user-plus"
                label="Agregar colaborador"
                outlined
                className="btn btn-outline-primary color-icon "
                onClick={() => {
                  navigate("/agregar_documento");
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
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Filtrar documento, nombre o apellido"
                />
              </span>
              <h4 className="text-center ">Lista Colaboradores</h4>
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
                    ListarColaboradoresGeneral();
                  }}
                />
                <Button
                  type="button"
                  icon="pi pi-file-excel"
                  className=" btn btn-outline-primary color-icon color-icon"
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
  const onRowEditComplete = (e) => {
    let { newData, index } = e;
    ActualizarInfoColaboradores(newData,usuario);
    setGlobalFilter(newData.numero_documento)
  };

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => {
          const inputValue = e.target.value
            .toUpperCase()
            .replace(/[^A-ZÑÁÉÍÓÚ ]/g, "");
          options.editorCallback(inputValue);
        }}
      />
    );
  };

  const estadosColaborador = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={estadoColaborador}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Seleccione un estado"
        itemTemplate={(option) => {
          return (
            <Tag value={option} severity={getSeverityEstado(option)}></Tag>
          );
        }}
        
      />
    );
  };

  const estadosGeneral = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Selecciona un estado"
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity2(option)}></Tag>;
        }}
        style={{maxWidth:"7rem"}}
      />

    );
  };

  return (
    <div className="tabla-2-gestion">
      {ListaColaboradoresGeneral.length > 0 ? (
        <div className="row">
          <div className="col-md-12 ">
            <DataTable
              rows={10}
              paginator
              rowsPerPageOptions={[10, 20, 50]}
              value={ListaColaboradoresGeneral}
              header={renderHeader()}
              sortable
              globalFilter={globalFilter}
              emptyMessage="No se encontraron colaboradores"
              scrollable
              tableStyle={{ minWidth: "50rem" }}
              editMode="row"
              dataKey="id"
              onRowEditComplete={onRowEditComplete}

              removableSort
            >
              <Column
                sortable
                field="tipo_de_documento"
                header="Tipo de documento"
                body={(rowData) => rowData.tipo_de_documento}
              />
              <Column
                sortable
                field="numero_documento"
                header="Numero Documento"
                body={(rowData) => rowData.numero_documento}
              />
              <Column
                style={{ minWidth: "15rem" }}
                sortable
                editor={(options) => textEditor(options)}
                field="nombre_colaborador"
                header="Nombres"
                body={(rowData) => rowData.nombre_colaborador}
              />
              <Column
                style={{ minWidth: "15rem" }}
                sortable
                editor={(options) => textEditor(options)}
                field="apellidos"
                header="Apellidos"
                body={(rowData) => rowData.apellidos}
              />
              <Column
                sortable
                editor={(options) => textEditor(options)}
                field="cargo"
                header="Cargo"
                body={(rowData) => rowData.cargo}
              />
              <Column
                editor={(options) => estadosColaborador(options)}
                field="estadocolaborador"
                header="Estado"
                body={(rowData) => statusBodyEstado(rowData.estadocolaborador)}
              />
              <Column
                editor={(options) => estadosGeneral(options)}
                sortable
                field="primer_empleo"
                header="Primer empleo"
                body={(rowData) => statusBody(rowData.primer_empleo)}
              />
              <Column
                field="carpeta_colaborador_activo"
                header="Carpeta Activo"
                body={(rowData) =>
                  statusBody(rowData.carpeta_colaborador_activo)
                }
              />
              <Column
                field="carpeta_colaborador_retiro"
                header="Carpeta Retiro"
                body={(rowData) =>
                  statusBody(rowData.carpeta_colaborador_retiro)
                }
              />
              <Column
                field="url_carpeta"
                header="Url Carpeta"
                body={(rowData) => rowData.url_carpeta}
              />
              <Column
                rowEditor={true}
                headerStyle={{ width: "10%", minWidth: "8rem" }}
                bodyStyle={{ textAlign: "center" }}
              ></Column>
            </DataTable>
          </div>
        </div>
      ) : (
        <div className="d-flex aling-items-center ">
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

export default Colaboradores;
