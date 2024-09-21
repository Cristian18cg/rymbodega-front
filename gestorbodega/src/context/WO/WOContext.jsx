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
        registrosPorPagina: 1278,
        orden: "DESC",
        filtros: [],
        canal: 2,
        registroInicial: 0,
      };
      const response = await axios.post(
        "/inventarios/listarInventarios",
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `WO ${tokenWo}`,
          },
        }
      );

      console.log("Respuestaaaaa:", response);
      console.log("Respuesta:", response.data.data.content);
      setlistaProductosW_O(response.data.data.content.slice());
      ConsultarProducto("1101");
    } catch (error) {
      FuncionErrorToken(error);

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

  const ConsultarProducto = async (codigo) => {
    try {
      const response = await axios.get(
        `/inventarios/consultaCodigo/${codigo}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `WO ${tokenWo}`,
          },
        }
      );
      console.log("Respuestaaaaa:", response);
      console.log("Respuesta:", response.data.data.content);
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
      showError(`Error al obtener el producto: ${error.message}`);
      console.error("Error al obtener el productos:", error);
    }
  };


  const CrearDocumentoVenta = async () => {
    try {
      console.log('holaz')
      const tokenWo = process.env.REACT_APP_TOKEN_WO; // Tu token de autenticación

      const data = {
        fecha: "2024-09-20", // Fecha en formato YYYY-MM-DD
        prefijo: 11, // ID del prefijo7702
        documentoTipo: "FV", // Tipo de documento (FV -> Factura Venta, etc.)
        idEmpresa: 1, // ID de la empresa registrada
        idTerceroExterno: 2, // ID del tercero externo
        idTerceroInterno: 222222222, // ID del tercero interno
        idFormaPago: 1, // ID de la forma de pago
        idMoneda: 1, // ID de la moneda registrada
        trm: 4000, // Tasa de cambio (TRM)
        porcentajeDescuento: true, // Si el descuento es por porcentaje
        porcentajeTodosRenglones: true, // Si el descuento aplica a todos los renglones
        valDescuento: 0, // Valor de descuento
        renglones: [
          {
            idInventario: 1, // ID del inventario registrado
            unidadMedida: "UND", // Código de unidad de medida
            cantidad: 10, // Cantidad del detalle
            valorUnitario: 5000, // Valor unitario del detalle
            idBodega: 1, // ID de la bodega
            porDescuento: 0, // Porcentaje de descuento del detalle si aplica
            concepto: "Venta de producto A", // Concepto del detalle
          },
        ],
        idFactura: null, // ID de la factura en caso de cruzar el documento (Opcional)
        idDetalles: [], // Si deseas ingresar detalles del documento cruzado (Opcional)
      };

      const response = await axios.post(
        `/documentos/crearDocumentoVenta`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `WO ${tokenWo}`,
          },
        }
      );

      console.log(response);
      // Aquí puedes manejar la respuesta, por ejemplo, guardar el ID del documento
    } catch (error) {
      console.log("eeror pedido", error);
      console.error("Error creando documento de venta:", error);
      // Aquí puedes manejar el error, como mostrar una notificación o mensaje al usuario
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
      CrearDocumentoVenta,
      listaProductosW_O,
      setlistaProductosW_O,
      ListarProductosWO,
    };
  }, [
    listaProductosW_O,
    setlistaProductosW_O,
    CrearDocumentoVenta,
    ListarProductosWO,
  ]);

  return (
    <WOContextControl.Provider value={contextValue}>
      {children}
    </WOContextControl.Provider>
  );
};

export { WOContextControl, WOProvider };
