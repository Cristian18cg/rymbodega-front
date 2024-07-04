import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../../styles/styles_compras.css";
import Header from "./header"
import CrearProveedor from './general/CrearProveedor'
import ListadoProveedores from './general/ListadoProveedores'
import LogRegistros from './general/LogRegistrosCompras'
import HomeCompras from './Home/home'
import useControl from '../../hooks/useControl'

const RouterCompras = ({dataadicional}) => {
    const {jsonlogin} = useControl()

    return (<>
        {jsonlogin.id_cargo == 1 ? <Router>
            <Header />
            <Routes>
                <Route path="/"  element={<HomeCompras  />}  />
                <Route path="/crear_proveedor"  element={<CrearProveedor  />}  />
                <Route path="/listar_proveedores"  element={<ListadoProveedores />}  />
                <Route path="/log_registro"  element={<LogRegistros />}  />
            </Routes>
          
        </Router>     
        : <Router>
            <Header />
            <Routes>
                <Route path="/" /* element={<Home_gestion_humana />} */ />
               
            </Routes>
    
        </Router>}
    </>);
}

export default RouterCompras;