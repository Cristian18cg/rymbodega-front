import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./header";
import Registrologistica from "./Archivos/registrosLogistica";
import Registrarconductor from "./Archivos/Conductores/registrarConductor";
import Registrarvehiculo from "./Archivos/Vehiculos/registrarVehiculo";
import GestionLogistica from "./GestionLogistica/gestionLogistica";
import Home from "./Archivos/home";
import useControl from "../../hooks/useControl";
import GestionSolicitudes from "./Solicitudes/gestionSolicitudes";
import Otros from "./Solicitudes/otros";

const Homelogistica = () => {
    const { jsonlogin } = useControl();

    const renderRoutes = () => {
        switch (jsonlogin.id_cargo) {
            case 1:
                return (
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/logistica" element={<GestionLogistica />} />
                        <Route path="/conductor" element={<Registrarconductor />} />
                        <Route path="/vehiculo" element={<Registrarvehiculo />} />
                        <Route path="/correo" element={<Registrologistica />} />
                    </Routes>
                );
            case 2: 
                return (
                    <Routes>
                        <Route path="/gestionar_solicitudes" element={<GestionSolicitudes />} />
                        <Route path="/otros" element={<Otros />} />
                    </Routes>
                );
            case 8:
            case 3:  
                return (
                    <Routes>
                        <Route path="/gestionar_solicitudes" element={<GestionSolicitudes />} />
                        <Route path="/otros" element={<Otros />} />
                    </Routes>
                );
            // Puedes agregar más casos según los id_cargo y sus rutas correspondientes
            default:
                return (
                    <Routes>
                        <Route path="/correo" element={<Registrologistica />} />
                    </Routes>
                );
        }
    };

    return (
        <Router>
            <Header />
            {renderRoutes()}
        </Router>
    );
}

export default Homelogistica;

