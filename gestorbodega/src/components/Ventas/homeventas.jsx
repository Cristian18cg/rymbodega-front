import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./header";
import Home from "./home";
import ReporteSolicitudes from "./reporteSolicitudes";
import ListarSolicitudes from "./listarSolicitudes";
import HistoricoSolicitudes from "./HistoricoSolicitudes";
import HomeAnunciar from "./Recepcion/HomeAnunciar";
import TablaTurno from "./Recepcion/tablaTurno";
import CambioReceptor from "./Recepcion/CambioReceptor";
import useControl from "../../hooks/useControl";
const Homeventas = () => {
  const { jsonlogin } = useControl();
  const cargo = jsonlogin.id_cargo;
  console.log(cargo);
  const Layout = ({ children }) => {
    const location = useLocation();
    const hideHeaderPaths = ["/home_anunciamiento", "/tabla_turno"]; // Rutas en las que se debe ocultar el Header
    return (
      <>
        {!hideHeaderPaths.includes(location.pathname) && <Header />}
        {children}
      </>
    );
  };
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            {cargo === 9 /* Si es el cargo de recepcion */ ? (
              <>
                <Route path="/home_anunciamiento" element={<HomeAnunciar />} />
                <Route path="/tabla_turno" element={<TablaTurno />} />
                <Route path="/solicitud_cambio_receptor" element={<CambioReceptor />} />

              </>
            ) : (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/reporte" element={<ReporteSolicitudes />} />
                <Route path="/lista" element={<ListarSolicitudes />} />
                <Route
                  path="/historico_solicitudes"
                  element={<HistoricoSolicitudes />}
                />
              </>
            )}
          </Routes>
        </Layout>
      </Router>
    </>
  );
};

export default Homeventas;
