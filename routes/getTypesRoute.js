import express, { request } from 'express'; 
import { getTypes1 } from '../controllers/type1Controller.js';
import { getTypes5 } from '../controllers/type1Controller.js';

const router = express.Router();

// Mount the route directly at /types
router.post('/tipo1', getTypes1);

router.get('/tipo5',getTypes5);

export default router;
