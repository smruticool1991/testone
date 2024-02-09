import { Table, TableCell, TableContainer, TableFooter, TableHead, TableRow, Button } from "@mui/material";
import React, {useEffect, useState} from "react";
import { getProduct } from "../../../services/product";
import { getCategory } from "../../../services/category";
import url, { img_path } from "../../../config";
import AddProductDialog from "./AddProductDialog";
import swal from "sweetalert";
import axios from 'axios'
import BackDrop from "../../backDrop/BackDrop";
import EditProductDialog from "./EditProductDialog";
import { useRecoilState } from "recoil";
import { productAddDialog, productData, productEditDialog } from "../../store";
const Products = () => {
    const [data, setData] = useRecoilState(productData)
    const [category, setCategory] = useState(null)
    const [open,setOpen] = useRecoilState(productAddDialog)
    const [editOpen, setEditOpen] = useRecoilState(productEditDialog)
    const [isLoading,setIsLoading] = useState(false)
    const [status, setStatus] = useState(false)
    const [count, setCount] = useState(0)
    const [editId, setEditId] = useState(null);
    useEffect(()=>{ 
        let avd = true
        if(avd){  
         axios.get(`${url}/product`).then((res)=>{
            setIsLoading(false)
            setData(res.data.data)
         }).catch((err)=>{
            setIsLoading(false)
            console.log(err)
         })
         getCategory().then((res)=>{
            setCategory(res)
         }).catch((error)=>{
            console.log(error)
         })
        }
        return () => {
            avd = false
        }
    },[])
    useEffect(()=>{
        setIsLoading(false) 
    },[])
    const handleProductAdd = () => {
        setOpen(true)   
    }
    const handleEdit = (id) => {
        setEditId(id)
        setEditOpen(true)
        setCount(count + 1)
        //console.log(id)
        setStatus(true)
    }
    const handleDelete = (id) => {
        swal({
            title: 'Are you sure!',
            icon: 'warning',
            text: 'Once you are deleted not recovered.',
            buttons: true,
            dangerMode: true
        }).then((res=>{
            setIsLoading(true)
            if(res){
                axios.delete(`${url}/product/${id}`).then((result)=>{
                    axios.get(`${url}/product`).then((result)=>{
                        setData(result.data.data)
                    })
                    setCount(count + 1)
                    setIsLoading(false)
                    swal({
                        title: 'Delete Success!',
                        icon: 'success',
                        button: true
                    })
                }).catch((error)=>{
                    setIsLoading(false)
                    swal({
                        title: 'Error ocured',
                        icon: 'error',
                        button: true
                    })
                })
            }else{
                setIsLoading(false) 
            }
        }))
    }
    return (
        <>
         {editOpen ?
          (<EditProductDialog id={editId}/>): null
         }
          <BackDrop status={isLoading}/>
          {open ? 
            (<AddProductDialog count={count}/>): null
         }
          
          <div className="container" style={{marginTop: '80px'}}>
          <Button className="float-right" color="primary" variant="contained" onClick={handleProductAdd} size="small">Add Product</Button>
              <TableContainer>
                  <Table>
                     <TableHead>
                         <TableRow>
                            <TableCell>
                                Sr No.
                            </TableCell>
                            <TableCell>
                                Product Name
                            </TableCell>
                            <TableCell>
                                Description
                            </TableCell>
                            <TableCell>
                                MRP
                            </TableCell>
                            <TableCell>
                                Price
                            </TableCell>
                            <TableCell>
                               Product Type
                            </TableCell>
                            <TableCell>
                                Product Image
                            </TableCell>
                            <TableCell>
                                Category
                            </TableCell>
                            <TableCell>
                                Action
                            </TableCell>
                         </TableRow>
                         {data.length > 0 && data.map((item, id)=> 
                         (<TableRow>
                            <TableCell>
                               {id + 1}
                            </TableCell>
                            <TableCell>
                                {item.product_name}
                            </TableCell>
                            <TableCell>
                                {item.description}
                            </TableCell>
                            <TableCell>
                                {item.sale_price}
                            </TableCell>
                            <TableCell>
                            {item.price}
                            </TableCell>
                            <TableCell>
                                {item.product_type}
                            </TableCell>
                            <TableCell>
                                <img src={`${img_path}/product/${item.image}`} style={{width: '80px'}}/>
                                
                            </TableCell>
                            <TableCell>
                                {                                   
                                    category && category.find((cat_item)=> cat_item.id === item.category_id).cat_name
                                }                                   
                            </TableCell>
                            <TableCell>
                                <div className="d-flex">
                                <Button size="small" variant="outlined" onClick={() => handleEdit(item.id)}>Edit</Button>  
                                <Button size="small" variant="outlined" className="ml-2" onClick={() => handleDelete(item.id)}>Delete</Button>  
                                </div>                             
                            </TableCell>
                         </TableRow>)
                         )}
                     </TableHead>
                     <TableFooter>

                     </TableFooter>
                  </Table>

              </TableContainer>

          </div>
        </>
    )
}
export default Products