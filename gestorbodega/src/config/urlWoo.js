
import axios from 'axios';
const baseURL = process.env.REACT_APP_WOOCOMERCE_URL
const wooAxios = axios.create({
    baseURL: baseURL
});

export default wooAxios;  