import axios from "axios";
import url from "../config";

const getCategory = async () => {    
    try{
        const response = await axios.get(`${url}/category`)
        return response.data.result || []
    }catch(error){
        throw new Error('this error from get category from service area')
    }
} 
export {getCategory}