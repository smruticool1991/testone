import React, {useState, useEffect} from "react";
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CartModal from "../cartModal/CartModal";
import { Badge } from "@mui/material";
import { useCart } from "react-use-cart";
import auth, {auth_check} from "../../auth";
import jwt_decode from "jwt-decode";
import { isLoading } from "../store";
import axios from 'axios'
import url from "../../config";
import { useRecoilState } from "recoil";
const LogoutBar = () => {
    const [loading, setLoading] = useRecoilState(isLoading)
    const handleLogout = () => {
        setLoading(true)
        let token = localStorage.getItem('token')
        axios.post(`${url}/logout`,{'token': token}).then((res)=>{
            setLoading(false)
            localStorage.removeItem('token')
            window.location.href = "/"        
          }).catch((error)=>{
            console.log(error)
          })
    }
    return (
        <>
          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow-sm osahan-nav-top fixed-top">
        <button
          id="sidebarToggleTop"
          className="btn btn-link d-md-none rounded-circle mr-3"
        >
          <i className="fa fa-bars"></i>
        </button>

        <ul className="navbar-nav">
          <li className="nav-item dropdown no-arrow d-sm-none">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="searchDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-search fa-fw"></i>
            </a>

            <div
              className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
              aria-labelledby="searchDropdown"
            >
            </div>
          </li>

          <li className="nav-item dropdown no-arrow mx-2 osahan-t-loc">
            <a
              className="nav-link dropdown-toggle text-dark"
              href="#"
              data-toggle="modal"
              data-target="#addressModal"
            >
              <span className="mdi mdi-crosshairs-gps"></span>
            </a>
          </li>
        </ul>

        <div className="ml-auto">
          <a
            onClick={handleLogout}
            className="btn btn-primary ml-2 text-white"
            data-toggle="modal"
            data-target="#cartModal"
          >
           Logout 
          </a>
        </div>
      </nav>   
        </>
    );
}

export default LogoutBar;
