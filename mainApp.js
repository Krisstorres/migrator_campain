// import section 
import express from "express";
import bodyParser from 'body-parser';
//manejo de directorios
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import path from 'path'; 
//routing
import uploadXmlRouter from './routes/uploadXmlRouter.js';
import fileRouter from './routes/fileRoutes.js';
import getxmlInfo from './routes/getXmlInfoRoute.js';
import getXmls from './routes/getXmlsRoute.js';
import getTypes from './routes/getTypesRoute.js';
import createToken from './routes/createTokenRoute.js';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { crearCampaña } from "./controllers/createTokenController.js";
// import section 


// Variables 
const patth = 'uploads/';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
var cantidad = 0;
var listDir = [];
var infoObj = [];
const app = express();
const storage = multer.diskStorage({
    destination: patth,
    filename: function (req, file, callBack) {
        callBack("", Date.now().toString().replace(' ', '') + file.originalname.replace(' ', '').replace(' ', ''));
    }
});
const upload = multer({
    storage: storage
});
// Variables 
async function esperar(){
  await  crearCampaña(); 
}
const task =cron.schedule('* * * * *',() =>{ 
    esperar();
});



function verificarTamano() {
    fs.readdir(patth, (err, files) => {
        if (err) {
            console.error('Error al leer el directorio ', err);
            return 'error '.concat(err);
        }
        console.log('Cantidad de archivos en el directorio =', files.length);
        cantidad = files.length;
        listDir = files;
        return cantidad;
    });
}
//routing section
app.use(bodyParser.urlencoded({ extended:false }));

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());
//app.use('/',uploadXmlRouter);

app.use('/files',fileRouter);

app.use('/filtrar',getxmlInfo);

app.use('/getXmls',getXmls);

app.use('/types',getTypes);

app.use('/',createToken);


//routing section

//running section

app.listen(8000, () => console.log("Server started http://localhost:8000"));
//running section