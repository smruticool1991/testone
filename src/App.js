import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./components/pages/Home/Home";
import Category from "./components/pages/Category/Category";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/pages/Login/Login";
import { CartProvider } from "react-use-cart";
import Products from "./components/pages/Products/Products";
import  auth  from "./auth";
import { createContext, useEffect } from "react";
import Order from "./components/pages/Order/Order";
import User from "./components/pages/User/User";
import Kitchen from "./components/pages/Kitchen/Kitchen";
import DoorStep from "./components/pages/DoorStep/DoorStep";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import { RecoilRoot} from "recoil";
import BackDrop from "./components/backDrop/BackDrop";
import LogoutBar from "./components/logoutBar/LogoutBar";
const Context = createContext(false)
export {Context}
function App() {
  const path = window.location.pathname;
  return (    
   <CartProvider>
    <RecoilRoot>
     <BackDrop/>  
    { path === "/doorstep" ?
    (<Router>
        <Routes>
            <Route exact path="doorstep" element={<DoorStep/>}/>          
        </Routes>
    </Router>):
    (<Router>
      <Routes>         
           <Route exact path="/login" element={<Login />} />
      </Routes>
      {path === "/login" ? null : (
        <>
        {
          path == "/sub-admin/kitchen" ||  path === '/accounts' ? (
            <>
             <LogoutBar/>
            <Routes>
                <Route exact path="/sub-admin/kitchen" element={<Kitchen/>}/>
                <Route exact path="/accounts" element={<Dashboard/>}/>
            </Routes>
            </>
          )
        :
          (<div id="wrapper">
            <Sidebar />
            <div id="content-wrapper" className="d-flex flex-column">
              <div id="content">
                <Navbar />
                <Routes>
                  <Route exact path="/" element={auth ? <Home /> : window.location.href = "/login"} />
                  <Route exact path="/category" element={<Category />} />
                  <Route exact path="/products" element={<Products />} />
                  <Route exact path="/login" element={<Login />} />
                  <Route exact path="/order" element={<Order />} />
                  <Route exact path="/user" element={<User/>} />
                  <Route exact path="/kitchen" element={<Kitchen/>} />
                  <Route exact path="/dashboard" element={<Dashboard/>} />
                </Routes>
              </div>
              <Footer />
            </div>
          </div>)}
        </>
      )}
    </Router>)}
    </RecoilRoot>
    </CartProvider>    
  );
}

export default App;
