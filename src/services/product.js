import axios from 'axios'
import url from '../config'

const getProduct = async() =>{  
    try{
       const response = await axios.get(`${url}/product`)
       return response.data.data || []
    }catch(error){
        throw new Error('this is error', error)
    }
} 

const addProduct = (data) => {
    axios.post(`${url}/product`, data) 
} 
const singleProduct = (id) => {
    axios.get(`${url}/product/${id}`)
}
export { getProduct, addProduct, singleProduct }