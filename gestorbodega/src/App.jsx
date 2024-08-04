import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login/login";
import { LogisticaProvider } from "./context/logistica/logisticaContext";
import { VentasProvider } from "./context/ventas/ventasContext";
import { PedidosPovider } from "./context/pedidos/PedidosContext";
import "primereact/resources/themes/saga-blue/theme.css"; // Tema
import "primereact/resources/primereact.min.css"; // Estilos base
import "primeicons/primeicons.css";
import { LoginProvider } from "./context/login/loginContext";
import { CarpetaActivoPovider } from "./context/gestion_humana/contratoactivoContext";
import { CarpetaIngresoPovider } from "./context/gestion_humana/DocumentosIngresoContext";
import { CarpetaRetiroPovider } from "./context/gestion_humana/DocumentosRetiroContext";
import { ComprasPovider } from "./context/compras/ComprasContext";
import { PrimeReactProvider } from "primereact/api";

import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
import { Tooltip } from "react-bootstrap";
        
function App() {
  const value = {
    ripple: true,
    zIndex: {
    
        modal: 1100,    // dialog, sidebar
        overlay: 1000,  // dropdown, overlaypanel
        menu: 1000,     // overlay menus
        tooltip: 1100,   // tooltip
        toast: 1200     // toast
    },
    autoZIndex: true,
    locale: 'es',
};
addLocale('es', {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Limpiar',
  startsWith:"Inicia con",
  contains:'Contiene',
  notContains:'No contiene',
  endsWith:'Finaliza con', 
  equals:'Igual',
  notEquals:'No igual',
  noFilter:'Quitar filtro',
  greaterThan:'Mayor que',
  lessThan:'Menor que',
  greaterThanOrEqual:'Mayor o igual',
  lessThanOrEqual:'Menor o igual',
  accept:'Aceptar'
  //...
});
  return (
    <PrimeReactProvider value={value}>
      <LoginProvider>
        <LogisticaProvider>
          <VentasProvider>
            <ComprasPovider>
              <CarpetaActivoPovider>
                <CarpetaIngresoPovider>
                  <CarpetaRetiroPovider>
                  <PedidosPovider>
                    <Login />
                    </PedidosPovider>
                  </CarpetaRetiroPovider>
                </CarpetaIngresoPovider>
              </CarpetaActivoPovider>
            </ComprasPovider>
          </VentasProvider>
        </LogisticaProvider>
      </LoginProvider>
    </PrimeReactProvider>
  );
}

export default App;
