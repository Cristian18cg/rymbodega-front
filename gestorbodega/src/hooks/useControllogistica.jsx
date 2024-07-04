import { useContext } from "react";
import { ContextLogistico  } from "../context/logistica/logisticaContext";

const useContextlogistica = () => {
    return useContext(ContextLogistico)
}

export default useContextlogistica 