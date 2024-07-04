import React, { useState, useEffect, useRef } from "react";

import { TabMenu } from "primereact/tabmenu";
import { LogRegistrosActivo } from "./documentos_activo/LogRegistrosActivo";
import LogNotificaciones from "./documentos_ingreso/LogNotificaciones";
import {LogRegistrosRetiro} from './documentos_retiro/LogRegistrosRetiro'
export const LogEventos = () => {
  const [index, setIndex] = useState(0);
  const items = [
    {
      label: "Registos carpeta Documentos de Ingreso",
      icon: "pi pi-user-plus  aaa",
      command: () => {
        setIndex(0);
      },
    },
    {
      label: "Registros carpeta Contrato Activo",
      icon: "pi pi-folder-open",
      command: () => {
        setIndex(1);
      },
    },
    {
      label: "Registros carpeta Retiro",
      icon: "pi pi-user-minus",
      command: () => {
        setIndex(2);
      },
    },
  ];
  return (
    <div>
      <TabMenu model={items} className="tabLog" />

      {index === 0 ? (
        <LogNotificaciones />
      ) : index === 1 ? (
        <LogRegistrosActivo />
      ) : index === 2 ? (
        <LogRegistrosRetiro />
      ) : (
        <></> 
      )}
    </div>
  );
};
