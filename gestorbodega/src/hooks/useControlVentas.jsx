import { useContext } from "react";
import { ContextVenta  } from "../context/ventas/ventasContext";

const useContextVentas = () => {
    return useContext(ContextVenta)
}

export default useContextVentas