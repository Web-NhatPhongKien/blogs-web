import axios from "axios";

const adminAPI = axios.create({
  baseURL: "http://localhost:3000/api/admin",
});

// THÊM: tự động gắn token admin vào mọi request
adminAPI.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token") ;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminAPI;