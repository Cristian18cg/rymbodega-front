
import axios from 'axios';
const baseURL = process.env.REACT_APP_BASE_URL_WO

const W_OAxios = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_WO,
    timeout: 1000, // opcional, para evitar demoras largas en la respuesta
    headers: { 'Content-Type': 'application/json' }
  });

export default W_OAxios;  