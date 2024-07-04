import React, { useState, useEffect } from "react";
import useControl from "../../hooks/useControl";
import { Button } from "primereact/button";
import Spinner from "react-bootstrap/Spinner";
import FormularioAcct from "./Usuarios/formularioAct";
import FormlarioCre from "./Usuarios/formularioCre";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import "../../styles/styles.css";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";

const Usuarios = () => {
  const { jsonusuarios, listarUsuarios, token } = useControl();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formUsuario, setFormUsuario] = useState(false);
  const [list, setList] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [datosEditables, setDatosEditables] = useState({});

  useEffect(() => {
    if (listarUsuarios()) {
      setTimeout(() => {
        return setList(true);
      }, 2000);
    }
  }, []);

  const handleClose = () => {
    listarUsuarios();
    setMostrarFormulario(false);
  };

  const handleClosecrear = () => {
    listarUsuarios();
    setFormUsuario(false);
  };

  const handleEditar = (item) => {
    // ("ITEM " + JSON.stringify(item));
    setDatosEditables(item);
    setMostrarFormulario(true);
  };
  const crearUsuario = (e) => {
    setFormUsuario(true);
  };
  const handleDelete = async (numero, first_name, last_name) => {
    try {
      const result = await Swal.fire({
        title: `¿Esta seguro de eliminar a ${first_name} ${last_name}`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
      });

      if (result.isConfirmed) {
        await Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        const url = `ne/sistemas/${numero}/`;
        const response = await clienteAxios.delete(url, {
          data: {
            numero_de_documento: numero,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 204) {
          listarUsuarios();
        } else {
          throw new Error("Failed to delete resource");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const header = (
    <div className="d-flex justify-content-center mr-3">
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            className="buscar"
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="   Buscar..."
          />
        </span>
      </div>
      <Button
        size="sm"
        onClick={crearUsuario}
        type="button"
        className="btn btn-dark ml-10 buscar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-plus"
          viewBox="0 0 16 16"
        >
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
        </svg>
        Crear Usuario
      </Button>
    </div>
  );

  const actionBodyTemplate = (item) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => handleEditar(item)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() =>
            handleDelete(
              item.numero_de_documento,
              item.first_name,
              item.last_name
            )
          }
        />
      </React.Fragment>
    );
  };
  return (
    <>
      <div></div>
      {list ? (
        <div className="card pt-3 pb-4 px-5">
          <div className="card">
            <DataTable
              value={jsonusuarios}
              size="small"
              tableStyle={{ minWidth: "100rem" }}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Usuarios de {first} al {last} de {totalRecords} Usuarios"
              header={header}
              globalFilter={globalFilter}
              paginator
              rows={20}
              dataKey="id"
            >
              <Column
                field="first_name"
                header="Nombres"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="last_name"
                header="Apellidos"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="email"
                header="Correo"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="tipo_de_documento"
                header="Tipo de documento"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="numero_de_documento"
                header="Numero de documento"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="nombre_area"
                header="Area"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="nombre_cargo"
                header="Cargo"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="id_area"
                header="Area"
                sortable
                style={{ minWidth: "16rem", display: "none" }}
              ></Column>
              <Column
                field="id_Cargo"
                header="Cargo"
                sortable
                style={{ minWidth: "16rem", display: "none" }}
              ></Column>
              <Column
                body={(jsonusuarios) =>
                  jsonusuarios.is_active ? "Activo" : "Inactivo"
                }
                header="Activo"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="date_joined"
                header="Fecha de registro"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                body={(jsonusuarios) =>
                  jsonusuarios.almacen_de_origen != null
                    ? jsonusuarios.almacen_de_origen
                    : "N/A"
                }
                header="Almacen de origen"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="last_login"
                header="Ultima conexion"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                body={actionBodyTemplate}
                exportable={false}
                style={{ minWidth: "12rem" }}
              ></Column>
            </DataTable>
          </div>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Spinner
            variant="warning"
            animation="border"
            role="status"
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      )}
      {mostrarFormulario && (
        <FormularioAcct
          datosOriginales={datosEditables}
          handleClose={handleClose}
        />
      )}
      {formUsuario && <FormlarioCre handleClosecrear={handleClosecrear} />}
    </>
  );
};
export default Usuarios;
