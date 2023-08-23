import multer from "multer";
import express from "express";
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const app=express();

function getXmlController(req,res) {
    try {
        //migrator_campain\static\templates\getInfo.html
        console.log('Entry Get Xml Info COntroller  ')
        res.sendFile( path.join(__dirname,'..','static/templates/getInfo.html') );
    } catch (e) {
        res.send('Error GetXmlInfoController = '.concat(e.toString()));
    }
};
function miFuncion(){
    return 'Hola desde mi funcion en el servidor ';
};
app.get('/obtener-funcion',(req,res) =>{
    res.json({function:miFuncion.toString() });
});

export {
    getXmlController
};


