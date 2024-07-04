import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../../styles/gestion_talento/styles_talento.css";
import Agregardocumento from "./documentos_ingreso/AgregarDocumento";
import Header from "./header"
import ListaColaboradores from "./documentos_ingreso/ListaColaboradores";
import CrearCarpetaDocRetiro from './documentos_retiro/CrearCarpetaDocRetiro'
import ListaDocumentosRetiro from './documentos_retiro/ListaDocumentosRetiro'
import CrearCarpeta from './documentos_activo/CrearCarpetaActivo'
import ListaDocumentosActivo from './documentos_activo/ListaDocumentosActivo'
import Home_gestion_humana from './home_gestion_humana'
import {Dashborad} from './Dashborad'
import {LogEventos} from './LogEventos'
import Colaboradores from './ListaColaboradores/Colaboradores'
import useControl from '../../hooks/useControl'
const Homerecusoshumanos = ({dataadicional}) => {
    const {jsonlogin} = useControl()
    return (<>
        {jsonlogin.id_cargo === 1 ? <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home_gestion_humana  />} />
                <Route path="/agregar_documento" element={<Agregardocumento  />} />
                <Route path="/lista_colaboradores" element={<ListaColaboradores auxiliar={false} />} />
                <Route path="/crear_carpeta_contrato_activo" element={<CrearCarpeta />} />
                <Route path="/lista_documentos_activo" element={<ListaDocumentosActivo auxiliar={false}/>}  />
                <Route path="/crear_carpeta_doc_retiro" element={<CrearCarpetaDocRetiro/>}  />
                <Route path="/lista_documentos_retiro" element={<ListaDocumentosRetiro auxiliar={false} />}  />
                <Route path="/dashboard_doc_ingreso" element={<Dashborad/>}  />
                <Route path="/log_registros" element={<LogEventos/>}  />
                <Route path="/colaboradores" element={<Colaboradores/>}  />
            </Routes>
          
        </Router>     
        : <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home_gestion_humana />} />
                <Route path="/agregar_documento" element={<Agregardocumento />} />
                <Route path="/lista_colaboradores" element={<ListaColaboradores auxiliar={true} />} />
                <Route path="/crear_carpeta_contrato_activo" element={<CrearCarpeta />} />
                <Route path="/lista_documentos_activo" element={<ListaDocumentosActivo auxiliar={true}/>} />
                <Route path="/crear_carpeta_doc_retiro" element={<CrearCarpetaDocRetiro/>}  />
                <Route path="/lista_documentos_retiro" element={<ListaDocumentosRetiro auxiliar={true} />}  />
                <Route path="/log_registros" element={<LogEventos/>}  />
                <Route path="/dashboard_doc_ingreso" element={<Dashborad/>}  />
            </Routes>
    
        </Router>}
    </>);
}

export default Homerecusoshumanos;