
import axios from 'axios';
import { ColumnGroup } from 'primereact/columngroup';
const baseURL = process.env.REACT_APP_WOOCOMERCE_URL
const wooAxios = axios.create({
    baseURL: baseURL
});

export default wooAxios;  