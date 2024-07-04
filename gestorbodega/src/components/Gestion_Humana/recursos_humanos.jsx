import React from "react";
import Cambiarcontraseña from "../Login/cambioContraseña";
import Homerecusoshumanos from "./homerecursosHumanos";
import useControl from "../../hooks/useControl";
const RecursosHumanos = ({ jsonlogin, dataadicional }) => {
  const { contraseñanueva } = useControl();
  return (
    <>
      {contraseñanueva === true ? (
        <Cambiarcontraseña jsonlogin={jsonlogin} />
      ) : (
        <Homerecusoshumanos />
      )}
    </>
  );
};

export default RecursosHumanos;
