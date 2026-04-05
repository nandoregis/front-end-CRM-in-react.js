import axios from "axios";
import CONFIG from "../config/Index"

const Api = axios.create({
  baseURL: CONFIG.API.BASE_URL,
  timeout: CONFIG.API.TIMEOUT,
});

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem(CONFIG.STORAGE.TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export default Api;
