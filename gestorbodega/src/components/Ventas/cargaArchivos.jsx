import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";
import useControlVentas from "../../hooks/useControlVentas";
import { Button as PrimeButton } from "primereact/button";

export default function CargaArchivos({ numero_solicitud, rowData }) {
  const { usuario } = useControl();
  const { subirRemisiones, modalremisiones } = useControlVentas();

  const toast = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef(null);
  const [archivos, setArchivos] = useState({});

  useEffect(() => {
    if (modalremisiones === false) {
      setArchivos({});
      setTotalSize(0);
      const camposArchivo = document.querySelectorAll('input[type="file"]');
      camposArchivo.forEach((campo) => {
        campo.value = "";
      });
    }
  }, [modalremisiones]);
  /* Toast de mensajes fallidos */
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
  const subir_Remisiones = () => {
    if (Object.keys(archivos).length > 0) {
      subirRemisiones(numero_solicitud, usuario, archivos, rowData.estado);
    } else {
      showError("No hay archivos para subir");
    }
  };
  const onTemplateRemove = (file, callback) => {
    // Crear un nuevo objeto sin el archivo que deseamos eliminar
    const nuevosOtrosArchivos = { ...archivos };
    delete nuevosOtrosArchivos[file.name];
    // Actualizar el estado con el nuevo objeto de otros archivos
    if (file.type === "application/pdf") {
      setTotalSize(totalSize - file.size);
    }
    setArchivos(nuevosOtrosArchivos);
    callback();
  };
  const onTemplateSelect = (e) => {
    console.log(e.files);
    let newotrosArchivos = { ...archivos };
    let nuevoTotalSize = totalSize;
    e.files.forEach((archivo) => {
      const archivoNombre = archivo.name;
      if (archivo.type === "application/pdf") {
        // Verificar si el nombre del archivo ya está presente en otros_archivos
        if (newotrosArchivos.hasOwnProperty(archivoNombre)) {
          showError(
            `El archivo "${archivoNombre}" ya ha sido cargado previamente.`
          );
        } else {
          // Calcular el nuevo tamaño total sumando el tamaño de los archivos existentes
          nuevoTotalSize += archivo.size;
          // Verificar si el nuevo tamaño excede el límite
          if (nuevoTotalSize > 10240000) {
            showError(
              `El archivo "${archivoNombre}" excede el tamaño máximo permitido.`
            );
          } else {
            // Agregar el nuevo archivo al objeto newotrosArchivos
            newotrosArchivos[archivoNombre] = archivo;
            // Mostrar mensaje de éxito
            showSuccess(`Se ha subido a otros archivos: ${archivoNombre}`);
          }
        }
      } else {
        // Mostrar error si el archivo no es un PDF
        showError(
          `${usuario} -> ${archivoNombre} no es un archivo PDF, no será cargado. \n Elimina y vuelve a cargar un archivo ".pdf" por favor.`
        );
      }
    });

    // Actualizar el estado con los nuevos archivos y el nuevo tamaño total
    setArchivos(newotrosArchivos);
    setTotalSize(nuevoTotalSize);
  };
  const onTemplateUpload = (e) => {
    let _totalSize = 0;
    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
  };
  const onTemplateClear = () => {
    setArchivos([]);
    setTotalSize(0);
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;
    const value = totalSize / 100000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}

        {cancelButton}
        <div className="flex align-items-center gap-3 ml-4">
          <span>{formatedValue} / 10 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };
  const itemTemplate = (file, props) => {
    return (
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <div className="d-flex align-items-center" style={{ width: "40%" }}>
          <i
            className="pi pi-file-pdf p-3"
            style={{ color: "red", fontSize: "1em" }}
          ></i>
          <span className="flex flex-column text-left ml-4">
            {file.name}
            <small style={{ marginLeft: "6px" }}>
              {new Date().toLocaleDateString()}
            </small>
          </span>
        </div>
        <div className="d-flex align-items-center">
          <Tag
            value={props.formatSize}
            severity="warning"
            className="px-3 py-2"
          />
          <PrimeButton
            type="button"
            icon="pi pi-times"
            raised
            outlined
            className="button-cancel mx-2"
            onClick={() => {
              onTemplateRemove(file, props.onRemove);
            }}
          />
        </div>
      </div>
    );
  };
  const emptyTemplate = (event) => {
    return (
      <div className="align-items-center flex-column  justify-content-center">
        <i
          className="pi pi-file-pdf p-3"
          style={{
            fontSize: "3em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1em", color: "var(--text-color-secondary)" }}
          className="mx-2 "
        >
          {usuario} agrega las remisiones correspondientes a la solicitud:{" "}
          {numero_solicitud}.
        </span>
      </div>
    );
  };
  const chooseOptions = {
    icon: "pi pi-fw pi-file-pdf",
    iconOnly: true,
    className: "custom-choose-btn",
  };

  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className: "custom-cancel-btn",
  };

  return (
    <div>
      <Toast ref={toast}></Toast>

      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />
      <FileUpload
        ref={fileUploadRef}
        name="demo[]"
        multiple
        accept=".pdf*"
        maxFileSize={10000000}
        onUpload={onTemplateUpload}
        onSelect={onTemplateSelect}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        cancelOptions={cancelOptions}
        className="form-control-gestion"
      />
      <div className="row mt-2">
        <div className="col aling-items-center d-flex justify-content-center">
          {Object.keys(archivos).length > 0 && (
            <PrimeButton
              className="p-button p-component p-button-outlined button-gestion"
              label="Subir remisiones"
              onClick={subir_Remisiones}
            ></PrimeButton>
          )}
        </div>
      </div>
    </div>
  );
}
