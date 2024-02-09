import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, InputLabel, Select, MenuItem, FormControl, FormHelperText } from '@mui/material';
import React,{useState, useEffect} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup'
const UserAddModal = (props) => {
    const [open, setOpen] = useState(true)
    useEffect(() => {
         setOpen(!open)
    }, [props]);

    const handleUser = () => {
        alert('handleUser')
    }
    const formik = useFormik({
       initialValues: {
          name: '',
          email: '',
          user: '',
          password: '',
          user_type: ''
       },
       validationSchema: Yup.object({
        name: Yup.string().required(),
        email: Yup.string().required(),
        user: Yup.string().required(),
        password: Yup.string().matches(/^[a-zA-Z]+$/, 'pass must be alpha numeric').min(8).max(15).required(),
        user_type: Yup.string().required()
       }),
       onSubmit: function(values){
          console.log(values)
       }
    })
    return (
       <>
         <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle className='text-center'>Add User</DialogTitle>
            <DialogContent className='py-4'>
                <div className='d-flex mb-3'>
                  <TextField type="text" label="Name" name="name" size='small' onChange={formik.handleChange} className='' helperText={formik.touched.name && formik.errors.name}/>
                  <TextField type="email" label="Email" name="email" size='small' onChange={formik.handleChange} className='ml-2'  helperText={formik.touched.email && formik.errors.email}/>
                </div>
                <div className='d-flex mb-3'>
                  <TextField type="text" label="User Name" autoComplete='off' name="user" size='small' onChange={formik.handleChange} className='' helperText={formik.touched.user && formik.errors.user}/>
                  <TextField type="password" label="Password" autoComplete='off' name="password" onChange={formik.handleChange} size='small' className='ml-2' helperText={formik.touched.password && formik.errors.password}/>
                </div>
                <div className='d-flex mb-3'>                  
                  <FormControl sx={{width: '222px'}} >
                    <InputLabel>select user type</InputLabel>
                    <Select size="small" label="select user type" name='user_type' onChange={formik.handleChange}>
                        <MenuItem>--Select--</MenuItem>
                        <MenuItem value="2">SubAdmin</MenuItem>
                        <MenuItem value="0">User</MenuItem>
                    </Select>
                    <FormHelperText>{formik.touched.user_type && formik.errors.email}</FormHelperText>
                  </FormControl>
                </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={formik.handleSubmit} variant="outlined" size='small' className='mr-3'>Add User</Button>
            </DialogActions>
         </Dialog>
       </>
    );
}

export default UserAddModal;
