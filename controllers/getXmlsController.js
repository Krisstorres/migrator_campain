import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const dirpath= path.join(__dirname,'..','/static/uploads')
var respueta=[];


function getXMLs(req, res) {
    try {
        let dirList = {};
        fs.readdir(dirpath, (e, cols) => {
            if (!e) {
                let cont = 0;
                cols.forEach(col => {
                    cont += 1;
                   // console.log('Columnas de archivos = ' + col);
                    let propName = "objeto" + cont;
                    dirList[propName] = { "cadena": col.toString() };
                });
                //console.log('Cantidad de elementos detectados = ' + Math.max(cont));
                console.log('Elementos en la lista =', dirList);
            } else {
                console.log('Get Type 1 error = ' + e);
            }
            try {
                respueta= dirList;
                return res.status(200).json({ msg: dirList });
                
            } catch (e) {
                res.json({ msg: 'Error' });
            }
        });
    } catch (e) {
        res.status(500).send('Error get Type Controller = ' + e.toString());
        console.log('Error get Type Controller = ' + e.toString());
        console.error('Error get Type Controller = ' + e.toString());
    }
};


export {
    getXMLs
};