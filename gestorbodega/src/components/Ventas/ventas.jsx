import Cambiarcontraseña from '../Login/cambioContraseña'
import Homeventas from "./homeventas.jsx";
import useControl from '../../hooks/useControl.jsx';

const Ventas = ({jsonlogin}) => {
    const { contraseñanueva } = useControl();
    return ( <>
    {contraseñanueva === true ? <Cambiarcontraseña jsonlogin={jsonlogin}/> : <Homeventas /> }
    </> );
}
 
export default Ventas;