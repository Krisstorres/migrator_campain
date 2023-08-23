import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import multer  from 'multer';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirPath='./static/templates/getinfo.html'; 
const app = express();
const patth = path.join(__dirname,'..','static/uploads');


const uploadPath = path.join(__dirname, '..', 'static', 'uploads');

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
    destination: uploadPath,
    filename: function (req, file, callBack) {
        callBack(null, Date.now().toString().replace(' ', '') + file.originalname.replace(/ /g, ''));                
    }
});

// Configura el middleware de multer con el almacenamiento definido
const upload = multer({ storage: storage });

// Controlador para manejar la subida de archivos
function filesXmlController(req, res) {
    try{upload.single('avatar')(req, res, err => {
        if (!err) {
            console.log('Archivo subido con EXITO!');
            res.status(200).send('Archivo subido correctamente');
            
            
        }else{
            console.error('Error al subir el archivo:', err);
            return res.status(500).send('Error al subir el archivo.');
        }
        
    });}
    catch(e){
        console.log('Error FilesCOntroller.js = '.concat(e.toString()));
        res.status(500).send('Error al subir el archivo ');
    };
    
}

export {
    filesXmlController
};