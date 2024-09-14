import { useContext } from "react";
import { WOContextControl  } from "../context/WO/WOContext";

const useControlWO = () => {
    return useContext(WOContextControl)
}

export default useControlWO