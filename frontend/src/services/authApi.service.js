import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_DOMAIN}/api/auth`,
});

export default API;
