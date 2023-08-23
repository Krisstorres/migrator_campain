import express from 'express';
import { filesXmlController } from '../controllers/filesController.js';

const router = express.Router();

// Ruta para manejar la subida de archivos
router.post('/', filesXmlController);
console.log('Redireccionando a Controller getType1Controller');

export default router;
