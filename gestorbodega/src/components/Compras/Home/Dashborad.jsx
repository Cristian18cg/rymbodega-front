import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { ProgressBar } from "primereact/progressbar";
import { Card } from "primereact/card";
import { debounce } from "lodash";
import useControl_Compras from "../../../hooks/useControl_Compras";
import { ListBox } from "primereact/listbox";
import { useNavigate } from "react-router-dom";

export const Dashborad = () => {
  const navigate = useNavigate();

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [chartDataActivo, setchartDataActivo] = useState({});
  const [chartOptionsActivo, setchartOptionsActivo] = useState({});
  const [proveedor, setproveedor] = useState([]);

  const {
    datosGrafica,
    setdatosGrafica,
    datosProveedores,
    setfiltroGlobalCompras,
  } = useControl_Compras();

  const delayedRequest = debounce(() => {
    datosProveedores();
  }, 500);

  useEffect(() => {
    if (Object.keys(datosGrafica).length > 0) {
      const arrayDatos = Object.entries(datosGrafica.archivos_por_estado).map(
        ([campo, conteo]) => ({
          campo,
          conteo,
        })
      );

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");
      const textColorSecondary = documentStyle.getPropertyValue(
        "--text-color-secondary"
      );
      const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
      const colors = [
        "#2196F3", // Azul
        "#FFEB3B", // Amarillo
        "#4CAF50", // Verde
        "#FF9800", // Naranja
        "#9C27B0", // Púrpura
        "#E91E63", // Rosa
        "#00BCD4", // Turquesa
        "#795548", // Marrón
        "#607D8B", // Gris azulado
        "#FF5722", // Anaranjado oscuro
        "#009688", // Verde esmeralda
        "#F44336", // Rojo
        "#8BC34A", // Lima
        // Puedes añadir más colores si los necesitas
      ];
      /* Funcion para colores claros */
      const lightenDarkenColor = (color, amount) => {
        let usePound = false;

        if (color[0] === "#") {
          color = color.slice(1);
          usePound = true;
        }

        let num = parseInt(color, 16);

        let r = (num >> 16) + amount;
        if (r > 255) r = 255;
        else if (r < 0) r = 0;

        let b = ((num >> 8) & 0x00ff) + amount;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;

        let g = (num & 0x0000ff) + amount;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;

        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
      };
      const lightColors = colors.map((color) => lightenDarkenColor(color, 40));
      const data = {
        labels: [
          "Camara de Comercio",
          "Rut",
          "Cedula Representante Legal",
          "Referencia Bancaria",
          "Autoevaluacion Estandares Minimos",
          "Certificacion SGSST ",
          "Carta Asignacion Responsable SGSST",
          "LicenciaSST",
        ],
        datasets: [
          {
            label: "Archivos de proveedores",
            data: arrayDatos.map((dato) => dato.conteo),
            backgroundColor: colors.map((dato) => dato),
            hoverBackgroundColor: lightColors.map((dato) => dato),
          },
        ],
      };

      const options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          tooltips: {
            mode: "index",
            intersect: false,
          },
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            stacked: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      setChartData(data);
      setChartOptions(options);

      const mensajes = [];
      datosGrafica?.lista_proveedores.forEach((elemento) => {
        // Formatear el mensaje para este elemento
        const mensajeFormateado = `${elemento.nombre_empresa} cantidad de archivos a vencer: ${elemento.archivos_a_vencer}`;
        // Crear un objeto con el mensaje formateado y asignarlo a la clave 'notificacion'
        const mensajeObjeto = {
          proveedor: mensajeFormateado,
          documento: elemento.numero_documento,
        };
        // Agregar este objeto al array de mensajes
        mensajes.push(mensajeObjeto);
      });
      setproveedor(mensajes);
    } else {
      delayedRequest();
    }
  }, [datosGrafica]);

  const listatemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <p>
          <strong>{option.top})Proveedor:</strong> {option.nombre_empresa},
          archivos a vencer: {option.archivos_a_vencer}.
        </p>
      </div>
    );
  };

  return (
    <div className=" align-items-center justify-content-center  ">
      <div className="row ">
        <div className="col-md-6 col-lg-6">
          <Card
            role="region"
            title="Top 10 proveedores con archivos a vencer"
            className="mt-3 target-dasboard d-flex"
          >
            <p>
              Archivos que se venceran este año, antes del 31 de marzo.
            </p>
            <ListBox
              value={datosGrafica.lista_proveedores}
              onChange={(e) => {
                navigate("/listar_proveedores");
                setfiltroGlobalCompras(e.value.numero_documento);
              }}
              itemTemplate={listatemplate}
              options={datosGrafica.lista_proveedores}
              optionLabel="proveedor"
              className=" border"
            />
          </Card>
        </div>
        <div className="col-md-6 col-lg-6">
          <Card
            role="region"
            title="Gráfica control de documentos de proveedor"
            className="mt-3 target-dasboard d-flex align-items-center justify-content-center"
          >
            <p className="">
            · Cantidad total de <strong> proveedores </strong>creados :
              {datosGrafica.total_proveedores}.
            </p>
            <p className="">
            · <strong>Proveedores de servicios </strong>:
              {datosGrafica.total_proveedores_servicios}
            </p>
            <p className="mb-5">
            · <strong>Proveedores de productos </strong>:
              {datosGrafica.total_proveedores_productos}
            </p>
            <p className="text-center ">
            <strong className="">Cantidad de archivos según su tipo.</strong>
            </p>
            <Chart
              ariaLabel="hola"
              type="bar"
              data={chartData}
              options={chartOptions}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
