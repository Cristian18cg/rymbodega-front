import React, { useState, useEffect } from "react";
import useControl_Pedidos from "../../hooks/useControl_Pedidos";
import { debounce } from "lodash";
import { Chart } from "primereact/chart";
export const DashboardHome = () => {
  const { Estadisticas, estadisticas } = useControl_Pedidos();
  const [chartTorta, setchartTorta] = useState({});
  const [chartOptionsTorta, setChartOptionsTorta] = useState({});
  const [chartEntregadores, setchartEntregadores] = useState({});
  const [chartOptionsEntregadores, setChartOptionsEntregadores] = useState({});
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const delayedRequest = debounce(() => {
    if (estadisticas?.length === 0) {
      Estadisticas();
    }
  }, 500);
  useEffect(() => {
    // Llama a la función asincrónica para obtener- los datos
    delayedRequest();
  }, [delayedRequest]);

  const generarColores = (num) => {
    const colores = [];
    for (let i = 0; i < num; i++) {
      const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.5)`;
      colores.push(color);
    }
    return colores;
  };
  /* Grafica ventas */
  useEffect(() => {
    if (estadisticas && estadisticas.pedidos_por_dia) {
      // Extraer fechas y valores totales de pedidos por día desde las estadísticas
      const fechas = estadisticas.pedidos_por_dia.map((pedido) => pedido.fecha);
      const totales = estadisticas.pedidos_por_dia.map(
        (pedido) => pedido.total
      );

      // Generar colores para cada día
      const colores = generarColores(fechas.length);
      const borderColors = colores.map((color) => color.replace("0.5", "1")); // Bordes sólidos con transparencia 1

      // Configurar los datos para la gráfica
      const data = {
        labels: fechas, // Usamos las fechas como etiquetas
        datasets: [
          {
            label: "Ventas diarias",
            data: totales, // Valores totales de los pedidos por día
            backgroundColor: colores, // Colores generados dinámicamente
            borderColor: borderColors, // Bordes sólidos
            borderWidth: 1,
          },
        ],
      };

      const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };

      setChartData(data);
      setChartOptions(options);
    }
  }, [estadisticas]);
  /* Grafica ventas tiendas o mayoristas */
  useEffect(() => {
    if (estadisticas && estadisticas) {
      const documentStyle = getComputedStyle(document.documentElement);
      const data = {
        labels: ["Valor total mayoristas", "Valor total tiendas"],
        datasets: [
          {
            data: [
              estadisticas.total_mayoristas_mes,
              estadisticas.total_tienda_mes,
            ],
            backgroundColor: [
              documentStyle.getPropertyValue("--red-500"),
              documentStyle.getPropertyValue("--yellow-500"),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue("--red-400"),
              documentStyle.getPropertyValue("--yellow-400"),
            ],
          },
        ],
      };
      const options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
        },
      };

      setchartTorta(data);
      setChartOptionsTorta(options);
    }
  }, [estadisticas]);
  /* Grafica ventas por entregador */
  useEffect(() => {
    if (estadisticas && estadisticas.top_pedidos_entregador) {
      // Extraer los nombres y totales de los entregadores
      const nombres = estadisticas.top_pedidos_entregador.map(
        (entregador) => entregador.documento__nombres
      );
      const totales = estadisticas.top_pedidos_entregador.map(
        (entregador) => entregador.total
      );
      const colores = generarColores(totales.length);
      const borderColors = colores.map((color) => color.replace("0.2", "1"));
      const hover = colores.map((color) => color.replace("0.1", "5"));
      // Configurar los datos de la gráfica
      const data = {
        labels: nombres, // Nombres de los entregadores
        datasets: [
          {
            data: totales, // Totales de pedidos por entregador
            backgroundColor: colores,
            borderColor: borderColors,
            hoverBackgroundColor: hover,
          },
        ],
      };

      const options = {
        cutout: "60%", // Para gráficos de tipo "doughnut" o "pie"
      };

      setchartEntregadores(data); // Actualiza el estado con los datos
      setChartOptionsEntregadores(options); // Actualiza las opciones de la gráfica
    }
  }, [estadisticas]);

  return (
    <div className="row mt-2" style={{ width: "100%" }}>
      <div className="col-md-12 mt-2 " style={{ maxHeight: "30rem" }}>
      <div className="card d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "30rem", minWidth:"100%" }}> 
          <Chart type="bar" data={chartData} options={chartOptions} style={{ minHeight: "30rem",maxHeight: "30rem", minWidth:"100%" }} />
        </div>
      </div>
      <div className="col-md-6 mt-2 mb-2">
        <div className="card d-flex flex-column justify-content-center align-items-center">
          <Chart type="pie" data={chartTorta} options={chartOptionsTorta} />
        </div>
      </div>
      <div className="col-md-6 mt-2 ">
        <div className="card d-flex flex-column justify-content-center align-items-center">
          <Chart
            type="doughnut"
            data={chartEntregadores}
            options={chartOptionsEntregadores}
          />
        </div>
      </div>
    </div>
  );
};
