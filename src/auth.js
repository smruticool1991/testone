import axios from "axios";
import url from "./config";
import jwt_decode from "jwt-decode"; 
const token = localStorage.getItem('token');
let auth = false
let auth_type = 0

if(token){
    let exp = jwt_decode(token).exp
    if(exp > new Date().getTime()/1000){
        auth = true; 
    }else{
        auth = false; 
    }
      
}else{
    auth = false
}
const auth_check = axios.post(`${url}/auth`,{"token": token})
export default auth
export {token, auth_check}
