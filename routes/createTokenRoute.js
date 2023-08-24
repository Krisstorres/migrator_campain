import express from "express";
import {crearCampaña} from '../controllers/createTokenController.js';
const router = express.Router();


router.get('/',crearCampaña);


export default router;