import React, {useState,  useEffect} from "react";
import { Drawer, TextField } from "@mui/material";
import { useCart } from "react-use-cart";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { img_path } from "../../config";
import {Button, ButtonGroup} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckoutModal from "../checkoutModal/CheckoutModal";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import { tipStore } from "../store";
const CartModal = (props) => {
  const cartItems = useCart()
  const [check, setCheck] = useState(false)
  const [checkoutBtn, setCheckoutBtn] = useState(false)
  const [count, setCount] = useState(1)
  const [tip, setTip] = useState(null)
  const [showTipInput, setShowTipInput] = useState(false)
  const [tipVal,  setTipVal] = useRecoilState(tipStore)
  const [showTipPrice, setShowTipPrice] = useState(false)
  useEffect(()=>{
     setCheck(props.cart)
  },[props.btn])
  const cartClose = () => {
     setCheck(prevCheck => ! prevCheck)
  }
  const removeItem = (id) => {
    cartItems.removeItem(id)
  }

  const addQty = (id) => {
     cartItems.updateItemQuantity(id, cartItems.getItem(id).quantity + 1)
  }
  const removeQty = (id) => {
    cartItems.updateItemQuantity(id, cartItems.getItem(id).quantity - 1)
  }
  let navigate  = useNavigate()
  const addMore = () => {
     setCheck(false)     
     navigate('/')
  }
  const handleCheckout = () => {
     setCheckoutBtn(true)
     setCheck(false)
     setCount(count + 1)
  }
 useEffect(()=>{
    let sgst = (cartItems.cartTotal * 2.5/100).toFixed(2)
    let cgst = (cartItems.cartTotal * 2.5/100).toFixed(2)
    let subTotal = 0;
    if(cartItems.metadata && cartItems.metadata.tip){
       subTotal = ((((cartItems.cartTotal * 2.5/100).toFixed(2)) * 2) + cartItems.cartTotal).toFixed(2) + cartItems.metadata.tip
    }else{
      subTotal = ((((cartItems.cartTotal * 2.5/100).toFixed(2)) * 2) + cartItems.cartTotal).toFixed(2)
    }
    //let subTotal = ((((cartItems.cartTotal * 2.5/100).toFixed(2)) * 2) + cartItems.cartTotal).toFixed(2)
    cartItems.setCartMetadata({'cgst': cgst, 'sgst': sgst, 'subTotal': subTotal})
    console.log(cartItems)
 },[cartItems.items])

 const handleTip = (event) => {
     setTipVal(0)
     setShowTipPrice(false)     
     setTip(event.target.value)
 }
 const handleTipStatus = () => {
  setShowTipInput(true)
 }
 const handleAdd = () => {
   setShowTipPrice(true)
   setTipVal(tip)
 }

 //empty cart function
 const handleEmptyCart = () => {
    setTipVal(0)
    setTip(0)
    cartItems.emptyCart()
    setShowTipInput(false)
 }
  return (
    <>
    <CheckoutModal btn={checkoutBtn} count={count}/>
    <Drawer open={check} anchor="right" onClose={cartClose}>
      <div id="cartModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                My cart <span className="small">({cartItems.totalItems} items)</span>
                {cartItems.isEmpty ? null :
                (<Button  onClick={handleEmptyCart} className="small text-danger" style={{marginLeft: '60px', fontSize: '12px'}}>Empty Cart</Button>)}
              </h5>
              <button
                type="button"
                className="close"
                onClick={cartClose}
              >
                <span aria-hidden="true" >&times;</span>
              </button>
            </div>
            <div className="modal-body osahan-my-cart">
              <div className="details-page pt-3 osahan-my-cart-item">
                {cartItems.items && cartItems.items.map((item)=> 
                (<div className="d-flex align-items-center mb-3">
                  <div className="mr-2">
                    <img style={{width: '50px'}} src={`${img_path}/product/${item.image}`} className="img-fluid rounded" />
                  </div>
                  <div className="small text-black-50">{item.quantity} x</div>
                  <div className="ml-2">
                    <p className="mb-0 text-black">{item.product_name}</p>
                    <p className="mb-0 small">₹ {item.price}
                    
                    </p>
                  </div>
                  <div className="ml-auto d-flex">
                  <ButtonGroup className="mt-2" variant="outlined" color="warning" size="small">
                       <Button size="small" onClick={() => removeQty(item.id)}>
                         <RemoveIcon style={{fontSize: '16px'}} />                        
                       </Button>
                        <Button size="small">
                           {item.quantity}
                        </Button>
                       <Button size="small" onClick={() => addQty(item.id)}>
                         <AddIcon  style={{fontSize: '16px'}} />
                       </Button>
                   </ButtonGroup>
                  <Button className="ml-auto" onClick={() => removeItem(item.id)}>
                    <DeleteOutlineIcon color="warning" />
                  </Button>
                  </div>
                </div>)
                 )}
                <div className="my-3">
                  <a
                    href="#"
                    onClick={addMore}
                    className="text-primary"
                  >
                    <i className="mdi mdi-plus mr-2" ></i> Add more items
                  </a>
                </div>
                <div className="text-center">
                {cartItems.cartTotal != 0 ?
                   (<table className="table table-borderless text-dark">
                      <tr>
                        <th>
                        SubTotal:
                        </th>
                        <th>
                        ₹ {cartItems.cartTotal.toFixed(2)}
                        </th>
                      </tr>
                      <tr>
                        <th>
                        CGST (2.5%):
                        </th>
                        <th>
                        ₹ {cartItems.metadata.cgst}
                        </th>
                      </tr>
                      <tr>
                        <th>
                        SGST (2.5%):
                        </th>
                        <th>
                        ₹ {cartItems.metadata.sgst}
                        </th>
                      </tr>
                   </table>) : null
                    }
                    { cartItems.cartTotal !== 0 ? 
                     (<>
                    <a onClick={handleTipStatus} style={{float: 'left', cursor: 'pointer'}} className="ml-5 text-primary">Add tip</a>
                    {showTipInput ?
                      (<><input value={tip} type="number" onChange={(event) => handleTip(event)} style={{border: '1px solid #6e6e6e', borderRadius: '5px', width: '60px', height: '25px', float: 'left', marginLeft: '5px'}}/> <a className="btn btn-sm btn-secondary text-white float-left ml-2" onClick={handleAdd}>{showTipInput ? 'Add' : 'Remove' }</a><span className="float-right mr-5">{(tip > 0) && showTipPrice ? `₹ ${Number(tip).toFixed(2)}`: null}</span></>)
                      : null }
                     </>): null}              
                </div>
              </div>
            </div>
            <div className="modal-footer justify-content-start osahan-my-cart-footer">
              <div className="row w-100">
                <div className="col-12 pr-0">
                {cartItems.cartTotal != 0 ?
                  (<button
                    className="btn btn-primary btn-block"
                    onClick={handleCheckout}
                  >                    
                      {`Checkout (₹  ${(Number(cartItems.metadata.subTotal) + Number(tipVal)).toFixed(2)})`}
                  </button>)
                  : null
                 }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Drawer>
    </>
  );
};
export default CartModal
