import express from 'express';
import { getXMLs } from '../controllers/getXmlsController.js';

const router = express.Router();





router.get('/',getXMLs);
console.log('Redireccionando a  get type1 Contrroller')






export default router; 