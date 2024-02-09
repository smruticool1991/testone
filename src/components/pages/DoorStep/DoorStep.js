import React, {useEffect , useState, useMemo} from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getOrder } from '../../../services/order';
import { channel } from '../../../services/pusher';
import { isTemplateMiddle } from 'typescript';
const DoorStep = () => {
    const [data, setData] = useState()
    useEffect(() => {
         let isOrder = true
         getOrder.then((res)=> {
            if(isOrder){                
                setData(res.data.data.data)
                window.order_data = res.data.data.data
            }
             
         }).catch((error)=> {
             console.log(error)
         })  
         return () => {
            isOrder = false
         }    
    },[]);
    useEffect(()=>{
        let bind_status = true
        channel.bind('order-event', function(pushdata) {
          if(bind_status){
            let filter_data =  window.order_data.map((item)=> {
                if(item.id === pushdata.order.id){
                   return pushdata.order
                }else{
                   return item
                }
           })
           setData(filter_data)
           window.order_data = filter_data
          }
         }); 
         return () => {
            bind_status = false 
          }    
       },[])
    return (
        <div style={{backgroundColor: '#241b54', minHeight: '100vh'}}>
        <div className='container-fluid'>
           <TableContainer> 
              <Table>
                  <TableHead className='bg-danger'>
                      <TableRow>
                          <TableCell sx={{width: '50px'}}><h4 className='text-white text-center'>Sr</h4> </TableCell>
                          <TableCell><h4 className='text-white text-center'>Order Id</h4></TableCell>
                          <TableCell><h4 className='text-white text-center'>Time</h4></TableCell>
                          <TableCell><h4 className='text-white text-center'>Status</h4></TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                    {data && data.filter((it) => it.order_status === 3).map((item, id)=>
                        (<TableRow className='text-white' key={id}>
                            <TableCell><h5 className='text-center text-white'>{id + 1}</h5></TableCell>
                            <TableCell><h5 className='text-center text-white'>#{item.id}</h5></TableCell>
                            <TableCell><h5 className='text-center text-white'>{item.update_complete}</h5></TableCell>
                            <TableCell><h5 className='text-center text-warning'>RECEIVE YOUR ORDER</h5></TableCell>
                        </TableRow>)
                    )}
                  </TableBody>
              </Table>
           </TableContainer>   
        </div>
        </div>
    );
}

export default DoorStep;
