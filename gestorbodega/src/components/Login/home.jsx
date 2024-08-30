import React from "react";
import useControl from "../../hooks/useControl";
import Error from "./error";
import RouterPedidos from '../Gestor_pedidos/routerPedidos'
const Home = () => {
  const { jsonlogin } = useControl();



  return <><RouterPedidos  /></>;
};

export default Home;
