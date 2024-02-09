import url from "../config";
import axios from "axios";

const getChartReport = () => {
    return axios.get(`${url}/chart`)
}
export {getChartReport} 