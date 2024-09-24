import { useState, createContext, useEffect, useMemo } from "react";
import W_OAxios from "../../config/urlW_O";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";
import axios from "axios";
const WOContextControl = createContext();

const WOProvider = ({ children }) => {
  const { token, usuario } = useControl();
  const [tokenWo, settokenWoo] = useState(process.env.REACT_APP_TOKEN_WO);
  const [listaProductosW_O, setlistaProductosW_O] = useState("");
  const [listaTerceros, setlistaTerceros] = useState("");

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

      setlistaProductosW_O(response.data.data.content.slice());
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
  const ListarTerceros = async () => {
    try {
      const body = {
        columnaOrdenar: "id",
        pagina: 0,
        registrosPorPagina: 1000,
        orden: "DESC",
        filtros: [],
        canal: 2,
        registroInicial: 0,
      };
      const response = await axios.post("/terceros/listarTerceros", body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `WO ${tokenWo}`,
        },
      });

      console.log("Respuesta:", response.data);
      setlistaTerceros(response.data.data.content);
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
  const procesarProducto = (producto) => {
    let productoProcesado = { ...producto };
  
    switch (producto.sku) {
      // Casos para Like
      case '80066': // Bandeja Like Frutos Rojos 300ml x 24u
        productoProcesado.unidades = 24;
        productoProcesado.codigoReal = '8006';
        break;
      case '80055': // Bandeja Like Limón 300ml x 24u
        productoProcesado.unidades = 24;
        productoProcesado.codigoReal = '8005';
        break;
  
      // Casos para cigarrillos por paquete (por 10 unidades)
      case '81081': 
      case '81061': 
      case '81101': 
      case '81022': // Carton Rothman Azul x10 Paquetes
      case '81041': // Carton Rothman Blanco x10 Paquetes
        productoProcesado.unidades = 10;
        productoProcesado.codigoReal = producto.sku.slice(0, 4);
        break;
  
      // Casos para cigarrillos medios (por 20 unidades)
      case '81101':
      case '81071'://luky blanko
      case '81051'://gris
      case '81031'://rtohman blanko
      case '81111'://Rothman morado
      case '81155':// Alaska
      case '81011': // Carton Rothman Azul x20 Medios
      case '81166': // Cartón Lucky Mora Ice Medio
        productoProcesado.unidades = 20;
        productoProcesado.codigoReal = producto.sku.slice(0, 4);
        break;
  
      // Casos para Postobón, bebidas surtidas y canastas
      case '19323': // Postobon Surtida *250ml x12u
        productoProcesado.unidades = 12;
        productoProcesado.codigoReal = '19323';
        break;
      case '19324': // Canasta Postobon Surtida *350ml x30u
      case '11241': // Canasta Quatro-Sprite *350ml x30u
      case '13011': // Canasta Quatro-Sprite *237ml x30u
        productoProcesado.unidades = 30;
        productoProcesado.codigoReal = producto.sku.slice(0, 5);
        break;
  
      // Casos para sixpacks
      case '08791': // Sixpack Heineken *269ml
      case '44251': // Sixpack Corona *355ml
      case '66031': // Sixpack Tecate *330ml
        productoProcesado.unidades = 6;
        productoProcesado.codigoReal = producto.sku.slice(0, 5);
        break;
  
      // Casos para Marlboro
      case '82011': // Cartón Marlboro Rojo Medios x20u
      case '82033': // Cartón Marlboro Sandia x20 Medios
        productoProcesado.unidades = 20;
        productoProcesado.codigoReal = producto.sku.slice(0, 4);
        break;
  
      // Manejo de casos surtidos especiales (por ejemplo, Quatro-Sprite)
      case '11241': // Canasta Quatro-Sprite *350ml x30u
        // Asumimos que en el caso de las canastas surtidas, hay diferentes productos, y por simplicidad se usa un solo código
        // Aquí podrías agregar la lógica para dividir los productos si lo necesitas
        productoProcesado.unidades = 30;
        productoProcesado.codigoReal = '11241';
        break;
  
      default:
        // En caso de que no haya coincidencia en el SKU
        productoProcesado.codigoReal = producto.sku;
        productoProcesado.unidades = producto.unidades || 1; // Si no se especifica, usar 1 unidad
        break;
    }
  
    return productoProcesado;
  };

  const procesarPedido = (pedido, listaProductosW_O, idTercero) => {
    const renglones = pedido.line_items.map((item) => {
      // Procesar el producto antes de hacer cualquier otra operación
      const productoProcesado = procesarProducto(item);
  
      // Buscar el producto en World Office usando el SKU real (códigoReal)
      const productoWO = listaProductosW_O.find(
        (producto) => producto.codigo === productoProcesado.codigoReal
      );
  
      if (!productoWO) {
        throw new Error(
          `Producto no encontrado en World Office para el SKU: ${productoProcesado.sku}`
        );
      }
  
      // Obtener la cantidad base del producto
      const baseUnidades = productoProcesado.unidades;
  
      // Obtener el IVA del producto
      const impuesto = productoWO.impuestos.find(
        (impuesto) => impuesto.impuesto.tipo === "IVA"
      );
      const porcentajeIVA = impuesto ? parseFloat(impuesto.valor) : 0;
  
      // Calcular el precio total sin IVA o con IVA, según si el cliente fue encontrado
      let precioTotalSinIVA = item.price;
      if (idTercero === 108) {
        // Si el cliente no fue encontrado y es 108, quitamos el IVA
        precioTotalSinIVA = porcentajeIVA ? item.price / (1 + porcentajeIVA) : item.price;
      }
  
      // Calcular el valor unitario basado en la unidad base del producto
      const valorUnitarioSinIVA = precioTotalSinIVA / baseUnidades;
  
      // Cantidad final del producto
      const cantidadFinal = item.quantity * baseUnidades;
  
      // Construir el objeto del renglón
      return {
        idInventario: productoWO.id,
        unidadMedida: productoWO.unidadMedida.codigo,
        cantidad: cantidadFinal,
        valorUnitario: valorUnitarioSinIVA.toFixed(2),
        idBodega: 1, // Ajusta según sea necesario
        porDescuento: 0, // Asume que no hay descuento
        concepto: item.name,
      };
    });
  
    return renglones;
  };
  

  const buscarTerceroPorNombreCompleto = (pedido, listaTerceros) => {
    const nombreCompletoWooCommerce = `${pedido.billing.first_name} ${pedido.billing.last_name}`.toUpperCase();
  
    // Descomponer el nombre de WooCommerce en partes
    const [nombreWooCommerce, ...apellidosWooCommerce] = nombreCompletoWooCommerce.split(' ');
  
    // Función para buscar coincidencia parcial
    const compararNombres = (nombreWoo, nombreTercero) => {
      return nombreTercero.toUpperCase().includes(nombreWoo.toUpperCase());
    };
  
    // Intentar una coincidencia exacta de nombre completo
    let terceroEncontrado = listaTerceros.find((tercero) =>
      tercero.nombreCompleto.toUpperCase() === nombreCompletoWooCommerce
    );
  
    // Si no se encuentra coincidencia exacta, probar con coincidencias parciales
    if (!terceroEncontrado) {
      terceroEncontrado = listaTerceros.find((tercero) => {
        const nombreTercero = tercero.nombreCompleto.toUpperCase().split(' ');
  
        // Coincidir solo el primer nombre y primer apellido, o si tienen más nombres, hacer pruebas adicionales
        const primerNombreCoincide = compararNombres(nombreWooCommerce, nombreTercero[0]);
        const primerApellidoCoincide = compararNombres(apellidosWooCommerce.join(' '), nombreTercero.slice(1).join(' '));
  
        return primerNombreCoincide && primerApellidoCoincide;
      });
    }
  
    // Si aún no se encuentra coincidencia, lanzar un error
    if (!terceroEncontrado) {
      return 108
      
    }
  
    return terceroEncontrado.id;
  };
  const CrearDocumentoVenta = async (pedido) => {
    try {
      ListarTerceros();
  
      console.log("pedido recibido", pedido);
      console.log("productos", pedido.line_items);
  
      // Buscar el tercero (cliente)
      const tercero = buscarTerceroPorNombreCompleto(pedido, listaTerceros);
      console.log(tercero);
  
      // Procesar los renglones de acuerdo al cliente
      const renglones = procesarPedido(pedido, listaProductosW_O, tercero);
  
      const tokenWo = process.env.REACT_APP_TOKEN_WO; // Tu token de autenticación
  
      const data = {
        concepto: "FACTURA WOO",
        fecha: new Date().toISOString().split("T")[0], // Fecha actual
        prefijo: 13, // Ajustar el prefijo según corresponda
        documentoTipo: "FV",
        idEmpresa: 2,
        idTerceroExterno: tercero === 108 ? 108 : tercero, // Asignar correctamente el tercero
        idTerceroInterno: 1,
        idFormaPago: 4,
        idMoneda: 31,
        porcentajeDescuento: false,
        porcentajeTodosRenglones: false,
        valDescuento: 0, // Asumimos un descuento global, si lo hay
        reglones: renglones, // Renglones generados
        idDetalles: renglones.map((renglon) => renglon.idInventario), // Agregar los IDs de inventario como detalles
      };
  
      const response = await axios.post(
        '/documentos/crearDocumentoVenta',
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `WO ${tokenWo}`,
          },
        }
      );
      console.log(response);
      showSuccess(response?.data?.developerMessage);
      // Aquí puedes manejar la respuesta, por ejemplo, guardar el ID del documento
    } catch (error) {
      console.log("error pedido", error);
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
      ListarTerceros,
      listaTerceros,
      setlistaTerceros,
    };
  }, [
    listaProductosW_O,
    setlistaProductosW_O,
    CrearDocumentoVenta,
    ListarProductosWO,
    ListarTerceros,
    listaTerceros,
    setlistaTerceros,
  ]);

  return (
    <WOContextControl.Provider value={contextValue}>
      {children}
    </WOContextControl.Provider>
  );
};

export { WOContextControl, WOProvider };
