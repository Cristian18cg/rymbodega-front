import { useState, createContext, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import useControl_Woocomerce from "../../hooks/useControl_Woocomerce";
import axios from "axios";
const WOContextControl = createContext();
const WOProvider = ({ children }) => {
  const { CambiarEstadoPedido, ListarVentas } = useControl_Woocomerce();
  const tokenWo = process.env.REACT_APP_TOKEN_WO;
  const [listaProductosW_O, setlistaProductosW_O] = useState("");
  const [listaTerceros, setlistaTerceros] = useState("");
  const [listaventasWO, setlistaventasWO] = useState("");
  const [loadingPedido, setloadingPedido] = useState(false);
  const [loadingListar, setloadingListar] = useState(false);

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

  /* Funcion de error de token general */
  const FuncionErrorToken = useCallback((error) => {
    if (error?.response?.status === 401) {
      window.location.reload();
      showError("Tu token se vencio, por favor vuelve a iniciar sesión.");
    } else if (error.response.data) {
      showError(error?.response?.data?.developerMessage);
    } else {
      showError("Ha ocurrido un error!");
    }
  }, []);

  const ListarProductosWO = useCallback(async () => {
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
  }, [FuncionErrorToken, tokenWo]);

  const ConsultarProductosVentas = useCallback(
    async (id) => {
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

        const response = await axios.post(
          "/documentos/getRenglonesByDocumentoEncabezado/" + id,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `WO ${tokenWo}`,
            },
          }
        );

        // Asignar productos obtenidos
        const productos = response.data.data.content;

        // Calcular el total del pedido sumando el precioRenglon de cada producto
        const totalPedido = productos.reduce((total, producto) => {
          const precio = parseFloat(producto.precioRenglon) || 0; // Asegurar que el precio sea un número válido
          return total + precio;
        }, 0);

        // Retornar un objeto con los productos y el total del pedido
        return {
          productos,
          totalPedido,
        };
      } catch (error) {
        if (error.response) {
          console.error(
            "Error en la respuesta del servidor:",
            error.response.data
          );
          console.error("Estado:", error.response.status);
          if (error.response.data.developerMessage) {
            showError(
              `Error obteniendo los productos del pedido con ID: ${id} -> ${error?.response?.data?.developerMessage}`
            );
          }
        } else if (error.request) {
          console.error("Error en la solicitud:", error.request);
        } else {
          console.error("Error desconocido:", error.message);
        }

        console.error("Error al obtener los productos:", error);
      }
    },
    [tokenWo]
  );

  /*  const ListarDocumentoVenta2 = useCallback(async () => {
    try {
      const body = {
        columnaOrdenar: "fecha,id", // Cambiar a las columnas que necesitas ordenar
        pagina: 0,
        registrosPorPagina: 100, // Cambiar la cantidad de registros por página
        orden: "DESC",
        filtros: [
          {
            atributo: "documentoTipo.codigoDocumento",
            valor: "FV",
            valor2: null,
            tipoFiltro: 0,
            tipoDato: 0,
            nombreColumna: null,
            valores: null,
            clase: null,
            operador: 0,
            subGrupo: "filtro",
          },
          {
            atributo: "moneda.id",
            valor: "31",
            valor2: null,
            tipoFiltro: 0,
            tipoDato: 4,
            nombreColumna: null,
            valores: null,
            clase: null,
            operador: 0,
            subGrupo: "filtro",
          },
        ],
        canal: 0, // Cambiado el canal de 2 a 0 según el nuevo formato
        registroInicial: 0,
      };
      const response = await axios.post(
        "/documentos/listarDocumentoVenta",
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `WO ${tokenWo}`,
          },
        }
      );
      const fechaHoy = new Date().toLocaleDateString("es-CO", {
        timeZone: "America/Bogota",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      // Convertir la fecha al formato YYYY-MM-DD
      const [dia, mes, año] = fechaHoy.split("/");
      const fechaFormateada = `${año}-${mes}-${dia}`;

      /*       const fechaHoy = new Date().toISOString().split("T")[0]; */

  /*    // Filtrar los resultados para obtener solo los documentos de hoy
      const documentosDeHoy = response.data.data.content.filter((documento) => {
        return documento.fecha.startsWith(fechaFormateada); // Asegurarse de que la fecha comience con la fecha de hoy
      });
      // Iterar sobre los documentos de hoy para consultar los productos de venta
      for (const documento of documentosDeHoy) {
        const { productos, totalPedido } = await ConsultarProductosVentas(
          documento.id
        );
        // Añadir la lista de productos al documento actual
        documento.productos = productos;
        documento.totalPedido = totalPedido;
      }

      // Actualizar la lista con los documentos y productos
      setlistaventasWO(documentosDeHoy);
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

      console.error("Error al obtener las ventas:", error);
    }
  }, [ConsultarProductosVentas, FuncionErrorToken, tokenWo]);  */
  const ListarDocumentoVenta = useCallback(
    async (fechaInicio, fechaFin, actualizar) => {
      setloadingListar(true);
      try {
        const body = {
          columnaOrdenar: "fecha,id", // Cambiar a las columnas que necesitas ordenar
          pagina: 0,
          registrosPorPagina: 100, // Cambiar la cantidad de registros por página
          orden: "DESC",
          filtros: [
            {
              atributo: "documentoTipo.codigoDocumento",
              valor: "FV",
              valor2: null,
              tipoFiltro: 0,
              tipoDato: 0,
              nombreColumna: null,
              valores: null,
              clase: null,
              operador: 0,
              subGrupo: "filtro",
            },
            {
              atributo: "moneda.id",
              valor: "31",
              valor2: null,
              tipoFiltro: 0,
              tipoDato: 4,
              nombreColumna: null,
              valores: null,
              clase: null,
              operador: 0,
              subGrupo: "filtro",
            },
          ],
          canal: 0, // Cambiado el canal de 2 a 0 según el nuevo formato
          registroInicial: 0,
        };

        const response = await axios.post(
          "/documentos/listarDocumentoVenta",
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `WO ${tokenWo}`,
            },
          }
        );

        // Si no hay rango de fechas, usar la fecha de hoy
        const hoy = new Date().toLocaleDateString("es-CO", {
          timeZone: "America/Bogota",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const [dia, mes, año] = hoy.split("/");
        const fechaHoy = `${año}-${mes}-${dia}`;

        // Filtrar por la fecha de inicio y fin si están definidas, de lo contrario usar la fecha de hoy
        const documentosFiltrados = response.data.data.content.filter(
          (documento) => {
            const fechaDocumento = documento.fecha.split("T")[0];
            if (fechaInicio && fechaFin) {
              return (
                fechaDocumento >= fechaInicio && fechaDocumento <= fechaFin
              );
            } else {
              return fechaDocumento === fechaHoy;
            }
          }
        );

        // Consultar productos para cada documento
        for (const documento of documentosFiltrados) {
          try {
            // Llamada a la función para consultar los productos del documento
            const { productos = [], totalPedido = 0 } =
              await ConsultarProductosVentas(documento.id);

            // Añadir los productos y totalPedido al documento
            documento.productos = productos;
            documento.totalPedido = totalPedido;
          } catch (error) {
            console.error(
              `Error al consultar productos para el documento con ID ${documento.id}:`,
              error
            );

            // Asignar valores por defecto en caso de error
            documento.productos = [];
            documento.totalPedido = 0;
          }
        }
        setloadingListar(false);

        // Actualizar la lista con los documentos y productos
        setlistaventasWO(documentosFiltrados);
        if (actualizar) {
          showSuccess("Ventas actualizadas con exito.");
        }
      } catch (error) {
        setloadingListar(false);

        FuncionErrorToken(error);
        if (error.response) {
          console.error(
            "Error en la respuesta del servidor:",
            error.response.data
          );
        } else if (error.request) {
          console.error("Error en la solicitud:", error.request);
        } else {
          console.error("Error desconocido:", error.message);
        }
        console.error("Error al obtener las ventas:", error);
      }
    },
    [ConsultarProductosVentas, FuncionErrorToken, tokenWo]
  );

  /* Listar terceros en World Office */
  const ListarTerceros = useCallback(async () => {
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
  }, [FuncionErrorToken, tokenWo]);
  /* Eliminar factura World Office */
  const EliminarDocumentoVenta = useCallback(
    async (id) => {
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

        await axios.delete("/documentos/eliminar/" + id, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `WO ${tokenWo}`,
          },
        });
        showSuccess("Documento eliminado exitosamente");
      } catch (error) {
        FuncionErrorToken(error);

        if (error.response) {
          console.error(
            "Error en la respuesta del servidor:",
            error.response.data
          );
          console.error("Estado:", error.response.status);
        } else if (error.request) {
          console.error("Error en la solicitud:", error.request);
        } else {
          console.error("Error desconocido:", error.message);
        }

        console.error("Error al obtener los productos:", error);
      }
    },
    [FuncionErrorToken, tokenWo]
  );
  const AnularDocumentoVenta = useCallback(
    async (id) => {
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

        await axios.post("/documentos/anularDocumento/" + id, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `WO ${tokenWo}`,
          },
        });
        showSuccess("Documento anulado exitosamente");
      } catch (error) {
        FuncionErrorToken(error);

        if (error.response) {
          console.error(
            "Error en la respuesta del servidor:",
            error.response.data
          );
          console.error("Estado:", error.response.status);
        } else if (error.request) {
          console.error("Error en la solicitud:", error.request);
        } else {
          console.error("Error desconocido:", error.message);
        }

        console.error("Error al obtener los productos:", error);
      }
    },
    [FuncionErrorToken, tokenWo]
  );
  /* 
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
  }; */
  /* Procesar Producto a casos especiales */
  const procesarProducto = (producto) => {
    let productoProcesado = { ...producto };

    switch (producto.sku) {
      // Casos para Like
      case "80066": // Bandeja Like Frutos Rojos 300ml x 24u
        productoProcesado.unidades = 24;
        productoProcesado.codigoReal = "8006";
        break;
      case "80055": // Bandeja Like Limón 300ml x 24u
        productoProcesado.unidades = 24;
        productoProcesado.codigoReal = "8005";
        break;
      case "04761": // Bandeja redbull 300ml x 24u
        productoProcesado.unidades = 24;
        productoProcesado.codigoReal = "0476";
        break;
      case "04762": // Bandeja redbull 300ml x 24u
        productoProcesado.unidades = 6;
        productoProcesado.codigoReal = "0476";
        break;

      // Casos para cigarrillos por paquete (por 10 unidades)
      case "81081":
      case "81061":
      case "81101":
      case "81022": // Carton Rothman Azul x10 Paquetes
      case "81041": // Carton Rothman Blanco x10 Paquetes
        productoProcesado.codigoReal = producto.sku.slice(0, 4);
        break;
      // Casos para cigarrillos medios (por 20 unidades)
      case "81091":
      case "81101":
      case "81071": //luky blanko
      case "81051": //gris
      case "81031": //rtohman blanko
      case "81111": //Rothman morado
      case "81155": // Alaska
      case "81011": // Carton Rothman Azul x20 Medios
      case "81166": // Cartón Lucky Mora Ice Medio
        productoProcesado.codigoReal = producto.sku.slice(0, 4);
        break;
      case "81121": // Cartón Lucky Mora Ice Medio
        productoProcesado.unidades = 10;
        productoProcesado.codigoReal = producto.sku.slice(0, 4);
        break;

      // Casos para Postobón, bebidas surtidas y canastas
      case "19323": // Postobon Surtida *250ml x12u
        productoProcesado.unidades = 12;
        productoProcesado.codigoReal = "1932";
        break;
      case "19324": // Canasta Postobon Surtida *350ml x30u
        productoProcesado.unidades = 12;
        productoProcesado.codigoReal = "1907";
        break;
      case "11241": // Canasta Quatro-Sprite *350ml x30u
      case "13011": // Canasta Quatro-Sprite *237ml x30u
        productoProcesado.unidades = 30;
        productoProcesado.codigoReal = producto.sku.slice(0, 5);
        break;

      // Casos para sixpacks
      case "08791": // Sixpack Heineken *269ml
      case "44251": // Sixpack Corona *355ml
      case "66031": // Sixpack Tecate *330ml
        productoProcesado.unidades = 6;
        productoProcesado.codigoReal = producto.sku.slice(0, 5);
        break;

      // Casos para Marlboro
      case "82011": // Cartón Marlboro Rojo Medios x20u
      case "82033": // Cartón Marlboro Sandia x20 Medios
        productoProcesado.unidades = 20;
        productoProcesado.codigoReal = producto.sku.slice(0, 4);
        break;

      // Manejo de casos surtidos especiales (por ejemplo, Quatro-Sprite)
      case "11241": // Canasta Quatro-Sprite *350ml x30u
        // Asumimos que en el caso de las canastas surtidas, hay diferentes productos, y por simplicidad se usa un solo código
        // Aquí podrías agregar la lógica para dividir los productos si lo necesitas
        productoProcesado.unidades = 30;
        productoProcesado.codigoReal = "1124";
        break;

      default:
        // En caso de que no haya coincidencia en el SKU
        productoProcesado.codigoReal = producto.sku;
        productoProcesado.unidades = producto.unidades || 1; // Si no se especifica, usar 1 unidad
        break;
    }

    return productoProcesado;
  };
  /* Se crean los renglones necesarios con precios y unidades */
  const procesarPedido = useCallback(
    (pedido, listaProductosW_O, totalPedido, tercero) => {
      const renglones = pedido.line_items.map((item) => {
        // Procesar el producto antes de hacer cualquier otra operación
        const productoProcesado = procesarProducto(item);

        // Buscar el producto en World Office usando el SKU real (códigoReal)
        const productoWO = listaProductosW_O.find(
          (producto) => producto.codigo === productoProcesado.codigoReal
        );

        // Si no se encuentra el producto en World Office, omitirlo
        if (!productoWO) {
          showError(
            `Producto no encontrado en World Office para el SKU: ${productoProcesado.sku}`
          );
          return null; // Omite el producto si no lo encuentra
        }

        // Normalizar el nombre del producto y eliminar espacios adicionales
        const nombreNormalizado = item.name.replace(/\s+/g, " ").trim();

        // Usar una expresión regular para encontrar una 'x' válida seguida de un número y opcionalmente una 'u'
        const regexMultiplicador = /\sx(\d+)(u)?\b/;
        const match = nombreNormalizado.match(regexMultiplicador);

        // Si encontramos una coincidencia, usar el número después de la 'x', si no usar 1
        const baseUnidadesNombre = match ? parseInt(match[1], 10) : 1;

        // Combinar la base de unidades del procesamiento del producto con la que se obtiene del nombre (si existe)
        const baseUnidades = baseUnidadesNombre
          ? baseUnidadesNombre
          : productoProcesado.unidades;

        // Obtener el IVA del producto
        const impuesto = productoWO?.impuestos.find(
          (impuesto) => impuesto.impuesto.tipo === "IVA"
        );
        const porcentajeIVA = impuesto ? parseFloat(impuesto.valor) : 0;

        // Eliminar el IVA si el total del pedido es menor a 150,000
        let precioTotalSinIVA = item.price;
        if (tercero === 108) {
          precioTotalSinIVA = porcentajeIVA
            ? item.price / (1 + porcentajeIVA)
            : item.price;
        }

        // Calcular el valor unitario basado en la unidad base del producto
        const valorUnitarioSinIVA = precioTotalSinIVA / baseUnidades;

        // Cantidad final del producto (ejemplo: si pidieron 2 canastas de 9, queda como 2 x 9)
        const cantidadFinal = item.quantity * baseUnidades;

        // Construir el objeto del renglón
        return {
          idInventario: productoWO.id,
          unidadMedida: productoWO.unidadMedida.codigo,
          cantidad: cantidadFinal,
          valorUnitario: valorUnitarioSinIVA.toFixed(2), // Valor sin IVA y por unidad base
          idBodega: 1, // Supongamos que siempre es 1, puedes ajustarlo
          porDescuento: 0, // Asumiendo que no hay descuento
          concepto: item.name,
        };
      });

      return renglones.filter(Boolean); // Filtra los valores nulos
    },
    []
  );
  /* Buscar tercero */
  const buscarTerceroPorNombreCompleto = (pedido, listaTerceros) => {
    // Función para eliminar caracteres especiales y tildes
    const normalizarTexto = (texto) => {
      return texto
        .normalize("NFD") // Descompone los caracteres con tilde en sus componentes
        .replace(/[\u0300-\u036f]/g, "") // Elimina los símbolos diacríticos (tildes y otros)
        .toUpperCase(); // Convierte el texto a mayúsculas
    };

    // Obtener y normalizar el nombre completo del pedido de WooCommerce
    const nombreCompletoWooCommerce = normalizarTexto(
      `${pedido.billing.first_name} ${pedido.billing.last_name}`
    );

    // Dividir el nombre completo de WooCommerce en nombres y apellidos
    const partesWooCommerce = nombreCompletoWooCommerce.split(" ");
    const primerNombreWooCommerce = partesWooCommerce[0] || ""; // Primer nombre

    // Función para comparar nombres con tolerancia
    const compararNombresConTolerancia = (nombreTercero) => {
      const partesTercero = nombreTercero.split(" ");
      const primerNombreTercero = partesTercero[0] || ""; // Primer nombre del tercero

      // Verificar si el primer nombre coincide
      const primerNombreCoincide =
        primerNombreWooCommerce === primerNombreTercero;

      // Verificar coincidencias parciales en los apellidos (sin tener en cuenta el orden exacto)
      const apellidosWooCommerce = partesWooCommerce.slice(1); // Excluimos el primer nombre
      const apellidosTercero = partesTercero.slice(1); // Excluimos el primer nombre

      const apellidosCoinciden = apellidosWooCommerce.some((apellidoWoo) =>
        apellidosTercero.includes(apellidoWoo)
      );

      // Consideramos coincidencia si el primer nombre coincide y al menos un apellido coincide
      return primerNombreCoincide && apellidosCoinciden;
    };

    // Intentar encontrar coincidencia exacta de primer nombre y al menos un apellido
    let terceroEncontrado = listaTerceros.find((tercero) =>
      compararNombresConTolerancia(normalizarTexto(tercero.nombreCompleto))
    );

    // Si aún no se encuentra coincidencia, devolver un valor predeterminado
    if (!terceroEncontrado) {
      return 108;
    }

    return terceroEncontrado.id;
  };
  /* Tiket de venta */
  const TicketVenta = useCallback(
    async (id) => {
      try {
        const response = await axios.get(`/documentos/ticketDocumento/` + id, {
          headers: {
            Authorization: `WO ${tokenWo}`,
          },
          responseType: "arraybuffer", // Asegurarse de que el PDF se maneje como binario
        });

        // Crear un Blob para el PDF
        const blob = new Blob([response.data], { type: "application/pdf" });

        // Crear una URL para el Blob
        const url = window.URL.createObjectURL(blob);

        // Crear un iframe dinámicamente
        const iframe = document.createElement("iframe");
        iframe.style.display = "none"; // Esconder el iframe
        iframe.src = url;

        // Añadir el iframe al body del documento
        document.body.appendChild(iframe);

        // Esperar a que el iframe cargue el PDF y luego llamar a imprimir
        iframe.onload = () => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        };

        // Mostrar mensaje de éxito
        showSuccess("Ticket en PDF generado correctamente.");
      } catch (error) {
        if (error.response) {
          console.error(
            "Error en la respuesta del servidor:",
            error.response.data
          );
          console.error("Estado:", error.response.status);
        } else if (error.request) {
          console.error("Error en la solicitud:", error.request);
        } else {
          console.error("Error desconocido:", error.message);
        }
        showError(`Error al generar el ticket: ${error.message}`);
        console.error("Error al obtener el productos:", error);
      }
    },
    [tokenWo]
  );
  /* Contabilizar automaticamente  */
  const Contabilizar = useCallback(
    async (id) => {
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
        const response = await axios.post(
          `/documentos/contabilizarDocumento/` + id,
          body,
          {
            headers: {
              Authorization: `WO ${tokenWo}`,
            },
          }
        );
        showSuccess(response?.data?.developerMessage);
        TicketVenta(id);
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
        showError(`Error contabilizar el pedido: ${error.message}`);
        console.error("Error al obtener el productos:", error);
      }
    },
    [TicketVenta, tokenWo]
  );
  /* Generar Factura de venta  */
  const CrearDocumentoVenta = useCallback(
    async (pedido, CF) => {
      try {
        setloadingPedido(true);
        let tercero = null;
        if (!CF) {
          tercero = buscarTerceroPorNombreCompleto(pedido, listaTerceros);
        } else {
          tercero = CF;
        }

        const renglones = procesarPedido(
          pedido,
          listaProductosW_O,
          pedido.total,
          tercero
        );
        const tokenWo = process.env.REACT_APP_TOKEN_WO;
        const fechaHoy = new Date().toLocaleDateString("es-CO", {
          timeZone: "America/Bogota",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        // Convertir la fecha al formato YYYY-MM-DD
        const [dia, mes, año] = fechaHoy.split("/");
        const fechaFormateada = `${año}-${mes}-${dia}`;

        const data = {
          concepto: "FACTURA WOO",
          fecha: fechaFormateada,
          prefijo: 21,
          documentoTipo: "FV",
          idEmpresa: 2,
          idTerceroExterno: tercero === 108 ? 108 : tercero,
          idTerceroInterno: 1,
          idFormaPago: 4,
          idMoneda: 31,
          porcentajeDescuento: false,
          porcentajeTodosRenglones: false,
          valDescuento: 0,
          reglones: renglones,
          idDetalles: renglones.map((renglon) => renglon.idInventario),
        };

        const response = await axios.post(
          "/documentos/crearDocumentoVenta",
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `WO ${tokenWo}`,
            },
          }
        );

        setloadingPedido(false);
        showSuccess(response?.data?.developerMessage);
        if (pedido.status === "processing") {
          CambiarEstadoPedido("on-hold", pedido);
        }

        ListarVentas();
        /*   await new Promise((resolve) => setTimeout(resolve, 10000)); */
        Contabilizar(response.data.data.id);
      } catch (error) {
        setloadingPedido(false);

        if (error.response?.data?.developerMessage) {
          showError(error.response?.data?.developerMessage);
        } else {
          showError("Hubo un error creando el pedido, vuelva a intentar");
        }
        console.error("Error creando documento de venta:", error);
      }
    },
    [
      CambiarEstadoPedido,
      listaProductosW_O,
      listaTerceros,
      ListarVentas,
      setloadingPedido,
      Contabilizar,
      procesarPedido,
    ]
  );

  const contextValue = useMemo(() => {
    return {
      loadingPedido,
      listaProductosW_O,
      listaTerceros,
      listaventasWO,
      loadingListar,
      setloadingListar,
      EliminarDocumentoVenta,
      AnularDocumentoVenta,
      CrearDocumentoVenta,
      setlistaProductosW_O,
      ListarProductosWO,
      ListarTerceros,
      setlistaTerceros,
      setloadingPedido,
      setlistaventasWO,
      ListarDocumentoVenta,
      TicketVenta,
    };
  }, [
    listaProductosW_O,
    listaTerceros,
    loadingPedido,
    listaventasWO,
    loadingListar,
    setloadingListar,
    AnularDocumentoVenta,
    EliminarDocumentoVenta,
    setlistaProductosW_O,
    CrearDocumentoVenta,
    ListarProductosWO,
    ListarTerceros,
    setloadingPedido,
    setlistaTerceros,
    setlistaventasWO,
    ListarDocumentoVenta,
    TicketVenta,
  ]);

  return (
    <WOContextControl.Provider value={contextValue}>
      {children}
    </WOContextControl.Provider>
  );
};

export { WOContextControl, WOProvider };
