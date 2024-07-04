import React from "react";
import useControl from "../../hooks/useControl";
import HeaderJefe from "./headerJefe";
import HeaderAuxiliar from "./headerAuxiliar";
import HeaderAuxiliarBodega from "./headerAuxiliarBodega";
import Error from "../Login/error";

const Header = () => {
  const { jsonlogin } = useControl();

  const cargoType = jsonlogin.id_cargo;

  const result = (areaType) => {
    switch (areaType) {
      case 1:
        return <HeaderJefe/>
      case 2:
        return <HeaderAuxiliar/>
      case 8:
      case 3:
        return <HeaderAuxiliarBodega/>
      default: 
        return  <Error/> ;
    }
  }



  return (
    <>
      {result(cargoType)}

    </>
  );
};

export default Header;
