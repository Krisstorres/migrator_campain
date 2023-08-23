import express from "express";
import { getXmlController } from "../controllers/getXmlInfoController.js";
const router = express.Router();


try{
    router.get('/',getXmlController)
    console.log('Redireccionando a  Get Xml Controller')
}catch(e){
    console.log('Error get Xml Ingo Route = '.concat(e.toString()))
}


export default router ; 