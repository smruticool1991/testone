import React, {useState} from "react";
import { Alert, Chip, Drawer, TextField} from "@mui/material";
import { useEffect } from "react";
import { useCart } from "react-use-cart";
import * as Yup from 'yup'
import { useFormik } from "formik";
import BackDrop from "../backDrop/BackDrop";
import axios from "axios";
import url from "../../config";
import swal from "sweetalert";
import { useRecoilValue } from "recoil";
import { tipStore } from "../store";

const CheckoutModal = (props) => {
    const cartItems = useCart()
    const [open, setOpen] = useState(false)
    const [cardStatus, setCardStatus] = useState(false)
    const [codStatus, setCodStatus] = useState(true)
    const [paypalStatus, setPaypalStatus] = useState(false)
    const [dropStatus, setDropStatus] = useState(false)
    const [paymentId, setPaymentId] = useState(null)
    const [chips, setChips] = useState([
      {
        id: 1,
        label: 'zomato',
        status: false,
        phone: '1111111111',
        order_type: 3,
      },
      {
        id: 2,
        label: 'swiggy',
        status: false,
        phone: '2222222222',
        order_type: 4,
      }
    ]);
    const [payments, setPayments] = useState([{
      id: 3,
      label: 'upi',
      status: false,
      payment_mode: 3,
    },
    {
      id: 4,
      label: 'card',
      status: false,
      payment_mode: 2,
    },
    {
      id: 5,
      label: 'razorpay',
      status: false,
      payment_mode: 4,
    },
    {
      id: 6,
      label: 'cash',
      status: true,
      payment_mode: 1,
    }
  ])
    
    //cleat state
    const clearState = () => {
        setOpen(false)
        setCardStatus(false)
        setCodStatus(true)
        setPaypalStatus(false)
        setDropStatus(false)
        setChips([{
          id: 1,
          label: 'zomato',
          status: false,
          phone: 1111111111,
          order_type: 3,
        },
        {
          id: 2,
          label: 'swiggy',
          status: false,
          phone: 2222222222,
          order_type: 4,
        }])
        setPayments([{
          id: 3,
          label: 'upi',
          status: false,
          payment_mode: 3,
        },
        {
          id: 4,
          label: 'card',
          status: false,
          payment_mode: 2,
        },
        {
          id: 5,
          label: 'razorpay',
          status: false,
          payment_mode: 4,
        },
        {
          id: 6,
          label: 'cash',
          status: true,
          payment_mode: 1,
        }
      ])
    }
    //use effect hook use for Razorpay payment id set
    useEffect(() => {
      if(paymentId != null){
         console.log('notequalnull')
        formik.handleSubmit() 
      }
      return () => {
        console.log('returnvalue')
        setPaymentId(null)
      };
    }, [paymentId]);
    const tip = useRecoilValue(tipStore)
    const formik = useFormik({
      initialValues: {
        name_cod: '',
        mobile_cod: '',
        order_type: 1,
        payment_mode: 1
      },
      validationSchema: Yup.object({
        name_cod: Yup.string().min(3),
        mobile_cod: Yup.string().matches(/^\d{10}$/,'Please Enter 10 digit valid phone number').required().label('Phone'),
        order_type: Yup.string(),
        payment_mode: Yup.string()
      }),
      validateOnBlur: false,
      validateOnChange: true,
      validateOnMount: false,
      onSubmit: function(values){
         console.log(values)
         setDropStatus(true)
         let data = {
            customer_name: values.name_cod,
            customer_number: values.mobile_cod,
            items: JSON.stringify(cartItems.items),
            total: cartItems.cartTotal,
            total_cost: (Number(cartItems.metadata && cartItems.metadata.subTotal) + Number(tip)).toFixed(2),
            order_type: values.order_type,
            payment_mode: values.payment_mode,
            payment_id: paymentId
         }
         axios.post(`${url}/order`, data).then((res)=>{
             setDropStatus(false)
             setOpen(false)
             swal("Placed!", "You order is successfully placed!", "success");
             cartItems.emptyCart()
             formik.values.mobile_cod = ''
             formik.resetForm()
             clearState()
         }).catch((error)=>{
             console.log(error);
         })
      }
    })
    useEffect(()=>{
        setOpen(props.btn)
    },[props.count])

    const handleClose = () => {
        setOpen(false)
    }
    const handleCod = () => {
      setCardStatus(false)
      setPaypalStatus(false)
      setCodStatus(true)
    }
    const handleCard = () =>{
      setCardStatus(true)
      setPaypalStatus(false)
      setCodStatus(false)
    }
    const handlePaypal = () => {
      setPaypalStatus(true)
      setCardStatus(false)
      setCodStatus(false)
    }
    const handlePayment = () => {
     document.getElementById('codForm').submit()
    }
   const handleClick = (id) => {
          formik.resetForm()
         let filter_data = chips.filter((it)=>{
             return it.id == id
          })
            formik.setFieldValue('name_cod', `${filter_data[0].label}`)
            formik.setFieldValue('mobile_cod', `${filter_data[0].phone}`)
            formik.setFieldValue('order_type', `${filter_data[0].order_type}`)     
         setChips(chips.map((item)=>{
                if(item.id === id){
                  return {
                      ...item,
                      status: true
                  }
                }else{
                  return {
                    ...item,
                    status: false
                 }  
                }
         }))
         
   }
   // handle click on payment
  const handleClickP = (id) => {
    console.log(id)
    let filter_data = payments.filter((it)=>{
      return it.id == id
   })   
  formik.setFieldValue('payment_mode', `${filter_data[0].payment_mode}`)   
  setPayments(payments.map((item)=>{
         if(item.id === id){
           return {
               ...item,
               status: true
           }
         }else{
           return {
             ...item,
             status: false
          }  
         }
  }))
   }
   const handleDelete = (id) => {
    
      setChips(chips.map((item)=> {
              return ({...item , status: false})           
        }))
     formik.resetForm()
     console.log(formik.values)  
   }
   const handleDeleteP = (id) => {
    formik.setFieldValue('payment_mode', 1)
      setPayments(payments.map((item)=> {
              return ({...item , status: false})           
        }))
   }

  const handleOnline = (total) => {
    console.log(Number(total))
    let rzp1 = new window.Razorpay(
      {
        "key": "rzp_test_2Jq34QAc0piYIr", // Enter the Key ID generated from the Dashboard
        "amount": Math.round(total * 100), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Krispy Chicken",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "handler": function (response){
             if(response.razorpay_payment_id){
               setPaymentId(response.razorpay_payment_id)                 
             }else{
                alert('error ocured');
             }            
        },
        "prefill": {
            "name": "example",
            "email": "example@example.com",
            "contact": "9000090000"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    }
    );
    console.log(formik.values)
   if(formik.values.mobile_cod != ''){
        rzp1.open()
   }else{
       formik.handleSubmit()
   }
      

   }
  return (
    <>
      <BackDrop status={dropStatus}/>
      <Drawer open={open} anchor="right" onClose={handleClose}>
      <div
        id="checkoutModal"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Checkout
              </h5>
              <button
                type="button"
                className="close"
                onClick={handleClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">              
              {codStatus ? 
              (
                <>
                  <form id="codForm">
                    <div>
                  <TextField name="name_cod" value={formik.values.name_cod} onFocus={formik.values.name_cod} size="small" label="Full Name" onChange={formik.handleChange}/>
                  <p><span className="text-danger">{formik.touched && formik.errors && formik.errors.name_cod}</span></p>
                  </div>
                  <div>
                  <TextField color="" value={formik.values.mobile_cod} name="mobile_cod" size="small" label="*Phone Number" onChange={formik.handleChange}/>
                  <TextField className="d-none" color="" value={formik.values.order_type} name="order_type" size="small" label="*order type" onChange={formik.handleChange}/>
                  <TextField className="d-none" color="" value={formik.values.payment_mode} name="payment_mode" size="small" label="*payment mode" onChange={formik.handleChange}/>
                  <p><span className="text-danger">{formik.touched.mobile_cod && formik.errors && formik.errors.mobile_cod}</span></p>
                  </div>
                  </form>
                  {chips.map((item)=>
                          item.status? 
                          (<Chip label={item.label} color={'success'} className="ml-2" onClick={() => handleClick(item.id)} onDelete={() => handleDelete(item.id)}  />):
                          (<Chip label={item.label} className="ml-2" onClick={() => handleClick(item.id)}/>)                       
                  )}
                  <p></p>
                  {payments.map((item)=>
                          item.status? 
                          (<Chip label={item.label} color={'success'} className="ml-2" onClick={() => handleClickP(item.id)} onDelete={() => handleDeleteP(item.id)}  />):
                          (<Chip label={item.label} className="ml-2" onClick={() => handleClickP(item.id)}/>)                       
                  )}
                  
                </>
              ): null           
              }
            </div>
            <div className="modal-footer justify-content-start">

              {payments[2] && payments[2].status ? 
                (<a onClick={() => handleOnline(Number(cartItems.metadata && cartItems.metadata.subTotal) + Number(tip))} className="btn btn-info btn-block text-white">
                Online payment (₹ {(Number(cartItems.metadata && cartItems.metadata.subTotal) + Number(tip)).toFixed(2)})
              </a>)
              : (<a onClick={codStatus ? formik.handleSubmit : null} className="btn btn-success btn-block text-white">
                Confirm payment (₹ {(Number(cartItems.metadata && cartItems.metadata.subTotal) + Number(tip)).toFixed(2)})
            </a>)}
            
            </div>
          </div>
        </div>
      </div>
      </Drawer>
    </>
  );
};
export default CheckoutModal;
