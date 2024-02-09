import url from "../config";
import axios from 'axios'
import { axiosInstance } from "../config";
const getOrder = async() => {
      try{
        const res = await axiosInstance.get(`/order?per_page=30`)
        return res || []
      }catch(error){
         throw new Error('error', error) 
      }
} 
const orderUpdate = (id, order_status) =>  axios.post(`${url}/order/${id}`,{order_status: order_status, _method: 'put'})
export {orderUpdate, getOrder}