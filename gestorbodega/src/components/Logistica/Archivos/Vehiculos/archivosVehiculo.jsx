import React, { useState, useEffect } from "react";
import useContextlogistica from "../../../../hooks/useControllogistica";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import Modal from "react-bootstrap/Modal";
import PDFViewer from "../../../Gestion_Humana/PDFViewer";
import Container from "react-bootstrap/esm/Container";


const ArchivosVehiculo = ({ handleCloseArchivos, placa, gestionarArchivos }) => {
    const {archivos} = useContextlogistica();
    const [documentos, setdocumentos] = useState(archivos);
    const [pdfBase64String, setPdfBase64String] = useState("");
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [nombreDocumento, setnombreDocumento] = useState(null); 
    

    const handlePrevisualizarArchivo = async (contenidoBase64,rowdata) => {
        try {
            setnombreDocumento(rowdata.nombre_archivo)
            setPdfBase64String(contenidoBase64);
            setShowPdfModal(true)
            
        } catch (error) {

            console.error("Error al cargar la previsualización:", error);
        }
    };
    const handleclosePdf = async (contenidoBase64) => {
        setShowPdfModal(false);
        setPdfBase64String("")
    };

    return (<>
        <Modal
            className="border border-warning"
            show={gestionarArchivos && true}
            onHide={handleCloseArchivos}
            size="lg"            
        >
            <Modal.Header className="table-u text-dark" closeButton>
                <Modal.Title>Documentos del vehiculo con placas {placa}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DataTable value={documentos.archivos_encontrados} tableStyle={{ minWidth: '50rem' }} size="large">
                    <Column field="nombre_archivo" header="Nombre del archivo"></Column>
                    <Column header="Previsualizar" body={
                        (rowData) => (
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
                                        handlePrevisualizarArchivo(
                                            rowData.contenido_base64, rowData
                                        );
                                    }}
                                    disabled={
                                        rowData.ruta_completa === null
                                    }
                                />
                            </>
                        )
                    }></Column>
                </DataTable>
            </Modal.Body>
        </Modal>
        <Modal
            show={showPdfModal && true}
            onHide={handleclosePdf}
            size="lg"
            backdrop="static"
            keyboard={false}
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



    </>);
}

export default ArchivosVehiculo;