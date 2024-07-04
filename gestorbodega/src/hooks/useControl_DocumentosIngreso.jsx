import { useContext } from "react";
import {DocumentosIngresoContextControl} from '../context/gestion_humana/DocumentosIngresoContext'

const useControlCarpetaIngreso = () => {
    return useContext(DocumentosIngresoContextControl)
}

export default useControlCarpetaIngreso