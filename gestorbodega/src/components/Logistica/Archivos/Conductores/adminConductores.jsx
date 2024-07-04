import React, { useState, useEffect } from "react";
import useContextlogistica from "../../../../hooks/useControllogistica";
import useControl from "../../../../hooks/useControl";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import ButtonBo from 'react-bootstrap/Button';
import ArchivosConductor from "./archivosConductor";
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ActualizarConductor from "./actualizarConductor";
import Registrarconductor from "./registrarConductor";
import Swal from "sweetalert2";
import { debounce } from "lodash";

const AdminConductores = () => {
  const { obtenerConductores, conductores, obtenerArchivos, eliminarConductor } = useContextlogistica();
  const { token } = useControl();
  const [gestionarArchivos, setgestionarArchivos] = useState(false);
  const [editar, seteditar] = useState(false);
  const [datosAeditar, setdatosAeditar] = useState(conductores);
  const [numero_de_documento, setnumero_de_documento] = useState();
  const [nombres, setnombres] = useState();
  const [modalcrearConductor, setmodalcrearConductor] = useState(false);
  const [eliminar, seteliminar] = useState(null);

  const delayedRequest = debounce(() => {
      if (obtenerConductores(token)) {        
      }

  }, 500);

  useEffect(() => {
    delayedRequest();
  }, [modalcrearConductor,editar,eliminar]);



  const handleEditar = (item) => {
    setdatosAeditar({ ...item })
    seteditar(true)
  }

  const handleDelete = async (id_conductor, nombres, apellidos) => {
    const result = await Swal.fire({
      title: `¿Esta seguro de eliminar a ${nombres} ${apellidos}`,
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
    });

    if (result.isConfirmed) {
      const confirmacion = await eliminarConductor(id_conductor, token)
      if (confirmacion){
        seteliminar(true)
      }
    }
    
  }


  const actionBodyTemplate = (item) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => handleEditar(item)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger"
        onClick={() => handleDelete(item.id_conductor, item.nombres, item.apellidos)} 
        />
      </React.Fragment>
    );
  };

  const handleClose = () => {
    seteditar(false);
  };

  const handleCloseArchivos = () => {
    setgestionarArchivos(false);
    setnombres("");
    setnumero_de_documento("");
  };

  const abrirArchivos = async (item) => {
    const numeroDocumento = item.numero_documento
    const confirmacion = await obtenerArchivos(token, numeroDocumento)

    if (confirmacion) {
      setnumero_de_documento(item.numero_documento);
      setgestionarArchivos(true);
      const nombres = item.nombres + " " + item.apellidos;
      setnombres(nombres)
    }
  };

  const crear = () => {
    setmodalcrearConductor(true)
  };
  const handleClosecrear = () => {
    setmodalcrearConductor(false)
  };

  return (<>
    <Container>
      <Row>
        <Col xs={12} className="d-flex justify-content-center  mb-3">
          <ButtonBo onClick={() => crear()} variant="dark" size="mg">Registrar Conductor</ButtonBo>
        </Col>
      </Row>
 
    </Container>


        <DataTable value={conductores} tableStyle={{ minWidth: '50rem' }} size="large">
          <Column
            field="numero_documento"
            header=" ver archivos"
            body={(rowData) => (
              <Button
                className="button-gestion"
                icon="pi pi-folder-open"
                onClick={() => abrirArchivos(rowData)} />
            )}
          />
          <Column field="nombres" header="Nombres" style={{ minWidth: '12rem' }}></Column>
          <Column field="apellidos" header="Apellidos" style={{ minWidth: '12rem' }}></Column>
          <Column field="tipo_de_documento" header="Tipo documento"></Column>
          <Column field="numero_documento" header="Numero de documento"></Column>
          <Column field="categoria_autorizada" header="Licencia"></Column>
          <Column field="vigencia" header="Fecha  vigencia" dataType="date" style={{ minWidth: '10rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
    {editar && (<ActualizarConductor datosOriginales={datosAeditar} handleClose={handleClose} />)}
    {gestionarArchivos && (<ArchivosConductor numero_de_documento={numero_de_documento} gestionarArchivos={gestionarArchivos} handleCloseArchivos={handleCloseArchivos} nombres={nombres} />)}
    {modalcrearConductor && (<Registrarconductor modalcrearConductor={modalcrearConductor} handleClosecrear={handleClosecrear} ></Registrarconductor>)}
  </>);
}
export default AdminConductores;