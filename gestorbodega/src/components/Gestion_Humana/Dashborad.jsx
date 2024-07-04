import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { ProgressBar } from 'primereact/progressbar';  
import { Card } from "primereact/card";
import { debounce } from "lodash";
import useControlCarpetaActivo from "../../hooks/useControl_Contrato_Activo";

export const Dashborad = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [chartDataActivo, setchartDataActivo] = useState({});
  const [chartOptionsActivo, setchartOptionsActivo] = useState({});
  const { datosGrafica1, setdatosGrafica1, datosDocumentosIngreso } =
    useControlCarpetaActivo();

    const delayedRequest = debounce(() => {
      datosDocumentosIngreso();
    }, 500)


  useEffect(() => {
    if (Object.keys(datosGrafica1).length > 0) {
      const arrayDatos = Object.entries(datosGrafica1.archivos_por_estado).map(
        ([campo, conteo]) => ({
          campo,
          conteo,
        })
      );
      const arrayDatos2 = Object.entries(
        datosGrafica1.archivos_por_estado_doc_activo
      ).map(([campo, conteo]) => ({
        campo,
        conteo,
      }));

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
          "cedula",
          "Hojas de vida",
          "AFP",
          "EPS",
          "Certificaciones laborales",
          "Certificado de cuenta",
          "Antecedentes judiciales",
          "Certificaciones de estudio",
          "Prueba de conocimiento",
          "Prueba Psicotecnica",
          "Examen medico",
          "Poligrafo",
          "Acta de Entrega",
        ],
        datasets: [
          {
            label: "Archivos de ingreso",
            data: arrayDatos.map((dato) => dato.conteo),
            backgroundColor: colors.map((dato) => dato),
            hoverBackgroundColor: lightColors.map((dato) => dato),
          },
        ],
      };
      const data2 = {
        labels: [
          "EPS",
          "ARL",
          "CCF",
          "Contrato de trabajo",
          "Autorizacion manejo de datos",
          "Acuerdo confidencialidad ",
        ],
        datasets: [
          {
            label: "Archivos",
            data: arrayDatos2.map((dato) => dato.conteo),
            backgroundColor: colors.map((dato) => dato),
            hoverBackgroundColor: lightColors.map((dato) => dato),
          },
        ],
      };
      const options = {
        indexAxis: "y",
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              fontColor: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500,
              },
            },
            grid: {
              display: false,
              drawBorder: false,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      };
      setchartDataActivo(data2);
      setChartData(data);
      setChartOptions(options);
    } else {


      delayedRequest()
      
    }
 
  }, [datosGrafica1]);

  const valueTemplate = (value) => {
    return (
        <React.Fragment>
            {value}/{ datosGrafica1.total_empleados}
        </React.Fragment>
    );
};
const valueTemplate2 = (value) => {
  return (
      <React.Fragment>
          {value}/{ datosGrafica1.total_activo}
      </React.Fragment>
  );
};


  const funcionProgreso = (valor) => {
    let value = (valor / datosGrafica1.total_empleados)*100
    return parseInt(value);
  };

  const funcionProgreso3= (valor) => {
    let value = (valor / datosGrafica1.total_colaboradores)*100
    return parseInt(value);
  };

  const funcionProgreso2 = (valor) => {
    let value = (valor / datosGrafica1.total_activo)*100
    return parseInt(value);
  };
  const funcionProgreso4= (valor) => {
    let value = (valor / datosGrafica1.total_inactivo)*100
    return parseInt(value);
  };
  return (
    <div className="align-items-center justify-content-center  ">
      <div className="row d-flex justify-content-center ">
      <div className="col-md-6 col-lg-6">
        <Card
          role="region"
          title="Progresos carpeta Documentos ingreso"
          className="mt-3 target-dasboard "
        >
          <ProgressBar
            className="barra-tabla barra-dash"
            displayValueTemplate={valueTemplate}
            value={funcionProgreso(datosGrafica1.total_colaboradores)}
          ></ProgressBar>
          <p className="progress-p">Porcentaje de avance de la creación de carpetas de documentos de ingreso frente a {datosGrafica1.total_empleados} colaboradores retirados y activos en base de datos.</p>
        </Card>
      </div>
  
      <div className="col-md-6 col-lg-6">
        <Card
          role="region"
          title="Progresos carpeta Documentos ingreso contra colaboradores activos"
          className="mt-3 target-dasboard d-flex align-items-center justify-content-center"
        >
          <ProgressBar
            className="barra-tabla barra-dash"
          
            value={funcionProgreso2(datosGrafica1.total_colaboradores)}
       
          ></ProgressBar>
          <p className="progress-p">Porcentaje de avance de la creación de carpetas de documentos de ingreso frente a {datosGrafica1.total_activo} colaboradores activos en base de datos.</p>
        </Card>
      </div>
    
    </div>
    <div className="row d-flex justify-content-center ">
     
      <div className="col-md-6 col-lg-6">
        <Card
          role="region"
          title="Progreso carpetas documentos contrato activo"
          className="mt-3 target-dasboard d-flex align-items-center justify-content-center"
        >
          <ProgressBar
            className="barra-tabla barra-dash"
            value={funcionProgreso3(datosGrafica1.total_colaboradores_activos)}
          ></ProgressBar>
          <p className="progress-p">Porcentaje de avance de la creación de carpeta "documentos de colaborador activo" frente {datosGrafica1.total_colaboradores} colaboradores con carpeta de documento de ingreso creada.</p>
        </Card>
      </div>
      <div className="col-md-6 col-lg-6">
        <Card
          role="region"
          title="Progreso carpetas de 'retiro' contra colaboradores retirados"
          className="mt-3 target-dasboard d-flex align-items-center justify-content-center"
        >
          <ProgressBar
            className="barra-tabla barra-dash"
            value={funcionProgreso4(datosGrafica1.total_colaboradores_retiro)}
          ></ProgressBar>
          <p className="progress-p">Porcentaje de avance de la creación de carpeta "retiro" frente {datosGrafica1.total_inactivo} colaboradores retirados en base de datos.</p>
        </Card>
      </div>
    </div>
    <div className="row d-flex justify-content-center">
    <div className="col-md-4 col-lg-4">
        <Card
          role="region"
          title="Datos Generales"
          className="mt-3 target-dasboard d-flex align-items-center justify-content-center"
        >
          <p className="">Cantidad de colaboradores en base de datos: {datosGrafica1.total_empleados}.</p>
          <p className="">Cantidad de colaboradores ACTIVOS en base de datos: {datosGrafica1.total_activo}.</p>
          <p className="">Cantidad de colaboradores REINTREGADOS en base de datos: {datosGrafica1.total_reintegro}</p>
          <p className="">Cantidad de colaboradores INACTIVOS en base de datos: {datosGrafica1.total_inactivo}</p>
          <p className="">Cantidad de carpetas de documentos de ingreso creadas: {datosGrafica1.total_colaboradores}</p>
          <p className="">Cantidad de carpetas de contrato activo creadas: {datosGrafica1.total_colaboradores_activos}</p>
          <p className="">Cantidad de carpetas de retiro creadas: {datosGrafica1.total_colaboradores_retiro}</p>
        </Card>
      </div>
      <div className="col-md-4 col-lg-4">
        <Card
          role="region"
          title="Grafica control de carpeta documentos de ingreso"
          className="mt-3 target-dasboard d-flex align-items-center justify-content-center"
        >
          <Chart
            type="bar"
            data={chartData}
            options={chartOptions}
            className=" graficapolar"
          />
          <p className="progress-p">Cantidad de archivos por tipo de archivo cargado o aceptado en carpetas documentos de ingreso.</p>
        </Card>
      </div>
      <div className="col-md-4 col-lg-4">
        <Card
          role="region"
          title="Gráfica control de documentos contrato activo"
          className="mt-3 target-dasboard d-flex align-items-center justify-content-center"
        >
          <Chart
            type="bar"
            data={chartDataActivo}
            options={chartOptions}
            className=" graficapolar"
          />
           <p className="progress-p">Cantidad de archivos por tipo de archivo cargado o aceptado en carpetas documentos contrato activo.</p>
        </Card>
      </div>
    </div>
  </div>
  );
};
