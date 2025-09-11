import axs from "axios";

const axios = axs.create({
  baseURL: "https://abo-greda-production.up.railway.app/api",
  withCredentials: true,
});

export default axios;
