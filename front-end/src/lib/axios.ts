import axs from "axios";

const axios = axs.create({
  // baseURL: "https://abo-greda-production.up.railway.app/api",
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export default axios;
