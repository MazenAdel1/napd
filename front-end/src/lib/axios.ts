import axs from "axios";

const axios = axs.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export default axios;
