import axios from "axios";
import clienteAxios from "../../config/url";
import useControl from '../../hooks/useControl'
export const Empleado = async (numeroDocumento) => {
  const { token } =useControl()
  const tokenDeAcceso = token
  try {
    const response = await clienteAxios.post(
      `gestion_humana/lista_empleado/`,
      { numero_documento: numeroDocumento },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenDeAcceso}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al buscar archivos:", error);
    throw error.response.data.error;
  }
};

/* export const descargarArchivo = async (nombreArchivo, enlace) => {
  const { token } = useControl()

  const tokenDeAcceso = token

  try {
    const urlbase = process.env.REACT_APP_BASE_URL;
    const enlaceDescarga = `${urlbase}/gestion_humana/descargar_archivo/?archivo=${nombreArchivo}&ruta=${enlace}`;
    const response = await axios.get(enlaceDescarga, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${tokenDeAcceso}`,
      },
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", nombreArchivo);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Error al descargar archivo:", error);
  }
};
 */


