// src/api.js
import axios from 'axios';


axios.defaults.baseURL = process.env.REACT_APP_URL;
axios.defaults.withCredentials = true;

export default axios;
