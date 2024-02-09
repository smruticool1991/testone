import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, Typography, } from "@mui/material";
import axios from "axios";
import { token } from "../../auth";
import url from "../../config";
import BackDrop from "../backDrop/BackDrop";
import { useCart } from "react-use-cart";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
const Sidebar = () => {
  const cartItems = useCart()
  const [open, setOpen] = useState(false)
  const [orderCount, setOrderCount] = useState(0)
  const [btnStatus, setBtnStatus] = useState(false)
  const logout = () => {
      setOpen(true)      
      axios.post(`${url}/logout`,{'token': token}).then((res)=>{
        setOpen(false)
        localStorage.removeItem('token')
        window.location.href = "/"        
      }).catch((error)=>{
        console.log(error)
      })
  }
  useEffect(()=>{
    axios.get(`${url}/order`).then((res)=>{
      setOrderCount(res.data.data.total)
    }).catch((error)=> {
      console.log(error)
    })   
  },[])

  const handleClick = () => {
      setBtnStatus(!btnStatus)
  }
  return (
    <>
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        <a className="sidebar-brand d-flex align-items-center" href="#">
          <div className="sidebar-brand-icon">
            <img src="image/favicon.ico" className="img-fluid" />
          </div>
        </a>
        <li className="nav-item active">
          <Link className="nav-link" to="/">
            <i className="mdi mdi-home-variant-outline"></i>
            <span>Home</span>
          </Link>
        </li>
        <li className="nav-item active">
          <Link className="nav-link" to="/dashboard">
            <i className="mdi mdi-home-variant-outline"></i>
            <span>Dashboard</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/category">
            <i className="mdi mdi-grid-large"></i>
            <span>Category</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/products">
            <i className="mdi mdi-bookmark-outline"></i>
            <span>Products</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link d-flex" to="order">
            <i className="mdi mdi-message-text-outline mr-2"></i>
            <span>Orders</span>
            <span className="rounded-circle bg-white text-primary ml-auto px-2 py-1">
              {orderCount}
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link d-flex" to="kitchen">
            <i className="mdi mdi-message-text-outline mr-2"></i>
            <span>Kitchen</span>
            <span className="rounded-circle bg-white text-primary ml-auto px-2 py-1">
              {orderCount}
            </span>
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/" className="nav-link d-flex" href="messages.html">
            <i className="mdi mdi-message-text-outline mr-2"></i>
            <span>Messages</span>
            <span className="rounded-circle bg-white text-primary ml-auto px-2 py-1">
              2
            </span>
          </Link>
        </li>
         <List>
         <ListItemButton onClick={handleClick}>
         <Typography variant="p" sx={{color: '#ffffffcc',pl: 1, pr: 12, fontSize: '12px'}}>SETTINGS</Typography>
        {btnStatus ? <ExpandLess className="text-white"/> : <ExpandMore className="text-white"/>}
      </ListItemButton>
      <Collapse in={btnStatus} timeout="auto" unmountOnExit>
        <List component="div" disablePadding style={{fontSize: '12px'}}>
          <Link to="/user">
          <ListItemButton sx={{ pl: 6}}>
            <Typography variant="p" sx={{color: '#ffffffcc'}}>USERS</Typography>
          </ListItemButton>
          </Link>
          <ListItemButton sx={{ pl: 6 }}>
          <Typography variant="p" sx={{color: '#ffffffcc'}}>OTHERS</Typography>
          </ListItemButton>
        </List>
      </Collapse>
         </List>

        <div
          className="bg-white m-3 p-3 sidebar-alert rounded text-center alert fade show d-none d-md-inline"
          role="alert"
        >
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <FastfoodIcon className="mb-4"/>
          <p className="text-black mb-1">
            Free delivery on
            <br />
            all orders over <span className="text-primary">₹ 500</span>
          </p>
          <p className="small">It is a limited time offer that will expire soon.</p>
          <a href="explore.html" className="btn btn-primary btn-block btn-sm">
            Order now <i className="pl-3 fas fa-long-arrow-alt-right"></i>
          </a>
        </div>

        <div className="d-none d-md-block">
          <div className="user d-flex align-items-center p-3">
            <div className="pr-3">
              <i className="mdi mdi-account-circle-outline text-white h3 mb-0"></i>
            </div>
            <div>
              <p className="mb-0 text-white">Kripsy Chicken</p>
              <p className="mb-0 text-white-50 small">
                <a
                  href="https://askbootstrap.com/cdn-cgi/l/email-protection"
                  className="__cf_email__"
                  data-cfemail="d0b5a8b1bda0bcb590b7bdb1b9bcfeb3bfbd"
                >
                </a>
              </p>
            </div>
          </div>
        </div>

        <hr className="sidebar-divider d-none d-md-block" />

        <div className="text-center d-none d-md-inline">
          <Button color="inherit" onClick={logout}>Logout <ArrowForwardIcon /></Button>
        </div>
      </ul>
    </>
  );
};
export default Sidebar;
