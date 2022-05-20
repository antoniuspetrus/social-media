import axios from "axios";

const axiosDefault = axios.create({
  // baseURL: process.env.API_URL,
  baseURL: "http://localhost:9000",
  timeout: 3000,
});

export default axiosDefault;
