import axios from "axios";

// Crear una instancia de Axios
const axiosInstance = axios.create({
    baseURL: 'https://studysphere-fernandos-projects-88891e4a.vercel.app/',
    withCredentials: true,  // Esto asegura que las cookies de sesión se envíen con cada solicitud
  });
  
export default axiosInstance;
