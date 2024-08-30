import { useContext } from "react";
import { WoocomerceContextControl  } from "../context/Woocomerce/WoocomerceContext";

const useControlWoocomerce = () => {
    return useContext(WoocomerceContextControl)
}

export default useControlWoocomerce