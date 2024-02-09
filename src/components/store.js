import axios from "axios";
import { atom, selector } from "recoil";
import url from "../config";
import { getProduct } from "../services/product";
import { useCart } from "react-use-cart";
const isLoading = atom({
    key: 'loading',
    default: false
})
const singleData = atom({
    key: 'single',
    default: ''
})
const productData = atom({
    key: 'product',
    default: getProduct()
})
const categoryData = atom({
    key: 'category',
    default: []
})
const productEditDialog = atom({
     key: 'productEditDialog',
     default: false
})
const productAddDialog = atom({
    key: 'productAddDialog',
    default: false
})
const categorySelecter = selector({
    key: 'cat',
    get: async ({get}) => {
        try{
         const response = await getProduct()
         return response || []
        }catch(error){
            throw new Error('This error from katia', error)
        }       
    },
})
const gstAtom = atom({
    key: 'gstAtom',
    default: ''
})
const gstSelecter = selector({
   key: 'gstSelecter',
   get: ()=> {
      
   }
})
const tipStore = atom({
    key: 'tipStore',
    default: ''
})

const auth = atom({
    key: 'auth',
    default: false
})
const authTypeState = atom({
    key: 'authTypeState',
    default: 0
})

export {singleData, productData, categoryData, categorySelecter, isLoading, productEditDialog,productAddDialog, gstSelecter, tipStore, auth, authTypeState}