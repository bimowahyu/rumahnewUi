// src/api.js
import axios from 'axios';

// Set default base URL dan withCredentials untuk semua request
axios.defaults.baseURL = process.env.REACT_APP_URL;
axios.defaults.withCredentials = true;

export default axios;
