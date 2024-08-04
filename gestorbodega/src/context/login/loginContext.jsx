import { useState, createContext, useMemo } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
const ContextControl = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [jsonlogin, setJsonlogin] = useState({});
  const [jsonusuarios, setJsonusuarios] = useState({});
  const [usuario, setUsuario] = useState("");
  const [dataadicional, setdataadicional] = useState({});
  const [token, setToken] = useState("");
  const [refresh_token, setrefresh_Token] = useState("");
  const [contraseñanueva, setcontraseñanueva] = useState(null)

  const infoAdicional = async () => {
    const response = await clienteAxios.get("ne/data/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      return false;
    } else {
      setdataadicional(response.data);
      return true;
    }
  };

  const login = async (numero_de_documento, contraseña) => {
    try {
      const response = await clienteAxios.post("users/token/", {
        username: numero_de_documento,
        password: contraseña,
      });
      const dataLogin = response.data;
      if (response.status !== 200) {
        return Swal.fire({
          icon: "error",
          title: "Contraseña incorrecta",
        });
      }else{
      setLoggedIn(true);
      setUsuario(`${dataLogin?.first_name} ${dataLogin?.last_name}`.trim() ? `${dataLogin.first_name} ${dataLogin.last_name}` : "usuario");
      setToken(dataLogin.access) 
      setrefresh_Token(dataLogin.refresh)  
    }
   /*    if (infoAdicional()) {
        setTimeout(() => {
          setUsuario(dataLogin.data.nombre);
          setJsonlogin(dataLogin.data);
          setToken(response.data.access);
          setcontraseñanueva(dataLogin.data.nuevo_usuario)
          return true;
        }, 2000);
      } */
      
    } catch (error) {
      if (error.message === "Network Error") {
        return Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor",
          text: error.message,
        });
      }

      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor " + error.response.status,
          text: error.response.data.error,
        });
        console.error(
          "Error de respuesta del servidor:",
          error.response.data.error
        );
      } else if (error.request) {
        Swal.fire({
          icon: "error",
          title: "No se recibió respuesta del servidor",
          text: error.response.data.error,
        });
        console.error(
          "No se recibió respuesta del servidor" + error.response.data
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor",
          text: error.message.error,
        });
      }
    }
  };

  const listarUsuarios = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await clienteAxios.get("ne/sistemas/", {
        headers,
      });
      const data = response.data;
      if (response.status !== 200) {
        return Swal.fire({
          icon: "error",
        });
      }
      setJsonusuarios(data); 
    } catch (error) {
      // Si hay un error en la petición
      console.error("Error:", error.response.data);
    }
  };

  const logout = async (id) => {
    try {
      
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const datos = {
       refresh: refresh_token,
      };
      const respuesta = await clienteAxios.post("users/logout/", datos, headers);
      if (respuesta.status !== 200) {
        return Swal.fire({
          icon: "error",
          title: "Error al cerrar sesion",
        });
      }

      setLoggedIn(false);
      setToken(null);
      window.location.reload();
    } catch (error) {}
  };
  const contextValue = useMemo(() => {
    return {
      // ... tus valores de contexto
      login,
      logout,
      listarUsuarios,
      isLoggedIn,
      usuario,
      contraseñanueva,
      jsonlogin,
      jsonusuarios,
      token,
      dataadicional,
    };
  }, [
    login,
    logout,
    listarUsuarios,
    isLoggedIn,
    usuario,
    contraseñanueva,
    jsonlogin,
    jsonusuarios,
    token,
    dataadicional,
  ]);

  return (
    <ContextControl.Provider value={contextValue}>
      {children}
    </ContextControl.Provider>
  );
};
export { ContextControl, LoginProvider };
