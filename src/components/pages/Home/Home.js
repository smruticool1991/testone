import React, {useEffect, useState} from "react";
import { img_path } from "../../../config";
import { getCategory } from "../../../services/category";
import { getProduct } from "../../../services/product";
import { Link } from "react-scroll";
import "./Home.css"
import { Button, ButtonGroup } from "@mui/material";
import { useCart } from "react-use-cart";
const Home = () => {
   const cartItem = useCart()
   const [category, setCategory] = useState(null)
   const [product, setProduct] = useState(null)
   const [cart, setCart] = useState({})
   const [qty, setQty] = useState()
   const [catSticky, setCatSticky] = useState(false)

   useEffect(()=>{
     getCategory().then((res)=>{
          setCategory(res)
     }) 
     getProduct().then((res)=>{
       setProduct(res)
     })  
   },[])
   const toTitleCase = (text) => {
      return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
   }
   const add_to_cart = (item) => {
       cartItem.addItem(item, 1);
        //addItem(item)         
   }
   useEffect(()=>{
    window.onscroll = () => {
      if(window.scrollY > 100){
        setCatSticky(true)
      }else{
        setCatSticky(false)
      }
      console.log(window.Razorpay)
    }
   },[])
   
  return (
    <>
      
      <div className="container-fluid" style={{marginTop: '80px'}}>
       {catSticky ? 
      (<nav className="navbar navbar-expand navbar-light bg-white mb-4 static-top shadow-sm osahan-nav-top fixed-top" style={{marginLeft: '200px', marginTop: '70px'}}>
           {category && category.map((item)=>          
          (<Link
            spy={true}
            smooth={true}
            hashSpy={true}
            offset={-160}
            duration={500}
            isDynamic={true}
            key={item.id}
            to={`section-${item.id}`}
            className="text-decoration-none  col-xl-2 col-md-4"
          >
            <div className="text-center link">
              {/* <i className="mdi mdi-fire bg-danger text-white osahan-icon mx-auto rounded-pill"></i> */}              
              <img src={`${img_path}/category/${item.image}`} className="rounded-circle" style={{height: '30px'}}/>
              <p className="mb-1 mt-1 text-dark">{item.cat_name}</p>          
            </div>
          </Link>)
           )}
      </nav>): null }
        <div className="d-flex align-items-center justify-content-between mb-3 mt-2">
          <h5 className="mb-0">Explore categories</h5>
          {/* <a href="listing.html" className="small font-weight-bold text-dark">
            See all <i className="mdi mdi-chevron-right mr-2"></i>
          </a> */}
        </div>

        <div className="row">
          {category && category.map((item)=>          
          (<Link
            spy={true}
            smooth={true}
            hashSpy={true}
            offset={-150}
            duration={500}
            isDynamic={true}
            key={item.id}
            to={`section-${item.id}`}
            className="text-decoration-none  col-xl-2 col-md-4 mb-4"
          >
            <div className="rounded py-4 bg-white shadow-sm text-center link">
              <img src={`${img_path}/category/${item.image}`} className="rounded-circle" style={{width: '100px'}}/>
              {/* <i className="mdi mdi-fire bg-danger text-white osahan-icon mx-auto rounded-pill"></i> */}
              <h6 className="mb-1 mt-3">{item.cat_name}</h6>
              <p className="mb-0 small">view all</p>
            </div>
          </Link>)
           )}
        </div>
        {category && category.map((cat_item)=>
        (
         <>
        <div key={cat_item.id} id={`section-${cat_item.id}`} className="d-flex align-items-center justify-content-between mb-3 mt-2">
          <h6 className="mb-0">{cat_item.cat_name}</h6>
          {/* <a href="listing.html" className="small font-weight-bold text-dark">
            See all <i className="mdi mdi-chevron-right mr-2"></i>
          </a> */}
        </div>
        <div className="row" >
          {product && product.filter((item)=> item.category_id == cat_item.id).map((product_item)=> 
          (
          <a
            key={product_item.id}            
            className="text-dark text-decoration-none col-xl-4 col-lg-12 col-md-12"small
          >
            <div className="bg-white shadow-sm rounded d-flex align-items-center p-1 mb-4 osahan-list">
              <div className="bg-light p-3 rounded">
                <img src={`${img_path}/product/${product_item.image}`} className="img-fluid" />
              </div>
              <div className="mx-3 py-2 w-100">
                <p className="mb-2 text-black text-center">{product_item.product_name}</p>
                <p className="small mb-2 text-center">
                  {product_item.price !== product_item.sale_price ?
                   (<span style={{fontSize: '17px'}} className="text-danger"><del> ₹ {product_item.sale_price}</del></span>) : null
                  }
                   <span style={{fontSize: '17px'}}><i className="mdi mdi-currency-inr ml-3"></i> ₹ {product_item.price}/-</span>
                   <p>{toTitleCase(cat_item.cat_name)}</p>
                   {!cartItem.inCart(product_item.id) ?
                   (<Button variant="contained" className="mt-2" color="warning" onClick={() => add_to_cart(product_item) } size="small">Order Now</Button>):
                     (<Button variant="contained" className="mt-2" color="error" onClick={() => cartItem.removeItem(product_item.id)} size="small">Remove</Button>)
                   }

                </p>
              </div>
            </div>
          </a>
          )
          )}
        </div>
        </>
         )
        )}
      </div>
    </>
  );
};
export default Home
