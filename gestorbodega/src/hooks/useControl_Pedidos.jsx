import { useContext } from "react";
import { PedidosContextControl  } from "../context/pedidos/PedidosContext";

const useControlPedidos = () => {
    return useContext(PedidosContextControl)
}

export default useControlPedidos