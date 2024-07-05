import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../../styles/gestion_talento/styles_talento.css";
import Header from "./header"
import {Crear_entregador} from './Crear_entregador'
import useControl from '../../hooks/useControl'
const RouterPedidos = () => {
    const {jsonlogin} = useControl()
    return (<>
      <Router>
            <Header />
            <Routes>
             {/*    <Route path="/" element={<Home_gestion_humana  />} />
                <Route path="/agregar_documento" element={<Agregardocumento  />} />
                <Route path="/lista_colaboradores" element={<ListaColaboradores auxiliar={false} />} /> */}
                 <Route path="crear/entregador" element={<Crear_entregador  />} />
            </Routes>
        </Router>     
    
    </>);
}

export default RouterPedidos;