import React, { useEffect, useRef, useState } from "react";

const LightBulb = ({ progress }) => {
  const bulbRef = useRef(null);
  const bulbRef2 = useRef(null);

  useEffect(() => {
    if (bulbRef.current) {
      // Actualizamos el color basado en el progreso con una transición suave
      bulbRef.current.style.fill = `rgba(253, 193, 13, ${progress / 100})`;
    }
  }, [progress]);

  useEffect(() => {
    if (bulbRef2.current) {
      // Actualizamos el color basado en el progreso con una transición suave
      bulbRef2.current.style.fill = `rgba(253, 180, 13 , ${progress / 100})`;
    }
  }, [progress]);
  // Calculamos el color de la bombilla basándonos en el progreso
  const blackToYellow = (progress) => {
    const value = progress / 100;
    const r = Math.round(253 * value);
    const g = Math.round(193 * value);
    const b = Math.round(13 * value);
    return `rgb(${r}, ${g}, ${b})`;
  };
  const blackToYellow2 = (progress) => {
    const value = progress / 100;
    const r = Math.round(253 * value);
    const g = Math.round(180 * value); // Un valor intermedio para un amarillo más claro
    const b = Math.round(13 * value);
    return `rgb(${r}, ${g}, ${b})`;
  };
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

  const updateDimensions = () => {
    const aspectRatio = 600 / 600; // Asumiendo que el SVG original tiene un aspect ratio de 1:1
    let width = window.innerWidth * 0.3; // 80% del ancho de la ventana
    let height = width / aspectRatio;
    
    // Limitar la altura al 80% de la altura de la ventana si es necesario
    if (height > window.innerHeight * 0.15) {
      height = window.innerHeight * 0.15;
      width = height * aspectRatio;
    }

    setDimensions({ width, height });
  };
  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="d-flex row justify-content-center text-center align-items-center">
      <div className="svg-container"style={{ width: '100%', height: '100%' }}>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 600 600"
          style={{ enableBackground: "new 0 0 600 600" }}
          width={dimensions.width}
          height={dimensions.height}
        >
          <g id="background"></g>
          <g id="objects">
            <g>
              <g>
                <g>
                  <ellipse
                    style={{ fill: "#DBDBDB" }}
                    cx="300"
                    cy="534.793"
                    rx="104.588"
                    ry="14.208"
                  />
                </g>
              </g>
              <g>
                <path
                  ref={bulbRef}
                  className="light-bulb"
                  style={{ fill: blackToYellow(progress) }} // Usamos blackToYellow aquí para cambiar el color de negro a amarillo según el progreso
                  d="M435.995,186.014c0.22,30.926-9.883,59.482-27.068,82.433
                c-21.043,28.103-32.929,61.996-32.929,97.104v4.452c0,16.569-13.431,30-30,30h-92c-16.569,0-30-13.431-30-30v-2.959
                c0-35.773-11.975-70.352-33.29-99.082c-16.783-22.622-26.71-50.631-26.71-80.96c0-75.441,61.428-136.537,136.995-135.996
                C375.022,51.536,435.469,111.985,435.995,186.014z"
                />
                <path
                  style={{ fill: "#575553" }}
                  d="M355.998,418.003h-112c-3.314,0-6-2.686-6-6v-6c0-3.314,2.686-6,6-6h112c3.314,0,6,2.686,6,6v6
                C361.998,415.316,359.312,418.003,355.998,418.003z"
                />
                <path
                  style={{ fill: "#575553" }}
                  d="M355.998,436.003h-112c-3.314,0-6-2.686-6-6v-6c0-3.314,2.686-6,6-6h112c3.314,0,6,2.686,6,6v6
                C361.998,433.316,359.312,436.003,355.998,436.003z"
                />
                <path
                  style={{ fill: "#575553" }}
                  d="M355.998,454.003h-112c-3.314,0-6-2.686-6-6v-6c0-3.314,2.686-6,6-6h112c3.314,0,6,2.686,6,6v6
                C361.998,451.316,359.312,454.003,355.998,454.003z"
                />
                <path
                  style={{ fill: "#575553" }}
                  d="M355.998,472.003h-112c-3.314,0-6-2.686-6-6v-6c0-3.314,2.686-6,6-6h112c3.314,0,6,2.686,6,6v6
                C361.998,469.316,359.312,472.003,355.998,472.003z"
                />
                <path
                  style={{ fill: "#575553" }}
                  d="M335.851,490.003h-71.706c-5.646,0-10.885-2.68-13.829-7.075l-7.318-10.925h114l-7.318,10.925
                C346.736,487.322,341.497,490.003,335.851,490.003z"
                />
                <path
                  style={{ fill: "#575553" }}
                  d="M313.16,507.003h-26.324c-6.524,0-12.603-2.94-16.147-7.808l-6.691-9.192h72l-6.691,9.192
                C325.763,504.063,319.684,507.003,313.16,507.003z"
                />
                <path
                  style={{ fill: "#423F3C" }}
                  d="M335.998,490.003l-6.69,9.19c-3.55,4.87-9.62,7.81-16.15,7.81h-26.32
                c-4.94,0-9.61-1.68-13.13-4.61c2.5,1.04,5.28,1.61,8.13,1.61h26.32c6.53,0,12.6-2.94,16.15-7.81l4.51-6.19H335.998z"
                />
                <path
                  ref={bulbRef2}
                  className="light-bulb2"
                  style={{ fill: blackToYellow2(progress) }} // Usamos blackToYellow aquí también para cambiar el color del contorno de la bombilla según el progreso
                  d="M435.998,186.013c0.22,30.93-9.89,59.48-27.07,82.43c-21.04,28.11-32.93,62-32.93,97.11v4.45
                c0,16.57-13.43,30-30,30h-92c-16.57,0-30-13.43-30-30v-2.96c0-1.53-0.02-3.06-0.08-4.59c5.79,7.36,15.31,15.55,29.08,15.55
                c24.87,0,48.17-8.37,66.86-22.74c18.68-14.38,32.76-34.76,39.16-58.8c4.46-16.76,11.737-33.687,18.98-50.46
                c38-88,8-206-135.73-182.17c17.8-8.37,37.72-12.98,58.72-12.83C375.018,51.533,435.468,111.983,435.998,186.013z"
                />
                <path
                  style={{ fill: "#423F3C" }}
                  d="M361.998,406.003v6c0,3.31-2.69,6-6,6h-112c-3.31,0-6-2.69-6-6v-0.81c0.88,0.52,1.9,0.81,3,0.81
                h112c3.31,0,6-2.69,6-6v-5.19C360.788,401.843,361.998,403.783,361.998,406.003z"
                />
                <path
                  style={{ fill: "#423F3C" }}
                  d="M361.998,424.003v6c0,3.31-2.69,6-6,6h-112c-3.31,0-6-2.69-6-6v-0.81c0.88,0.52,1.9,0.81,3,0.81
                h112c3.31,0,6-2.69,6-6v-5.19C360.788,419.843,361.998,421.783,361.998,424.003z"
                />
                <path
                  style={{ fill: "#423F3C" }}
                  d="M361.998,442.003v6c0,3.31-2.69,6-6,6h-112c-3.31,0-6-2.69-6-6v-0.81c0.88,0.52,1.9,0.81,3,0.81
                h112c3.31,0,6-2.69,6-6v-5.19C360.788,437.843,361.998,439.783,361.998,442.003z"
                />
                <path
                  style={{ fill: "#423F3C" }}
                  d="M361.998,460.003v6c0,3.31-2.69,6-6,6h-112c-3.31,0-6-2.69-6-6v-0.81c0.88,0.52,1.9,0.81,3,0.81
                h112c3.31,0,6-2.69,6-6v-5.19C360.788,455.843,361.998,457.783,361.998,460.003z"
                />
                <path
                  style={{ fill: "#423F3C" }}
                  d="M347.084,478.003h-94.17c-5.65,0-10.89-2.68-13.83-7.08l-7.32-10.92h136.48l-7.32,10.92
                C357.973,475.322,352.733,478.003,347.084,478.003z"
                />
                <path
                  style={{ fill: "#423F3C" }}
                  d="M325.484,496.003h-50.97c-6.52,0-12.6-2.94-16.15-7.81l-6.69-9.19h96.65l-6.69,9.19
                C338.084,493.063,332.005,496.003,325.484,496.003z"
                />
                <path
                  style={{ fill: "#423F3C" }}
                  d="M319.998,509.953c-0.91,0-1.83-0.28-2.598-0.87c-1.28-0.96-1.727-2.67-1.09-4.16l3-7
                c0.607-1.415,1.957-2.318,3.465-2.318c0.91,0,1.83,0.28,2.598,0.87c1.28,0.96,1.727,2.67,1.09,4.16l-3,7
                C322.857,509.11,321.507,509.953,319.998,509.953z"
                />
                <path
                  style={{ fill: "#423F3C" }}
                  d="M280.002,509.953c-1.51,0-2.86-0.843-3.465-2.318l-3-7c-0.636-1.49-0.188-3.202,1.09-4.16
                c0.768-0.58,1.688-0.87,2.598-0.87c1.508,0,2.858,0.903,3.465,2.318l3,7c0.636,1.49,0.188,3.202-1.09,4.16
                C281.832,509.673,280.91,509.953,280.002,509.953z"
                />
              </g>
            </g>
          </g>
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="80"
            fill="#000"
          >
            {`${progress}%`}
          </text>
        </svg>
      </div>
      
    </div>
  );
};
export default LightBulb;
