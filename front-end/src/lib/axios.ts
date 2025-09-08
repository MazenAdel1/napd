import axs from "axios";

const axios = axs.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export default axios;
