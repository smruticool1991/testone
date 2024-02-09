import React,{useEffect, useState} from "react";
import {TableContainer, Table, TableBody, TableCell, TableFooter, TableRow, TablePagination, Button} from '@mui/material'
import DialogBox from "./DialogBox";
import { getCategory } from "../../../services/category";
import { img_path } from "../../../config";
import axios from "axios";
import swal from "sweetalert";
import url from "../../../config";
import EditDialog from "./EditDialog";
import { categoryData } from "../../store";
import { useRecoilState } from "recoil";
import { isLoading } from "../../store";
const Category = () => {
    const [count, setCount] = useState(0)
    const [open,setOpen] = useState(false)
    const [data, setData] = useRecoilState(categoryData)
    const [editOpen, setEditOpen] = useState(false);
    const [ecount, setEcount] = useState(0)
    const [id, setId] = useState(null);
    const [loading, setLoading] = useRecoilState(isLoading)
    const handleOpen = () =>{
      setOpen(true)
      setCount(count + 1)
    }
    useEffect(()=>{
        getCategory().then((data)=>{
            setData(data)
        })
    },[])
    const handleDelete = (id) => {
        swal({
            text: 'Are you want to delete!',
            icon: 'warning',
            buttons: true
        }).then((bool)=>{
            if(bool){
                 setLoading(true)
                  axios.delete(`${url}/category/${id}`).then((res)=> {
                        setData(data.filter((item)=>{
                             return item.id != id 
                        }))
                       swal({
                          text: 'Category delete Success',
                          icon: 'success'
                       })
                       setLoading(false)
                  }).catch((error)=>{
                      setLoading(false )
                      console.log(error)
                  })
            }
        })       
    }
    const handleEdit = (id) => {
        setEditOpen(true)
        setEcount(ecount + 1)
        setId(id)
    }
    return (
        <>
        {editOpen ? (<EditDialog status={editOpen} box1={ecount} id={id}/>) : null }
          {open ? (<DialogBox status={open} box={count}/>): null  }                
        <div className="container" style={{marginTop: '80px'}}>
            <Button className="float-right" color="primary" variant="contained" size="small" onClick={handleOpen}>Add Category</Button>
         <TableContainer>
            <Table>
                <TableBody>
                   <TableRow>
                      <TableCell>
                            Sr No.
                      </TableCell>
                      <TableCell>
                            Category Name
                      </TableCell>
                      <TableCell>
                            Image
                      </TableCell>
                      <TableCell>
                            Action
                      </TableCell>
                   </TableRow>
                    {data.length > 0 && data.map((item, id)=>
                        (
                              <TableRow key={id}>
                              <TableCell>
                                    {id + 1}
                              </TableCell>
                              <TableCell>
                                    {item.cat_name}
                              </TableCell>
                              <TableCell>
                                   <img style={{width: '70px'}} src={`${img_path}/category/${item.image}`} />
                              </TableCell>
                              <TableCell>
                                    <Button variant="outlined" size="small" onClick={() => handleEdit(item.id)}>Edit</Button>
                                    <Button variant="outlined" className="ml-2" size="small" onClick={() => handleDelete(item.id)}>Delete</Button>
                              </TableCell>
                           </TableRow>
                        )
                    )}
                   
                </TableBody>
                <TableFooter>
                </TableFooter>
            </Table>
         </TableContainer>
         </div>
        </>
    )
}
export default Category;