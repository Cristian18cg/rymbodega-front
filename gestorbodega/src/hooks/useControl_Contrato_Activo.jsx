import { useContext } from "react";
import { CarpetaArctivoContextControl  } from "../context/gestion_humana/contratoactivoContext";

const useControlCarpetaActivo = () => {
    return useContext(CarpetaArctivoContextControl)
}

export default useControlCarpetaActivo