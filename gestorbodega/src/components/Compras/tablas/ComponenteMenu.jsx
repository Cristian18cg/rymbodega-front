import React from "react";
import  TablaArchivosProveedor  from "./TablaArchivosProveedor";

const carpetas = {
  0: null,
  1: null,
  2: null,

};

export const ComponenteMenu = ({
  vista,
  documentoProveedor,
  NombreProveedor,
  usuario,
}) => {
  const nombreCarpeta = carpetas[vista];

  if (nombreCarpeta === null) {
    return (
      <TablaArchivosProveedor
        documento={documentoProveedor}
        usuario={usuario}
        NombreProveedor={NombreProveedor}
        numeroCarpeta={vista}
      />
    );
  }  else if(nombreCarpeta=== "otros") {
    return (
      /*   <SubCarpetaOtros
        documento={documento}
        nombrecompleto={NombreCompleto}
        nombrecarpeta={nombreCarpeta}
        auxiliar={auxiliar}
      /> */
      <div>hola</div>
    );
  }else{
    return (
      <TablaArchivosProveedor
        documento={documentoProveedor}
        usuario={usuario}
        NombreProveedor={NombreProveedor}
      />
    );
  }
};
