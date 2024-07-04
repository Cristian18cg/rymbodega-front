import React from "react";
import { TablaDocumentosActivo } from "./TablaDocumentosActivo";
import { SubCarpeta } from "./Subcarpetas/SubCarpeta";
import useControlCarpetaActivo from "../../../hooks/useControl_Contrato_Activo";

const carpetas = {
  0: null,
  1: "inducciones_y_reinducciones",
  2: "dotaciones_y_epp",
  3: "procesos_disciplinarios",
  4: "cartas_de_responsabilidad",
  5: "novedades",
  6: "examenes_medicos",
  7: "funciones_perfilcargo",
  8: "otros",
};

export const ComponenteMenu = ({ vista, documento, NombreCompleto, auxiliar }) => {
  const nombreCarpeta = carpetas[vista];

  if (nombreCarpeta === null) {
    return (
      <TablaDocumentosActivo
        documento={documento}
        nombrecompleto={NombreCompleto}
        auxiliar={auxiliar}
      />
    );
  } else {
    return (
      <SubCarpeta
        documento={documento}
        nombrecompleto={NombreCompleto}
        nombrecarpeta={nombreCarpeta}
        auxiliar={auxiliar}
      />
    );
  }
};