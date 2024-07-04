import React from "react";
import Cambiarcontraseña from '../Login/cambioContraseña'
import RouterCompras from './Router_Compras'
import useControl from "../../hooks/useControl";

const Compras = ({jsonlogin,dataadicional}) => {
  const { contraseñanueva } = useControl();
  return (
      <>
    {contraseñanueva === true ? <Cambiarcontraseña jsonlogin={jsonlogin}/> : <RouterCompras /> }
      </>
  );
};

export default Compras;