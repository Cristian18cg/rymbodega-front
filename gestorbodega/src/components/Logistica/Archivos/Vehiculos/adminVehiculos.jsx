import React, { useState, useEffect } from "react";
import useContextlogistica from "../../../../hooks/useControllogistica";
import useControl from "../../../../hooks/useControl";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Registrarvehiculo from "./registrarVehiculo";
import ButtonBo from "react-bootstrap/Button";
import ActualizarVehiculo from "./actualizarVehiculo";
import ArchivosVehiculo from "./archivosVehiculo";
import Swal from "sweetalert2";
import { debounce } from "lodash";

const AdminVehiculos = () => {
  const {
    obtenerVehiculos,
    vehiculos,
    obtenerArchivosPlaca,
    eliminarVehiculo,
  } = useContextlogistica();
  const { token } = useControl();
  const [modalcrearVehiculo, setmodalcrearVehiculo] = useState(false);
  const [gestionarArchivos, setgestionarArchivos] = useState(false);
  const [numero_de_placa, setnumero_de_placa] = useState();
  const [editar, seteditar] = useState(false);
  const [datosAeditar, setdatosAeditar] = useState(vehiculos);
  const [eliminar, seteliminar] = useState(null);

  const delayedRequest = debounce(() => {
    if (obtenerVehiculos(token)) {
    }
  }, 500);

  useEffect(() => {
    delayedRequest();
  }, [editar, modalcrearVehiculo, eliminar]);

  const crear = () => {
    setmodalcrearVehiculo(true);
  };

  const handleClosecrear = () => {
    setmodalcrearVehiculo(false);
  };

  const handleEditar = (item) => {
    setdatosAeditar({ ...item });
    seteditar(true);
  };
  const handleClose = () => {
    seteditar(false);
  };

  const handleDelete = async (id_vehiculo, placa) => {
    const result = await Swal.fire({
      title: `¿Esta seguro de eliminar al siguiente vehiculo ${placa}`,
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
    });

    if (result.isConfirmed) {
      const confirmacion = await eliminarVehiculo(id_vehiculo, token);
      if (confirmacion) {
        seteliminar(true);
      }
    }
  };

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
          onClick={() => handleDelete(item.id_vehiculo, item.placa)}
        />
      </React.Fragment>
    );
  };

  const abrirArchivos = async (item) => {
    const placa = item.placa;
    const confirmacion = await obtenerArchivosPlaca(token, placa);

    if (confirmacion) {
      setnumero_de_placa(item.placa);
      setgestionarArchivos(true);
    }
  };

  const handleCloseArchivos = () => {
    setgestionarArchivos(false);
    setnumero_de_placa("");
  };

  return (
    <>
      <Container>
        <Row>
          <Col xs={12} className="d-flex justify-content-center mb-3">
            <ButtonBo onClick={() => crear()} variant="dark" size="mg">
              Registrar Vehiculo
            </ButtonBo>
          </Col>
        </Row>
      </Container>

      <DataTable value={vehiculos} tableStyle={{ minWidth: "50rem" }}>
        <Column
          field="numero_documento"
          header=" ver archivos"
          body={(rowData) => (
            <Button
              className="button-gestion"
              icon="pi pi-folder-open"
              onClick={() => abrirArchivos(rowData)}
            />
          )}
        />
        <Column field="placa" header="Placa"></Column>
        <Column
          field="fecha_vencimiento_soat"
          dataType="date"
          style={{ minWidth: "10rem" }}
          header="Fecha SOAT"
        ></Column>
        <Column
          field="fecha_vencimiento_impuesto"
          dataType="date"
          style={{ minWidth: "10rem" }}
          header="Fecha Impuesto"
        ></Column>
        <Column
          field="fecha_vencimiento_tecnico_mecanica"
          dataType="date"
          style={{ minWidth: "10rem" }}
          header="Fecha tecnico mecanica"
        ></Column>
        <Column
          field="numero_licencia_transito"
          header="Numero licencioa de transito"
        ></Column>
        {/* <Column field="docsoat" header="Doc Soat"></Column>            
            <Column field="doctenicomecanica" header="Doc Tecnico mecanica"></Column>
            <Column field="doclicenciadetransito" header="Doc Licenci de transito"></Column> */}
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: "12rem" }}
        ></Column>
      </DataTable>
      {editar && (
        <ActualizarVehiculo
          datosOriginales={datosAeditar}
          handleClose={handleClose}
        />
      )}
      {gestionarArchivos && (
        <ArchivosVehiculo
          gestionarArchivos={gestionarArchivos}
          handleCloseArchivos={handleCloseArchivos}
          placa={numero_de_placa}
        />
      )}
      {modalcrearVehiculo && (
        <Registrarvehiculo
          modalcrearVehiculo={modalcrearVehiculo}
          handleClosecrear={handleClosecrear}
        />
      )}
    </>
  );
};

export default AdminVehiculos;
