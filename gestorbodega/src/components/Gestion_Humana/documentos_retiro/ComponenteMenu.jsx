import React from "react";
import { TablaDocumentosRetiro } from "./TablaDocumentosRetiro";
import { SubCarpetaOtros } from "./Subcarpetas/SubCarpetaOtros";
import useControlCarpetaActivo from "../../../hooks/useControl_Contrato_Activo";

const carpetas = {
  0: null,
  1: "otros",
};

export const ComponenteMenu = ({ vista, documento, NombreCompleto, auxiliar }) => {
  const nombreCarpeta = carpetas[vista];

  if (nombreCarpeta === null) {
    return (
      <TablaDocumentosRetiro
        documento={documento}
        nombrecompleto={NombreCompleto}
        auxiliar={auxiliar}
      />
    );
  } else {
    return (
      <SubCarpetaOtros
        documento={documento}
        nombrecompleto={NombreCompleto}
        nombrecarpeta={nombreCarpeta}
        auxiliar={auxiliar}
      />
    );
  }
};