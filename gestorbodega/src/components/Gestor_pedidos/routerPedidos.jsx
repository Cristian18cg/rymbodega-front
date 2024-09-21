import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../../styles/gestion_talento/styles_talento.css";
import Header from "./header"
import {Crear_entregador} from './Crear/Crear_entregador'
import {Lista_entregas} from './Lista_entregas'
import {Historico_Entregas} from './historico_entregas/Historico_Entregas'
import useControl from '../../hooks/useControl'
import { ListaProductos } from "./Woocomerce/ListaProductos";
import {ListaPedidosWoo} from './Woocomerce/ListaPedidosWoo'
import { ProductosWO } from "./WO/ProductosWO";

import Home from "./Home";

const RouterPedidos = () => {
    const {jsonlogin} = useControl()
    return (<>
      <Router>
            <Header />
            <Routes>
             {/*    
             <Route path="/" element={<Home_gestion_humana  />} />
                <Route path="/agregar_documento" element={<Agregardocumento  />} />
                <Route path="/lista_colaboradores" element={<ListaColaboradores auxiliar={false} />} /> */}
                 < Route path="/" element={<Home />} />
                 <Route path="crear/entregador" element={<Crear_entregador  />} />
                 <Route path="lista/entregas" element={<Lista_entregas  />} />
                 <Route path="lista/historico_entregas" element={<Historico_Entregas  />} />
                 <Route path="woocomerce/productos" element={<ListaProductos  />} />
                 <Route path="worldoffice/productos" element={<ProductosWO  />} />
                 <Route path="woocomerce/pedidos" element={<ListaPedidosWoo  />} />
            </Routes>
        </Router>     
    
    </>);
}

export default RouterPedidos;