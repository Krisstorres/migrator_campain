import express  from "express";
import {uploadController} from '../controllers/uploadXmlController.js';  

const router = express.Router();

router.get('/',uploadController);  
export default router ; 




