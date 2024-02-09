import { Table, TableBody, TableCell, TableContainer, TableRow,Button, TableHead, TablePagination, TableFooter, Typography, CircularProgress } from "@mui/material";
import React, {useState, useEffect,  useRef, useReducer, useContext} from "react";
import { useCart } from "react-use-cart";
import url from "../../../config";
import axios from "axios";
import Invoice from "../../Invoice/Invoice";
import { useReactToPrint } from "react-to-print";
import BackDrop from "../../backDrop/BackDrop";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {channel} from '../../../services/pusher'
import { orderUpdate } from "../../../services/order";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import './kitchen.css'
import swal from "sweetalert";
import { Context } from "../../../App";
import { auth_check } from "../../../auth";

const Kitchen = () => {   
    const [path, setPath] = useState(false)
    const [open, setOpen] =useState(false)
    const [order, setOrder] = useState()
    const [content, setContent] = useState(null)
    const [data, setData] = useState()
    const [bool, setBool] = useState(true)
    // pagination state 
    const [links, setLinks] = useState({})
    const [total, setTotal] = useState(0)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0)
    const [allData, setAllData] = useState([])
    const [editable, setEditable] = useState()
    const [top, setTop] = useState('80px')
   //pagination end
   // reducer hook for stepper

   const styles = {
    borderBottomGreen: {
       'borderBottom': '1px solid green',
       'borderTop' : '1px solid green',
    },
 }

   useEffect(() => {
    auth_check.then((res)=>{
        if(res.data.user.type === 1 || res.data.user.type === 2){
          return true
        }else{
         window.location.href = '/login'
        } 
     })  
   }, []);
    const componentRef = useRef(null)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

    const ready = useReactToPrint({
        content: () => componentRef.current,
        documentTitle:  "Invoice",
        onAfterPrint: (item) => setOpen(false),
    })
     const sendData = async(item) => {        
        setOpen(true)
        setContent(item)       
        setTimeout(()=>{
            ready()
        },500)
     }
     useEffect(()=>{
        if(window.location.pathname === '/sub-admin/kitchen'){
          setTop('80px')
          setPath(true)
        }else{
          setPath(false)
        }
     },[])
     let months = ['Jan', 'Feb','Mar','Apr','May','June','July', 'Aug','Sep','Oct','Nov','Dec']
     const getTime = (item) => {
        let date = new Date(item)
        return  date.getDate() + months[date.getMonth()]+ "," +(String(date.getHours() % 12 || 12).padStart(2, '0')) + ":" + String(date.getMinutes()).padStart(2,'0') + ((date.getHours() >= 12) ? "pm" : "am")
     }
     const context = useContext(Context)
    useEffect(()=>{
      let isOrder = true
      axios.get(`${url}/order?page=${page + 1}&per_page=${rowsPerPage}`).then((res)=>{
        if(isOrder){
          setLinks(res.data.data.links)
          setTotal(res.data.data.total)
          setOrder(res.data.data.data)
          setData(res.data.data.data)
          window.order_data = res.data.data.data
          let date = new Date(res.data.data.data[0].created_at)
        }       
      }).catch((error)=>{
         console.log(error)
      })
      return () => {
        isOrder = false
      }
    },[page, rowsPerPage])

    const handleSearch = (event) => {
        let search = event.target.value
       let searchItem = data.filter((item) => {
           return item.customer_number.includes(search)
        })
        setOrder(searchItem)
    }
    useEffect(()=>{
      let bind_data = true
      if(bind_data){  
        console.log('ppp')
      channel.bind('order-event', function(pushdata) {  
            const pure_data = window.order_data.map((it)=> {
                if(it.id === pushdata.order.id){
                   return pushdata.order;
                }else{
                  return it;
                }
            })
            setData(pure_data)
            setOrder(pure_data)
            window.order_data = pure_data
      });
    }
      return () => {
        bind_data = false
      }
    },[])
        

    const handleEditable = (event) => {
      
    }
    const handleOrderChange = (id, order_status, event) => {
        document.getElementById(id).style.display = "inline"
        let dynamic_status = (check)=>{
            switch(check){
               case 1: return 2
               case 2: return 3
               case 3 : return 4
            }
        }
        orderUpdate(id, dynamic_status(order_status)).then((res)=> {
          document.getElementById(id).style.display = "none"
        }).catch((error)=>{
          console.log(error)
        })

    }
    const handleOrderStatus = (event) => {
          console.log(event)
    }
    const logout = () => {
      const token = localStorage.getItem('token')
      setOpen(true)      
      axios.post(`${url}/logout`,{'token': token}).then((res)=>{
        setOpen(false)
        localStorage.removeItem('token')
        window.location.href = "/"        
      }).catch((error)=>{
        console.log(error)
      })
   }
   // step status 

   const stepStatus = () => {
        console.log(stepStatus)
   }
   const handleCancel = (id) => {
    
     swal({
       'icon': 'warning',
       'buttons': true,
       'content' : 'Are You want to cancel!',
       'title' : 'Are You want to cancel!'
     }).then((res)=>{
        if(res){
           document.getElementById(`c-${id}`).style.display = "inline"
           orderUpdate(id, 0).then((res)=> {
            document.getElementById(`c-${id}`).style.display = "none"
              setOpen(false)
              setOpen(false)
           }).catch((error)=>{
            document.getElementById(`c-${id}`).style.display = "none"
             console.log(error)
           })
        }else{
          console.log(false)
        }
     }) 
   }
   const handleOrderButton = (btn_id) => {
        switch(btn_id){
          case 1: return "confirm"
          case 2: return "complete"
          case 3: return "deliver"
          case 4: return "success"
          default: return "confirm"
        }
   }
    return (
        <>  
             
        <BackDrop status={open}/>
       <div ref={componentRef} className="media">
          <Invoice  content={content}/>
       </div>
         <div className="container" style={ {marginTop: top}}>
            <form className="d-none d-sm-inline-block form-inline mx-2 my-2 my-md-0 mw-100 navbar-search float-right" >
              <div className="input-group">
                {/* <TextField label="search by number" onChange={(event) => handleSearch(event)} size="small" placeholder="Ex: 1234567890"/> */}
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="Search by number..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  onChange={(event) => handleSearch(event)}
                  style={{zIndex: 0}}
                />
                <div className="input-group-append">
                  <button className="btn btn-primary button-outlined-0 float-right" type="button" style={{zIndex: 0}}>
                    <SearchOutlinedIcon />
                  </button>
                </div>
              </div>
            </form>
          </div> 
          <TableContainer className="container"> 
            <Table >   
             <TableHead>
             <TableRow>
                    <TableCell>
                        Order Id
                    </TableCell>
                    <TableCell>
                        Mobile No
                    </TableCell>
                    <TableCell>
                       Name
                    </TableCell>
                    <TableCell>
                        Items  
                    </TableCell>                 
                    <TableCell>
                        Order Date
                    </TableCell>
                    <TableCell className="text-center">
                        Order Status
                    </TableCell>
                </TableRow>
            </TableHead>            
             <TableBody> 
                {order && order.map((item)=>               
                (<TableRow key={item.id}>
                    <TableCell>
                        #{item.id}
                    </TableCell>
                    <TableCell>
                         {item.customer_number}
                    </TableCell>
                    <TableCell>
                        {item.customer_name}
                    </TableCell>
                    <TableCell>
                        {JSON.parse(item.items).map((place_item ,id)=>  
                                                  <>
                                                    <p key={id}>{place_item.product_name} × <span className="text-danger">({place_item.quantity})</span></p>
                                                  {/* `${place_item.product_name}(${place_item.quantity}),` */}
                                                  </>
                                    )}
                    </TableCell>                  
                    <TableCell>
                        {item.created_at}
                    </TableCell>
                    <TableCell onClick={(event) => handleEditable(event)}>
                      {item.id && item.order_status == 0 ?
                      (<Stepper acticeStep="1" className="text-center">
                         <Step>
                            <StepLabel error={bool}>
                              <Typography variant="p" color="error">
                                 Order Canceled
                              </Typography>                             
                            </StepLabel>
                         </Step>
                      </Stepper>):
                      (<Stepper color="" activeStep={item.order_status} alternativeLabel>
                          <Step>
                            <StepLabel> Placed <br/><Typography sx={{color: 'GrayText'}} variant="caption">{getTime(item.created_at)}</Typography> </StepLabel>
                          </Step>
                          <Step>
                            <StepLabel>Confirmed <br/><Typography sx={{color: 'GrayText'}} variant="caption">{item.order_status > 1 ? getTime(item.update_confirm) : null}</Typography></StepLabel>
                          </Step>
                          <Step>
                            <StepLabel>Completed <br/><Typography sx={{color: 'GrayText'}} variant="caption">{item.order_status > 2 ? getTime(item.update_complete):null}</Typography></StepLabel>
                          </Step>
                          <Step>
                            <StepLabel>Delivered <br/><Typography sx={{color: 'GrayText'}} variant="caption">{item.order_status > 3 ? getTime(item.update_delivered):null}</Typography></StepLabel>
                          </Step>
                      </Stepper>)}
                      {item.order_status == 0 || item.order_status == 4 ? null :
                      (<div className="text-center mt-2">
                          <Button size="small" id="abc" variant="outlined" className="mr-2" onClick={(event) => handleOrderChange(item.id, item.order_status, event)} color="success" sx={{position: 'relative'}}> <CircularProgress id={item.id} size={22} sx={{position: 'absolute', top: '50%', left: '50%', marginTop: '-11px', marginLeft: '-11px', display: 'none'}}/> {handleOrderButton(item.order_status)}</Button>
                          <Button size="small" disabled={item.order_status == 4 ? true :false} variant="outlined" onClick={() => handleCancel(item.id)} sx={{position: 'relative'}}><CircularProgress id={`c-${item.id}`} size={22} sx={{position: 'absolute', top: '50%', left: '50%', marginTop: '-11px', marginLeft: '-11px', display: 'none'}}/> Cancel</Button>
                      </div>)}
                      {/* <FormControl sx={{width: '130px'}}>
                        <InputLabel>Order Status</InputLabel>
                      <Select label="Order Status" onChange={(event) => handleOrderChange(item.id, event)} value={item.order_status} size="small"> 
                          <MenuItem value="1">Placed</MenuItem>
                          <MenuItem value="2">Confirmed</MenuItem>
                          <MenuItem value="3">Complete</MenuItem>
                          <MenuItem value="0">Cancel</MenuItem>
                      </Select>
                      </FormControl> */}
                    </TableCell>
                    {/* <TableCell>
                        <Button size="small" className="ml-1" onClick={() => sendData(item)}><PrintIcon/></Button>
                    </TableCell> */}
                </TableRow>)
                )}
                
             </TableBody>
             <TableFooter>
             
             </TableFooter>
             </Table>
             <TablePagination
      component="div"
      count={total}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
            </TableContainer>   
            <Context.Consumer>
              {
                value => {
                   console.log(value)
                }
              }
        </Context.Consumer> 
            {/* <QRCode value="https://www.google.com/search?q=G-01%2C+Raghunath+city+Mall%2C+Maal+road%2C+Almora+krispy+chicken&rlz=1C1YTUH_enIN1019IN1019&oq=G-01%2C+Raghunath+city+Mall%2C+Maal+road%2C+Almora+krispy+chicken&aqs=chrome..69i57.14958j0j7&sourceid=chrome&ie=UTF-8#lrd=0x39a0b1ee5b75e3c7:0x8e5f24bbe6c560a,1,,," renderAs="canvas"/>    */}
        </>
    )
}
export default Kitchen