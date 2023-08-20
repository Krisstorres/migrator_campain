import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import xml2js from 'xml2js';
import path from "path"
import uploadRote from './routes/uploadXmlRouter.js';

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

// Resto de tu código...

// app.get('/xml', async (req, res) => {
//     try {
//         // Resto de tu código...

//         res.render('xmlViews', { etiquetasType1 }); // Renderizamos la vista 'xmlViews.ejs' con la información
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error al leer el archivo XML.');
//     }
// });

// Resto de tu código...

-

// app.get('/xml', async (req, res) => {
//     try {
//         const filePath = path.join(__dirname, './uploads/1692192152575dialer_config(3)(1).xml');
//         fs.readFile(filePath, 'utf-8', (err, data) => {
//             if (!err) {
//                 console.log(data);
//                 xml2js.parseString(data, (parseError, result) => {
//                     if (!parseError) {
//                         const dialerObjects = Array.isArray(result.DIALERCONFIG2.DIALEROBJECT) ? result.DIALERCONFIG2.DIALEROBJECT : [result.DIALERCONFIG2.DIALEROBJECT];

//                         const etiquetasType1 = dialerObjects.filter(obj => obj.$ && obj.$['type'] && obj.$['type'][0] === '1');
//                         //Etiquetas sin filtrado 
//                         const contenidoEtiquetas = etiquetasType1.map(etiqueta => etiqueta.PROPERTIES[0]);
//                         //extraxendo solo los valores de estas etiquetas
//                         res.json(contenidoEtiquetas);

//                         console.log(contenidoEtiquetas);

//                     } else {
//                         console.log('Error parse error = ' + parseError);
//                         console.error('Error parse error = ' + parseError);
//                     }
//                 });
//             } else {
//                 console.log('Error de lectura = ' + err);
//                 console.error('Error de lectura = ' + err);
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error al leer el archivo XML.');
//     }
// });


app.get('/', (req, res) => {
    res.sendFile(__dirname+'/static/templates/index.html');
});

app.post('/files', upload.single('avatar'), (req, res) => {
    res.send('Todo Bien');
});

app.listen(8000, () => console.log("Server started http://localhost:8000"));
