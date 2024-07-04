import { useContext } from "react";
import {DocumentosRetiroContextControl} from '../context/gestion_humana/DocumentosRetiroContext'

const useControlCarpetaRetiro = () => {
    return useContext(DocumentosRetiroContextControl)
}

export default useControlCarpetaRetiro