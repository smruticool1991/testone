import React, {useEffect, useState} from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useRecoilValue } from "recoil";
import { isLoading } from "../store";
const BackDrop = (props) => {
    const [open, setOpen] = useState(false)
    const loading = useRecoilValue(isLoading)
   const handleClose = () => {
        setOpen(false)
    }
    useEffect(()=>{
       setOpen(props.status)
    },[props])
    useEffect(()=>{
        setOpen(loading)
     },[loading])
    return (
        <>
        <Backdrop
        sx={{ color: '#fff', zIndex: 9999 }}
        open={open}
        >
        <CircularProgress color="inherit" />
        </Backdrop> 
        </>
    )
}
export default BackDrop