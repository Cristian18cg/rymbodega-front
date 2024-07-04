import React from "react";
import useControl from "../../hooks/useControl";
import Sistemas from "../Sistemas/sistemas";
import RecursosHumanos from "../Gestion_Humana/recursos_humanos";
import Logistica from "../Logistica/logisitica";
import Ventas from "../Ventas/ventas";
import Error from "./error";
import Compras from '../Compras/compras';

const Home = () => {
  const { jsonlogin } = useControl();

  const areaType = jsonlogin.id_area;

  const result = (areaType) => {
    switch (areaType) {
      case 1:
        return <Sistemas />;
      case 2:
        return <Compras  jsonlogin={jsonlogin} />; 
      case 17:
        return <RecursosHumanos jsonlogin={jsonlogin} />;
      case 44:
        return <Logistica jsonlogin={jsonlogin} />;
      case 45:
          return <Ventas jsonlogin={jsonlogin} />;
      default:
        return <Error />;
    }
  };

  return <>{result(areaType)}</>;
};

export default Home;
