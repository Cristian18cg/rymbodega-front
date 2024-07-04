import React from "react";
import Cambiarcontraseña from '../Login/cambioContraseña'
import Homelogistica from "./homeLogistica.jsx";
import useControl from '../../hooks/useControl.jsx'
const Logistica = ({jsonlogin}) => {
    const {contraseñanueva} = useControl()

    return ( <>
    {contraseñanueva === true ? <Cambiarcontraseña jsonlogin={jsonlogin}/> : <Homelogistica /> }
    </> );
}
 
export default Logistica;