import axios from "axios";

// Cria uma instância Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Base para todas as rotas
});

// Adiciona o Token automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
