import { useState, createContext, useEffect, useMemo } from "react";
import wooAxios from "../../config/urlWoo";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";
const WoocomerceContextControl = createContext();

const WoocomercePovider = ({ children }) => {
  const { token, usuario } = useControl();
  const [listaProductos, setlistaProductos] = useState("");
  const [tokenWoo, settokenWoo] = useState(process.env.REACT_APP_WOOCOMERCE_TOKEN);
  const [tokenWoo2, settokenWoo2] = useState(process.env.REACT_APP_WOOCOMERCE_TOKEN2);

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
  /* Funcion para listar las rutas por entregador del dia */
  const ListarProductos = async () => {
    try {
      const ConsumerKey = tokenWoo;
      const consumerSecret = tokenWoo2;
      const perPage = 100; // Número máximo de productos por página permitido por WooCommerce
  
      // Solicitud inicial para obtener el número total de productos y páginas
      const initialResponse = await wooAxios.get("wp-json/wc/v3/products", {
        auth: {
          username: ConsumerKey,
          password: consumerSecret,
        },
        params: {
          per_page: perPage,
          page: 1,
        },
      });
  
      // Obtener el número total de productos desde los encabezados de respuesta
      const totalProducts = parseInt(initialResponse.headers["x-wp-total"], 10);
      const totalPages = parseInt(initialResponse.headers["x-wp-totalpages"], 10);
  
      // Crear una matriz de promesas para solicitudes a todas las páginas
      const requests = [];
      for (let page = 1; page <= totalPages; page++) {
        requests.push(
          wooAxios.get("wp-json/wc/v3/products", {
            auth: {
              username: ConsumerKey,
              password: consumerSecret,
            },
            params: {
              per_page: perPage,
              page: page,
            },
          })
        );
      }
  
      // Esperar a que todas las solicitudes se completen
      const responses = await Promise.all(requests);
  
      // Combinar todos los productos en una sola matriz
      const allProducts = responses.reduce((accumulator, response) => {
        return accumulator.concat(response.data);
      }, []);
  
      console.log(`Total de productos obtenidos: ${allProducts.length}`);
      setlistaProductos(allProducts);
    } catch (error) {
      FuncionErrorToken(error);
      console.error("Error al obtener los productos:", error);
      // Manejo adicional de errores si es necesario
    }
  };
  const ModificarProducto = async (idProducto, campo, valor) => {
    try {
      const valorComoCadena = valor.toString();
      const ConsumerKey = tokenWoo;
      const consumerSecret = tokenWoo2;
  
      const dataActualizacion = {
        [campo]: valorComoCadena,
      };
  
      const response = await wooAxios.put(`wp-json/wc/v3/products/${idProducto}`, dataActualizacion, {
        auth: {
          username: ConsumerKey,
          password: consumerSecret,
        },
      });
   showSuccess("Producto actualizado con exito", response.data)
      return response.data; // Devuelve los datos del producto actualizado si lo necesitas
    } catch (error) {
      FuncionErrorToken(error);
      console.error("Error al actualizar el producto:", error);
      // Maneja el error según sea necesario, como mostrar una notificación al usuario.
    }
  };

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
      listaProductos,
      setlistaProductos,
     ListarProductos,
     ModificarProducto
    };
  }, [listaProductos, setlistaProductos, ListarProductos]);

  return (
    <WoocomerceContextControl.Provider value={contextValue}>
      {children}
    </WoocomerceContextControl.Provider>
  );
};

export { WoocomerceContextControl, WoocomercePovider };