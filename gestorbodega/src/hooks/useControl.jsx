import { useContext } from "react";
import { ContextControl  } from "../context/login/loginContext";

const useControl = () => {
    return useContext(ContextControl)
}

export default useControl