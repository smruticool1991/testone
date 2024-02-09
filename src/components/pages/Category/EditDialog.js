import React, {useState, useEffect} from 'react';
import { Formik, useFormik } from "formik";
import * as Yup from 'yup'
import axios from "axios";
import url from "../../../config";
import { Dialog, DialogTitle, DialogContent,DialogActions, Button, TextField } from '@mui/material';
import { img_path } from '../../../config';
import { categoryData } from '../../store';
import { useRecoilState } from 'recoil';
import { getCategory } from '../../../services/category';
import { isLoading } from '../../store';
import swal from 'sweetalert';
const EditDialog = (props) => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [data, setData] = useState([]);
    const [catData, setCatData] = useRecoilState(categoryData);
    const [loading, setLoading] = useRecoilState(isLoading);
    const handleClose = () => {
       setOpen(false)
    }
    const handleInput = () => {
         document.getElementById('image').click() 
    }
    useEffect(()=>{
        setData([])
        setName('')
        setImage('')
       setOpen(props.status)
      if(props.id != null){
        axios.get(`${url}/category/${props.id}`).then((res)=> {
            setData(res.data.data)           
            setImage(res.data.data.image)
            setName(res.data.data.cat_name)
      }).catch((error)=>{
          console.log(error)
      })
      }
    },[props.box1])

    const formik = useFormik({
        initialValues: {
            cat_name: data.cat_name ? data.cat_name : '',
            image: data.image ? data.image : '', 
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
           cat_name: Yup.string().required().label('Category'),
           image: Yup.string()
        }),
        onSubmit: (values) => {
            console.log(values)
            setLoading(true)
             let form = new FormData();
             form.append('cat_name',values.cat_name)
             form.append('image', values.image)
             form.append('_method', 'put')
               axios.post(`${url}/category/${props.id}`,form).then((res)=> { 
               console.log(res)
                if(res.data.status === 200){
                    swal({
                        title: 'Success',
                        icon: 'success',
                        text: 'Category updated success!'
                    })
                }
                getCategory().then((response)=>{
                    setCatData(response)
                })
                setLoading(false) 
                setOpen(false) 
                console.log(res.data.data)
               }).catch((error)=>{
                  setLoading(false)
                  console.log(error)
                  setOpen(false)
               })
        }
     })
     //handle image
     const handleImage = (event) => {
        formik.setFieldValue('image', event.target.files[0])
     }
    return (
        <>
        <Dialog open={open} onClose={handleClose}>
             <DialogTitle className="text-center bg-light">Edit Category</DialogTitle>
             <DialogContent className="p-4">
                  <TextField name="cat_name" value={formik.values.cat_name} variant="filled" label="Category Name" onChange={formik.handleChange} className="m-2" helperText={formik.errors.cat_name && formik.errors.cat_name}/><br/>
                  <input type="file" name="image" className="d-none" id="image" onChange={(event)=> handleImage(event) }/>
                  <div className="text-center">
                  <Button variant="contained" size="small" onClick={handleInput}>Upload Image</Button><br/>
                  <img src={formik.values.image.name ? URL.createObjectURL(formik.values.image) : formik.values.image && `${img_path}/category/${formik.values.image}`} style={{height: '80px', marginTop: '10px', maxWidth: '100px'}}/>
                  <p style={{maxWidth: '200px'}}>{formik.values.image.name ? formik.values.image.name : formik.values.image} </p>
                  <p className="text-danger">{formik.errors.image && formik.errors.image}</p>
                  </div>
             </DialogContent>
             <DialogActions className="bg-light">
                <Button variant="outlined" color="info" onClick={handleClose} size="small">Cancel</Button>
                <Button variant="outlined" size="small" color="success" onClick={formik.handleSubmit}>Edit</Button>
             </DialogActions>
          </Dialog>  
        </>
    );
}

export default EditDialog;
