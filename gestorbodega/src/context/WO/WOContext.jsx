import { useState, createContext, useEffect, useMemo } from "react";
import W_OAxios from "../../config/urlW_O";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";
import axios from "axios";
const WOContextControl = createContext();

const WOProvider = ({ children }) => {
  const { token, usuario } = useControl();
  const [listaProductosW_O, setlistaProductosW_O] = useState("");
  const [tokenWo, settokenWoo] = useState(process.env.REACT_APP_TOKEN_WO);

  const showError = (error) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 5000,
      background: "#f3f2e8f1",
      color: "black",
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: error ? error : "¡Ha ocurrido un error!",
      buttonsStyling: false,
    });
  };
  const showSuccess = (mensaje) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      background: "#f3f2e8",
      color: "black",
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: mensaje ? mensaje : "",
      buttonsStyling: false,
    });
  };

  const ListarProductosWO = async () => {
    try {
      
      const body = {
        columnaOrdenar: "id",
        pagina: 0,
        registrosPorPagina: 10,
        orden: "DESC",
        filtros: [],
        canal: 0,
        registroInicial: 0,
      };
      const response = await axios.post("/inventarios/listarInventarios", body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `WO ${tokenWo}`,
        },
      });
      console.log(response);
      console.log("Respuestaaaaa:", response.data);
    } catch (error) {
      if (error.response) {
        // La solicitud fue hecha y el servidor respondió con un estado diferente a 2xx
        console.error(
          "Error en la respuesta del servidor:",
          error.response.data
        );
        console.error("Estado:", error.response.status);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error("Error en la solicitud:", error.request);
      } else {
        // Algo ocurrió al configurar la solicitud
        console.error("Error desconocido:", error.message);
      }
  
      console.error("Error al obtener los productos:", error);
    }
  };
  /*   const ModificarProducto = async (idProducto, campo, valor) => {
    try {
      const valorComoCadena = valor.toString();
      const ConsumerKey = tokenWoo;
      const consumerSecret = tokenWoo2;

      const dataActualizacion = {
        [campo]: valorComoCadena,
      };

      const response = await wooAxios.put(
        `wp-json/wc/v3/products/${idProducto}`,
        dataActualizacion,
        {
          auth: {
            username: ConsumerKey,
            password: consumerSecret,
          },
        }
      );
      showSuccess("Producto actualizado con exito", response.data);
      return response.data; // Devuelve los datos del producto actualizado si lo necesitas
    } catch (error) {
      FuncionErrorToken(error);
      console.error("Error al actualizar el producto:", error);
      // Maneja el error según sea necesario, como mostrar una notificación al usuario.
    }
  }; */

  /* Funcion de error de token general */
  const FuncionErrorToken = (error) => {
    if (error?.response?.status === 401) {
      window.location.reload();
      showError("Tu token se vencio, por favor vuelve a iniciar sesión.");
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.error
    ) {
      showError(error?.response?.data.error);
    } else {
      showError("Ha ocurrido un error!");
    }
  };

  const contextValue = useMemo(() => {
    return {
      listaProductosW_O,
      setlistaProductosW_O,
      ListarProductosWO,
    };
  }, [listaProductosW_O, setlistaProductosW_O, ListarProductosWO]);

  return (
    <WOContextControl.Provider value={contextValue}>
      {children}
    </WOContextControl.Provider>
  );
};

export { WOContextControl, WOProvider };
