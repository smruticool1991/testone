import axios from "axios";
const url = "http://localhost:8000/api";
const img_path = "http://localhost:8000/images";

const token = localStorage.getItem("token");
const axiosInstance = axios.create({
  baseURL: url,
  headers: { Authorization: `Bearer ${token}` },
});
export default url;
export { img_path, axiosInstance };
