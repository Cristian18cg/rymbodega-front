import React, { useState } from "react";
import useContextlogistica from "../../../../hooks/useControllogistica";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Modal from "react-bootstrap/Modal";
import PDFViewer from "../../../Gestion_Humana/PDFViewer";
import Container from "react-bootstrap/esm/Container";
import { InputText } from "primereact/inputtext";

const ArchivosConductor = ({
  handleCloseArchivos,
  nombres,
  gestionarArchivos,
  numero_de_documento,
}) => {
  const {  archivos } = useContextlogistica();
  const [documentos, setdocumentos] = useState(archivos);
  const [pdfBase64String, setPdfBase64String] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [nombreDocumento, setnombreDocumento] = useState(null);


  const handlePrevisualizarArchivo = async (contenidoBase64,rowData) => {
    try {
      setnombreDocumento(rowData.nombre_archivo)
      setPdfBase64String(contenidoBase64);
      setShowPdfModal(true);
    } catch (error) {
      console.error("Error al cargar la previsualización:", error);
    }
  };
  const handleclosePdf = async () => {
    setShowPdfModal(false);
    setPdfBase64String("");
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
    </div>
  );

  return (
    <>
      <Modal
        className="border border-warning "
        show={gestionarArchivos && true}
        onHide={handleCloseArchivos}
        dialogClassName="custom-modal-size"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="table-u text-dark" closeButton>
          <Modal.Title>Documentos de {nombres}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DataTable
            size="small"
            header={header}
            globalFilter={globalFilter}
            value={documentos.archivos_encontrados}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column field="nombre_archivo" header="Nombre del archivo"></Column>
            <Column
              header=""
              body={(rowData) => (
                <>
                  <Button
                    outlined
                    icon={
                      rowData.ruta_completa === null
                        ? "pi pi-eye-slash "
                        : "pi pi-eye "
                    }
                    style={{
                      fontSize: "1.2rem",
                      maxWidth: "2.5rem",
                      maxHeight: "2.5rem",
                    }}
                    className={"p-secondary"}
                    onClick={() => {
                      handlePrevisualizarArchivo(rowData.contenido_base64,rowData);
                    }}
                    disabled={rowData.ruta_completa === null}
                  />
                </>
              )}
            ></Column>
          </DataTable>
        </Modal.Body>
      </Modal>
      <Modal
        show={showPdfModal && true}
        onHide={handleclosePdf}
        size="lg"
        backdrop="static"
        keyboard={false}
        dialogClassName="custom-modal-size-pdf"
      >
        <Modal.Header className="table-u text-dark" closeButton>
          <Modal.Title>Visualizador de archivos {nombreDocumento}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal_pdf">
          <Container>
            {pdfBase64String && <PDFViewer base64String={pdfBase64String} />}
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ArchivosConductor;
