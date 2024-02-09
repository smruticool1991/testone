import React, {useEffect, useState} from 'react';
import { getChartReport } from '../../../services/chart';
import { Box, Tabs, Tab, TextField, Button , Paper, MenuItem, MenuList,Divider, ListItemIcon, ListItemText, Typography} from '@mui/material';
import { Chart } from "react-google-charts";
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import axios from 'axios';
import url from '../../../config';
import { auth_check } from '../../../auth';
import './Dashboard.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import { useRef } from 'react';
import { isLoading } from '../../store';
import { useRecoilState } from 'recoil';
const Dashboard = () => {
   let dt = new Date()
  const [data, setData] = useState([]);
  const [dataDetail, setdataDetail] = useState([])
  const [value, setValue] = useState(0);
  const [title, setTitle] = useState('Annual Report');
  const [today, setToday] = useState({'total': 0, 'card': 0, 'cod': 0})
  const [selectionRange, setSelectionRange] = useState({startDate: new Date(),endDate: new Date(),key: 'selection'})
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isShowRange, setIsShowRange] = useState(false)
  const [total, setTotal] = useState(0)
  const [excelData, setExcelData] = useState([])
  const [excelSecondSheet,setExcelSecondSheet] = useState([])
  const [loading, setLoading] = useRecoilState(isLoading)
  const [excelTitle, setExcelTitle] = useState(`monthly-report-created-on-${dt.getDate()}-${(dt.getMonth())+1}-${dt.getFullYear()}`)
  const convertDate = (date) => {
     if(date){
       return `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`
     }   
  }
  let month_name = ['Jan','Feb','March','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
  const handleChange = (event, newValue) => {
       setValue(newValue)
  }

  //proper Excel dataset format
  const properDataFormat = (data) => {
       //let aaa = []
       let order_type = ['','outlet', 'website', 'zomato', 'swiggy']
       let payment_type = ['', 'cash','card','upi']
       let mapData =  data.map((item)=>{
           return {
                    'Order Id': item.id, 
                    'Order Date' : item.created_at, 
                    'Customer Name': item.customer_name,
                    'Customer Number': item.customer_number, 
                    'Order From': order_type[item.order_type], 
                    'Payment Type': payment_type[item.payment_mode],
                    'Items' : JSON.parse(item.items).map((it)=> `${it.product_name}(${it.quantity})`).toString(),
                    'Cost': item.total_cost
                  }
       })
       return mapData
  }
  useEffect(()=>{
       axios.get(`${url}/today-report`).then((res)=>{
           setToday(res.data);
           console.log(res.data);
       }) 
  },[]);
  
  useEffect(() => {
       auth_check.then((res)=>{
           if(res.data.user.type === 1 || res.data.user.type === 3){
               return true
           }else{
              window.location.href = '/login'
           }
           
       })
  },[])
      useEffect(() => {  
         setLoading(true)
         document.getElementById('dp').style.display = 'none' 
          console.log(today)       
          setTitle(`Yearly report for ${new Date().getFullYear()}`)
          getChartReport().then((res)=> {
            setLoading(false)
            console.log(res.data.data)
            setExcelData(properDataFormat(res.data.excelData))
            let prev_data = res.data.data.map((item)=> ({'Month': month_name[item.month - 1], 'Cost': item.total_sales}))           
            setExcelSecondSheet(prev_data)
            // console.log(res.data.excelData)
            // setExcelData(res.data.excelData)
             let month = ['Jan','Feb','March','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
             res.data.data.map((item) => {
                return item.month = month[item.month -1]
             })
             let sum = res.data.data.reduce((accum, curr)=>{
               return  accum + Number(curr.total_sales)
          },0)
          setTotal(sum)
             setData(res.data.data)
             //setData01(res.data.data)
            const arr_data = res.data.data.map((item)=>{
                return [item.month,Number(item.total_sales)]
             })
             arr_data.unshift(['Monthly report for 2023','Sales'])
             setdataDetail(arr_data)
             console.log(arr_data)
          }).catch((error)=>{
            console.log(error)
          })       
      }, []);
      const options = {
        title: title,
      };
      // handle pdf format 
        const pdfRef = useRef()
        const PdfFormat = () => {
            return (
               <div className='container' id="pdd" >
                   <table ref={pdfRef} className="m-2 p-2 table-bordered">
                   <thead>
                     <tr>
                     {excelData[0] && Object.keys(excelData[0]).map((item,id)=>                       
                          <th key={id}>{item}</th>                      
                     )}
                     </tr>
                   </thead>
                   <tbody>
                      {excelData.map((item,id)=>
                          (
                           <tr key={id}>
                              {Object.values(item).map((it,id)=>
                                (                                 
                                <td key={id}>{it}</td>
                                )
                              )}                             
                           </tr>)
                          )}
                     </tbody>                            
                   </table>
               </div>
            )
        }
        
      //handle this year
      const handleThisYear = () => {  
         setLoading(true)
         setExcelTitle(`monthly-report-created-on-${dt.getDate()}-${(dt.getMonth())+1}-${dt.getFullYear()}`) 
       document.getElementById('dp').style.display = 'none' 
       setTitle(`Yearly report for ${new Date().getFullYear()}`)
       getChartReport().then((res)=> {
        setLoading(false)
         setExcelData(properDataFormat(res.data.excelData))
         let prev_data = res.data.data.map((item)=> ({'Month': month_name[item.month - 1], 'Cost': item.total_sales}))           
         setExcelSecondSheet(prev_data)
        let month = ['Jan','Feb','March','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
        res.data.data.map((item) => {
           return item.month = month[item.month -1]
        })
        let sum = res.data.data.reduce((accum, curr)=>{
             return  accum + Number(curr.total_sales)
        },0)
        setTotal(sum)
        setData(res.data.data)
        //setData01(res.data.data)
        const arr_data = res.data.data.map((item)=>{
           return [item.month,Number(item.total_sales)]
        })
        arr_data.unshift(['Monthly report for 2023',`Sales`])
        setdataDetail(arr_data)
     }).catch((error)=>{
       console.log(error)
     })
       }
      const handlePrevMonth = () => {
        setLoading(true)
         setExcelTitle(`prev-month-report-created-on-${dt.getDate()}-${(dt.getMonth())+1}-${dt.getFullYear()}`) 
         document.getElementById('dp').style.display = 'none'
        setTitle(`${month_name[new Date().getMonth() - 1]} Month report for ${new Date().getFullYear()}`)
        axios.get(`${url}/chart-prev-month`).then((res)=>{
          setLoading(false)
         setExcelData(properDataFormat(res.data.excelData))
         setExcelSecondSheet(res.data.data.map((it)=> ({'Day': it.day, 'Sales': it.total_sales})))
               setData(res.data.data)
               let month = new Date().getMonth()
              let newData = res.data.data.filter((item)=>{
                  return  item.month === month
               })
               let sum = newData.reduce((accum, curr)=>{
                  return  accum + Number(curr.total_sales)
             },0)
             setTotal(sum)
               const arr_data = newData.map((item)=>{
                  return [String(item.day),Number(item.total_sales)]
               })
               let month_name = ['Jan','Feb','March','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
               arr_data.unshift([`${month_name[new Date().getMonth()]} Month report for ${new Date().getFullYear()}`,'Sales'])
               setdataDetail(arr_data)
               console.log(arr_data)
        })
       }

   //   get this month report   
     const handleThisMonth = () => {
      setLoading(true)
      setExcelTitle(`this-month-report-created-on-${dt.getDate()}-${(dt.getMonth())+1}-${dt.getFullYear()}`) 
      document.getElementById('dp').style.display = 'none'
      setTitle(`${month_name[new Date().getMonth()]} Month report for ${new Date().getFullYear()}`)
      axios.get(`${url}/chart-this-month`).then((res)=>{
        setLoading(false)
         if(res.data.status === 203){

         }
         setExcelData(properDataFormat(res.data.excelData))
         setExcelSecondSheet(res.data.data.map((it)=> ({'Day': it.day, 'Sales': it.total_sales})))
             setData(res.data.data)
             let month = new Date().getMonth() + 1
            let newData = res.data.data.filter((item)=>{
                return  item.month === month
             })
             let sum = newData.reduce((accum, curr)=>{
               return  accum + Number(curr.total_sales)
            },0)
            setTotal(sum)
            const arr_data = newData.map((item)=>{
                return [String(item.day),Number(item.total_sales)]
             })
             let month_name = ['Jan','Feb','March','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
             arr_data.unshift([`${month_name[new Date().getMonth()]} Month report for ${new Date().getFullYear()}`,'Sales'])
             setdataDetail(arr_data)
             console.log(arr_data)
      })
     }
     const handleWeek = () => {
      setLoading(true)
      setExcelTitle(`weekly-report-created-on-${dt.getDate()}-${(dt.getMonth())+1}-${dt.getFullYear()}`) 
      document.getElementById('dp').style.display = 'none'
      setTitle(`Last 7 Days report for ${new Date().getFullYear()}`)
      axios.get(`${url}/last-week`).then((res)=>{
        setLoading(false)
         console.log(res.data.data)
         setExcelData(properDataFormat(res.data.excelData))
         setExcelSecondSheet(res.data.data.map((it)=> ({'Day': it.day, 'Sales': it.total_sales})))
             setData(res.data.data)
             let month = new Date().getMonth() + 1
            let newData = res.data.data.filter((item)=>{
                return  item
             })
             let sum =newData.reduce((accum, curr)=>{
               return  accum + Number(curr.total_sales)
            },0)
            setTotal(sum)
            const arr_data = newData.map((item)=>{
                return [String(item.day),Number(item.total_sales)]
             })
             let month_name = ['Jan','Feb','March','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
             arr_data.unshift([`${month_name[new Date().getMonth()]} Month report for ${new Date().getFullYear()}`,'Sales'])
             setdataDetail(arr_data)
             console.log(arr_data)
      })
     }
     const handleSelect = (date) => {
          console.log(date)
          setSelectionRange(range=>({
             startDate: range.startDate,
             endDate: range.endDate,
             key: 'selection'
          }))
     }
     //handle date range
   const handleDateRange = (update) => {   
      setLoading(true)
      setExcelTitle(`range-wise-report-created-on-${dt.getDate()}-${(dt.getMonth())+1}-${dt.getFullYear()}`)  
      setDateRange(update);
      if(update[1] != null){
         setTitle(`Range Report`)
         axios.post(`${url}/search-report`, {'start': update[0], 'end': update[1]}).then((res)=> {
            setLoading(false)
            setExcelData(properDataFormat(res.data.excelData))
            setExcelSecondSheet(res.data.data.map((it)=> ({'Day': it.day, 'Sales': it.total_sales})))
            console.log(res)
            setData(res.data.data)
            let month = new Date().getMonth() + 1
           let newData = res.data.data.filter((item)=>{
               return  item
            })
            
            let sum = res.data.data.reduce((accum, curr)=>{
              return  accum + Number(curr.total_sales)
           },0)
           setTotal(sum)
            let month_name = ['Jan','Feb','March','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
           const arr_data = newData.map((item)=>{
               return [String(item.month+"-"+item.day),Number(item.total_sales)]
            })
            
            arr_data.unshift([`${month_name[new Date().getMonth()]} Month report for ${new Date().getFullYear()}`,'Sales'])
            setdataDetail(arr_data)
            console.log(arr_data)
         })
      }else{
         setLoading(false)
      }
   }

   const handlePicker = () => {
      document.getElementById('dp').style.display = 'block'
      setIsShowRange(true)
      document.getElementById('dp').click()
   }
   const handleExcel = () => {
       let ws = XLSX.utils.json_to_sheet(excelData)
       let ws1 = XLSX.utils.json_to_sheet(excelSecondSheet)
       let wb = {Sheets: {'Report A': ws, "Report B": ws1}, SheetNames: ['Report A','Report B']}
       let excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'})
       let exData = new Blob([excelBuffer])
       FileSaver.saveAs(exData, `${excelTitle}.xlsx`)
   }
   const handlePdf = () => {
        
        let pdf = new jsPDF('p','pt','letter', 'a6' ,false);
        console.log(pdf)
        
      pdf.html(pdfRef.current).then((res)=>{
         pdf.setFontSize(9)
         pdf.save('abc.pdf')
      })
        
   }
    return (
        <>
        <div className='container' style={{marginTop: '80px'}}> 
        <div className='row justify-content-center align-items-center mb-2' id="one">
               
        <Paper sx={{ width: 320, maxWidth: '100%' }} className="ml-2">
      <MenuList>     
        <MenuItem>
          <ListItemIcon>
            <Cloud fontSize="small" />
          </ListItemIcon>
          <ListItemText className='text-center'>Online Sales</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
          <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cash</ListItemText>
          <Typography variant="body2" color="text.secondary">
            {today.online_cash}
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
          <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Card</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {today.online_card}
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>UPI</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {today.online_upi}
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>RAZORPAY</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {today.online_razor}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>TOTAL</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {Number(today.online_cash) + Number(today.online_card) + Number(today.online_upi) + Number(today.online_razor)}
          </Typography>
        </MenuItem>
        
      </MenuList>
    </Paper>

    <Paper sx={{ width: 320, maxWidth: '100%' }} className="ml-2">
      <MenuList>     
        <MenuItem>
          <ListItemIcon>
            <Cloud fontSize="small" />
          </ListItemIcon>
          <ListItemText className='text-center'>Outlet Sales</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
          <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cash</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {today.outlet_cash}
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
          <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Card</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {today.outlet_card}
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>UPI</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {today.outlet_upi}
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>RAZORPAY</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {today.outlet_razor}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>TOTAL</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {Number(today.outlet_cash) + Number(today.outlet_card) + Number(today.outlet_upi) + Number(today.outlet_razor)}
          </Typography>
        </MenuItem>
      </MenuList>
    </Paper>


    <Paper sx={{ width: 320, maxWidth: '100%' }} className="ml-2">
      <MenuList>     
        <MenuItem>
          <ListItemIcon>
            <Cloud fontSize="small" />
          </ListItemIcon>
          <ListItemText className='text-center'>Zomato / Swiggy</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
          <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cash</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {today.zomato_cash}
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
          <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Card</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {today.zomato_card}
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>UPI</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {today.zomato_upi}
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>RAZORPAY</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {today.zomato_razor}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>TOTAL</ListItemText>
          <Typography variant="body2" color="text.secondary">
          {Number(today.zomato_cash) + Number(today.zomato_card) + Number(today.zomato_upi) + Number(today.zomato_razor)}
          </Typography>
        </MenuItem>
        
      </MenuList>
    </Paper>
             </div>
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }} className="mb-3">
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="This Year" onClick={handleThisYear}/>
            <Tab label="Last Month" onClick={handlePrevMonth}/>
            <Tab label="This Month" onClick={handleThisMonth} />
            <Tab label="Last 7 Days"  onClick={handleWeek}/>
            <Tab label="RANGE SELECT" onClick={handlePicker}>
            
            </Tab>
          </Tabs>
         
        </Box>
            <div className='d-none'>
              <PdfFormat/>
            </div>  
              <div className='row'>
                 <div className='col-12'>
                  <div style={{width: '250px'}} className="d-flex">               
                 <DatePicker
                   placeholderText='Select date Range'
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => {
                   handleDateRange(update)
                  }}
                  isClearable={true}
                  id="dp"
                  withPortal
                  />
                  <Button onClick={handleExcel} variant="contained" size='small' className='ml-2'>Excel</Button>
                  <Button onClick={handlePdf} variant='contained' size='small' className='ml-2'>PDF</Button>
                  </div>
                 </div>
                 <div className='col-12 mb-3'>
                    <h5 className='text-center'>{`Total Sales: Rs${total.toLocaleString()}`}</h5>
                 </div>
                 <div className='col-12'> 
                       
                    <Chart
                  chartType="AreaChart"
                  data={dataDetail}
                  options={options}
                  width={"100%"}
                  height={"auto"}
                 />            
                 </div>
                 <div className='col-12 mt-4'>
                 <Chart
                  chartType="PieChart"
                  data={dataDetail}
                  options={options}
                  width={"100%"}
                  height={"auto"}
                 />
                 </div>
              </div>
            </div>     
        </>
    );
}

export default Dashboard;
