import axios from "axios";

// Crear una instancia de Axios
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true,  // Esto asegura que las cookies de sesión se envíen con cada solicitud
  });
  
export default axiosInstance;
