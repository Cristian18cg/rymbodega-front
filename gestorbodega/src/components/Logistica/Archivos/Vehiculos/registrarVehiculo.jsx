import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from "react-bootstrap/Modal";
import useControl from "../../../../hooks/useControl";
import useContextlogistica from "../../../../hooks/useControllogistica";
import Swal from "sweetalert2";
import { format } from 'date-fns';
 
const Registrarvehiculo = ({modalcrearVehiculo, handleClosecrear}) => {
    const { token } = useControl();
    const { crearVehiculo } = useContextlogistica();
    const [validated, setValidated] = useState(false);
    const [errorFile, setErrorfile] = useState("");
    const [data, setData] = useState({
        placa: "",
        fecha_vencimiento_soat: "",
        fecha_vencimiento_impuesto: "",
        fecha_vencimiento_tecnico_mecanica: "",
        numero_licencia_transito: "",
        docSoat: null,
        docTenicomecanica: null,
        docLicenciadetransito: null
    });
    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    const oneYearLater = maxDate.toISOString().split("T")[0];

    const handleChange = (e) => {
        let conductorData = {
            ...data,
            [e.target.name]: e.target.value,
        };
        if (e.target.type === 'number') {
            const value = e.target.value;
            if (value.length <= 15) {
                const newValue = e.target.value.replace(/[^0-9]/g, '');
                conductorData[e.target.name] = newValue;
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Excede el limite de numeros",
                    text: "por favor, revise el numero del documento",
                });
            }
        } else if (e.target.type === 'text') {
            const newValue = e.target.value.toUpperCase();
            const formattedValue = newValue.replace(/[^A-Z0-9]/g, '').slice(0, 6);
            conductorData[e.target.name] = formattedValue
        } else if (e.target.type === "file") {
            const fileType = e.target.files[0].type;
            if (fileType == 'application/pdf') {
                conductorData[e.target.name] = e.target.files[0];
                setErrorfile('');
            } else {
                conductorData[e.target.name] = "";
                e.target.value = "";

                Swal.fire({
                    icon: "error",
                    title: "Archivo no permitido",
                    text: "Elija un archivo .pdf",
                });
            }
        } else if (e.target.type === "date") {
            const fechaFormateada = format(e.target.value, 'yyyy-MM-dd');
            conductorData[e.target.name] = fechaFormateada;
        }
        setData(conductorData)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            return event.preventDefault(), event.stopPropagation(), setValidated(true);
        }
        if (form.placa.value.length < 6) {
            return Swal.fire({
                icon: "error",
                title: "Revise el numero de documento",
                text: "por favor, revise el numero del documento",
            });
        }
        const confirmacion = await crearVehiculo(data, token)
        if (confirmacion == true) {
            resetForm()
            form.placa.value = "";
            form.fechaSoat.value = "";
            form.fechaImpuesto.value = "";
            form.fechaRevision.value = "";
            form.numero_licencia_transito.value = "";
            form.soatFile.value = "";
            form.tecnicomecanicaFile.value = "";
            form.licenciaFile.value = "";
        }
    };

    const resetForm = () => {
        setData({
            placa: "",
            fecha_vencimiento_soat: "",
            fecha_vencimiento_impuesto: "",
            fecha_vencimiento_tecnico_mecanica: "",
            numero_licencia_transito: "",
            docSoat: null,
            docTenicomecanica: null,
            docLicenciadetransito: null
        });
        setValidated(false);
    };

    return (<>
        <div className='formCond'>
            <Modal
                className="border border-warning"
                show={modalcrearVehiculo}
                onHide={handleClosecrear}
                dialogClassName="modal-registrar"
                centered
            >
                <Modal.Header className="border border-warning bg-dark text-white" closeButton >
                    <Modal.Title>Agregar Vehiculo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="h-tp formCond rowform m-4 p-3 border" name="registrarConductor" noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3 ">
                            <Row >
                                <Form.Group className="mt-3 form-control-gestion" as={Col} md="6" controlId="placa" >
                                    <Form.Label>Placa</Form.Label>
                                    <Form.Control
                                        required
                                        name="placa"
                                        type="text"
                                        placeholder="Placa"
                                        onChange={handleChange}
                                        value={data.placa}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">Por favor, completa este campo</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mt-3 form-control-gestion" as={Col} md="6" controlId="numero_licencia_transito">
                                    <Form.Label>Numero de licencia de transito del vehiculo</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        name="numero_licencia_transito"
                                        placeholder="Numero de Licencia de Transito"
                                        onChange={handleChange}
                                        value={data.numero_licencia_transito}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">Por favor, completa este campo</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row >
                                <Form.Group as={Col} md="4" controlId="fechaSoat" className="form-control-gestion">
                                    <Form.Label>Fecha de vencimiento <br/>SOAT</Form.Label>
                                    <Form.Control type="date" placeholder="Fecha" required min={today} onChange={handleChange} name="fecha_vencimiento_soat"// Fecha mínima es la fecha actual
                                        max={oneYearLater} />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor, completa este campo
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
                                <Form.Group as={Col} md="4" controlId="fechaRevision" className="form-control-gestion">
                                    <Form.Label>Fecha de vencimiento de la revision tecnico mecanica</Form.Label>
                                    <Form.Control type="date" placeholder="Fecha" required min={today} onChange={handleChange} name="fecha_vencimiento_tecnico_mecanica"// Fecha mínima es la fecha actual
                                        max={oneYearLater} />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor, completa este campo
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
                                <Form.Group as={Col} md="4" controlId="fechaImpuesto" className="form-control-gestion">
                                    <Form.Label>Fecha de vencimiento del impuestos del vehiculo</Form.Label>
                                    <Form.Control type="date" placeholder="Fecha" min={today} onChange={handleChange} name="fecha_vencimiento_impuesto"// Fecha mínima es la fecha actual
                                        max={oneYearLater} />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor, completa este campo
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            {/* ARCHIVOS */}
                            <Row>
                                <Form.Group as={Col} controlId="soatFile" className="form-control-gestion mb-3">
                                    <Form.Label>Soat</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept=".pdf"
                                        size="sm"
                                        required
                                        name="docSoat"
                                        multiple={false}
                                        onChange={handleChange} />
                                    <Form.Control.Feedback type="invalid">Por favor, completa este campo</Form.Control.Feedback>
                                    {errorFile && <div className="text-danger">{errorFile}</div>}
                                </Form.Group>
                                <Form.Group as={Col} controlId="tecnicomecanicaFile" className="form-control-gestion mb-3">
                                    <Form.Label>Certificación de Revisión Técnico-Mecánica y de Gases</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept=".pdf"
                                        size="sm"
                                        required
                                        name="docTenicomecanica"
                                        multiple={false}
                                        onChange={handleChange} />
                                    <Form.Control.Feedback type="invalid">Por favor, completa este campo</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="licenciaFile" className="form-control-gestion  mb-3">
                                    <Form.Label> Licencia de tránsito</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept=".pdf"
                                        size="sm"
                                        required
                                        name="docLicenciadetransito"
                                        multiple={false}
                                        onChange={handleChange} />
                                    <Form.Control.Feedback type="invalid">Por favor, completa este campo</Form.Control.Feedback>
                                    {errorFile && <div className="text-danger">{errorFile}</div>}
                                </Form.Group>
                            </Row>
                            <Col md="5"></Col>
                            <Col md="2">
                                <Button md="2" className="md-2 button-registrar-conductor mt-4" variant="warning" type="submit" size="mg">Registrar Vehiculo</Button>
                            </Col>
                            <Col md="5" />
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </div >


    </>
    );
}

export default Registrarvehiculo;