
import axios from 'axios';
const baseURL = process.env.REACT_APP_BASE_URL
const clienteAxios = axios.create({
    baseURL: baseURL
});

export default clienteAxios;  