import { useContext } from "react";
import { ComprasContextControl  } from "../context/compras/ComprasContext";

const useControlCompras = () => {
    return useContext(ComprasContextControl)
}

export default useControlCompras