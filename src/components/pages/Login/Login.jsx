import React, { useEffect, useState } from "react";
import * as Yup from "yup"
import { useFormik } from "formik";
import url from "../../../config";
import axios from "axios";
import auth, {auth_check} from "../../../auth";
import BackDrop from "../../backDrop/BackDrop";
import { Button, Snackbar } from "@mui/material";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import KeyIcon from '@mui/icons-material/Key';
const Login = () => {
    const [open, setOpen] = useState(false)
    const [count, setCount] = useState(1)
    const [snackOpen, setSnackOpen] = useState(false)
    useEffect(()=>{
       if(auth){
          auth_check.then((res)=>{
             if(res.data.user.type === 1){
                  window.location.href = "/"
             }else if(res.data.user.type === 2){
                  window.location.href = "/sub-admin/kitchen"
             }else if(res.data.user.type === 3){
                  window.location.href = "/accounts"
             }
          }).then((error)=>{
              console.log(error)
          })
          
       }else{
          console.log('false')
       }
    },[])
    const handleClose = () => {
      setSnackOpen(false)
    }
    const formik = useFormik({
        initialValues: {
            user_email: '',
            password : ''
        },
        validationSchema: Yup.object({
            user_email: Yup.string().email().required().label('user name'),
            password: Yup.string().min(8).required()
        }),
        onSubmit : function(values){
           setOpen(true)
           setCount(count + 1)
           axios.post(`${url}/login`, {email: values.user_email, password: values.password}).then((res)=>{
              //console.log(res)   
              // if(res.data.user.type == 2){
              //     window
              // }            
               if(res.data.status){
                  setOpen(false)
                  setCount(count + 1)
               }else{
                setCount(count + 1)
                 setOpen(false)
               }
               console.log(res.data.token)
               localStorage.setItem('token', res.data.token)
               if(res.data.success){
                  if(res.data.user.type == 2){
                    return window.location.href = "/sub-admin/kitchen"
                  }else if(res.data.user.type === 1){
                    return window.location.href = "/"
                  }else if(res.data.user.type === 3){
                    window.location.href = "/accounts"
                  }else{
                    console.log('else statement of login component')
                  }                  
               }
           }).catch((error)=>{
              if(error.response.data.success === false){
                setCount(count + 1)
                setOpen(false)                             
                setSnackOpen(true)
              }
           })
        }
    })
  return (
    <>
       <Snackbar
        open={snackOpen}
        message="Email and password doesn't match"
        onClose={handleClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        autoHideDuration={8000}
        action={<Button size="small" onClick={handleClose}>UNDO</Button>}
       ></Snackbar>
      <BackDrop status={open} count={count}/>
      <div className="row osahan-login m-0">
        <div className="col-md-6 osahan-login-left px-0" style={{background: "url(/image/banner-img.jpg)", backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh'}}></div>
        <div className="col-md-6 d-flex justify-content-center flex-column px-0">
          <div className="col-lg-6 mx-auto">
            <h3 className="mb-1">Welcome</h3>
            <p className="mb-5">Sign in to your account to continue</p>
            <form>
              <div className="d-flex align-items-center mb-4">
                <div className="mr-3 bg-light rounded p-2 osahan-icon">
                <MailOutlineIcon />
                </div>
                <div className="w-100">
                  <p className="mb-0 small font-weight-bold text-dark">
                    Email Address
                  </p>
                  <input
                    name="user_email"
                    type="email"
                    className="form-control form-control-sm p-0 border-input border-0 rounded-0"
                    placeholder="Enter Your Email"
                    onChange={formik.handleChange}
                  />
                  <span className="text-danger">{formik.touched.user_email && formik.errors && formik.errors.user_email}</span>
                </div>
              </div>
              <div className="d-flex align-items-center mb-4">
                <div className="mr-3 bg-light rounded p-2 osahan-icon">
                  <KeyIcon/>
                </div>
                <div className="w-100">
                  <p className="mb-0 small font-weight-bold text-dark">Password</p>
                  <input
                    name="password"
                    type="password"
                    className="form-control form-control-sm p-0 border-input border-0 rounded-0"
                    placeholder="Enter Password"
                    onChange={formik.handleChange}                   
                  />
                  <span className="text-danger">{formik.touched.password && formik.errors && formik.errors.password}</span>
                </div>
              </div>
              <div className="mb-3">
                <button type="buttom" onClick={formik.handleSubmit} className="btn btn-primary btn-block mb-3">
                  Sign in
                </button>
                <p className="text-center">
                  {/* <a href="#" className="text-dark">
                    Forgot password?
                  </a> */}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
