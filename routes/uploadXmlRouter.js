import express  from "express";
import  multer  from "multer";
import {uploadController} from '../controllers/uploadXmlController.js';  

const router = express.Router();






router.post('/',uploadController);  
export default router ; 




