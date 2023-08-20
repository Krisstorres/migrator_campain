
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';


const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app = express() ; 


export function uploadController(){
 app.get('/', (res,req ) =>{
    res.serdFile(__dirname)
 }); 
}

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const dirPath='./static/templates/index.html'; 
// const app = express();
// const storage = multer.diskStorage({
//     destination: patth,
//     filename: function (req, file, callBack) {
//         callBack("", Date.now().toString().replace(' ', '') + file.originalname.replace(' ', '').replace(' ', ''));
                
//     }
// });

// const upload = multer({
//     storage: storage
// });

// app.get('/',(res,req ) => {
//     res.sendFile(__dirname+dirPath)
// });
// app.post('/upload',upload.single('avatar'),(res,req) =>{
//     res.send('Archivo subido correctamente !');
// });

