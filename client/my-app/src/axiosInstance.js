import axios from "axios";

// Crear una instancia de Axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,  // Esto asegura que las cookies de sesión se envíen con cada solicitud
  });
  
export default axiosInstance;
