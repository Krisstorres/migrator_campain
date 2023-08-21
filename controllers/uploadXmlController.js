
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';


const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app = express();

function uploadController(req, res) {
   res.sendFile('C:/Users/ctorrese/Desktop/MigradorFinal/src/static/templates/index.html');
}

// export function uploadController(req, res){
//  app.get('/framework/home', (res,req ) =>{
//    //res.sendFile(__dirname+'/static/templates/index.html');
//  }); 
// }

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

export{
   uploadController
};