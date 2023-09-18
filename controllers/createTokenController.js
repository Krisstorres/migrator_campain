import express from 'express';
import fetch from 'node-fetch';
import axios from 'axios';
import platformClient from 'purecloud-platform-client-v2'; 
//import { queryApp } from '../utils/queryJsonParser.js';
import { createToken } from '../utils/getToken.js';
import { test } from '../utils/createContactList.js'; 
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSONPath } from "jsonpath-plus";
import {UpdateFile} from '../utils/saveInfo.js';
import { UpdateLog } from '../utils/loger.js'; 
import {filtarDatos} from '../utils/sandBox.js';
import { transferableAbortSignal } from 'util';
import iconv from 'iconv-lite';
import cron from 'node-cron';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFile = path.join(__dirname, '../static/documents/archivo.json');
const outPutData = path.join(__dirname, '../static/documents/output.csv');  
const tablas_Gt=path.join(__dirname, '../static/documents/tablas_GT.csv');  
const tablas_procesadas=path.join(__dirname,'../static/documents/tablasProcesadas.json')
const nameList=path.join(__dirname,'../static/documents/nameList.json')
const sinRepetir=path.join(__dirname,'../static/documents/sinRepetir.json')
const app=express();
const axxios=axios.default;
const client = platformClient.ApiClient.instance;
var daira =[];
let tarea1EnEjecucion = false;
let tarea2EnEjecucion = false;

 
app.use(express.json());
async function ccaca(){
  const nombres=leerArchivoJSON(sinRepetir);
  let i = 0 ; 
  let jumped=0;
  var tok=await createToken();
  tok=tok.toString();
  console.log(tok)
  for (let index = 0; index < nombres.length; index++) {
    const col = nombres[index];
    
    const jsonData = fs.readFileSync(tablas_procesadas, 'utf8');
    const jsonObject = JSON.parse(jsonData);
    if(!jsonObject.some(prefix => prefix === col.toUpperCase())){
      const body =await CrearContactList(col,tok);
     // console.log(body);
     console.log('Tabla no existe en los registros ');
       i+=1;
      if(i==1){
    
        break;
      };
    }else{
      console.log('Tabla procesada, Santando proceso ! ');
      console.log('Nombre de la tabla '+col );
      jumped+=1;
      continue;
    }
  };
}


//await ccaca();




function leerArchivoJSON(direccionArchivo) {
  try {
    // Lee el archivo JSON de la dirección especificada
    const datos = fs.readFileSync(direccionArchivo, 'utf8');

    // Parsea el JSON para convertirlo en un objeto o arreglo
    const arregloDeNombres = JSON.parse(datos);

    // Ahora puedes recorrer el arreglo de nombres
    arregloDeNombres.forEach((nombre, indice) => {
      //console.log(`Nombre ${indice + 1}: ${nombre}`);
    });

    // También puedes devolver el arreglo para usarlo en otro lugar si es necesario
    return arregloDeNombres;
  } catch (error) {
    console.error(`Error al leer el archivo JSON: ${error}`);
    return null;
  }
};
async function crearCampaña(){
 await ccaca()

  // for(let n = 0 ; i < nombres.length; n++){
  //   await CrearContactList(nombres[n]);

};

function cambiarNombre(nombre){
  if(nombre == 'GARANT�A' || nombre == 'ENV�O'){
    return nombre.replace('�','Í');
  }
  else if(nombre == 'CAMBIOCOMPA�IA'){
    return nombre.replace('�','Ñ');  
  }
  else if(nombre == 'TEL�FONO'){
    return nombre.replace('�','O');

  }else if(nombre == 'N�MERO'){
    return nombre.replace('�','U');
  }
  else{
    return nombre.replace('�','Ó');
  }
}

async function CrearContactList(tableNames,tok) {
  
 
  let commonColumnEspecifications=[{
    "columnName": "id", 
    "columnDataType": "NUMERIC",
    "min": 1,
    "max": 20000,
    "maxLength": 20
  },{
    "columnName": "zone", 
    "columnDataType": "text",
    "min": 1,
    "max": 20000, 
    "maxLength": 10
  }];

  let allColumnNames=[
    "id",
    "zone"
  ];
  let phoneColumnsEspecifications=[];

  let body ={
  "name": "",//CALLIST NAME 
  "division": {
    "id": "700acb56-0791-4af6-87b4-0d396401c646",
    "name": "Guatemala",
    "homeDivision": true,
    "selfUri": "/api/v2/authorization/divisions/700acb56-0791-4af6-87b4-0d396401c646"
  },
  "emailColumns": [],
  "phoneColumns": // Phone Columns Especification
  phoneColumnsEspecifications
  ,
  "columnNames":// ALL COLUMN NAMES 
  allColumnNames
  ,
  "previewModeColumnName": "",
  "previewModeAcceptedValues": [],
  "attemptLimits": null,
  "automaticTimeZoneMapping": false,
  "zipCodeColumnName": null,
  "trimWhitespace": true,
  "columnDataTypeSpecifications": //ESPECIFICACIONES DE COLUMNAS NO TELEFONICAS 
  commonColumnEspecifications
  };
  try {

    const columList=[]
    const resultado=await filtarDatos();
    const nombreTabla=[];
    const nombreColumna=[];
    let lar=0;
   resultado.forEach(col =>{
    lar++;
     // console.log(col.TABLE_NAME)  var evitar = ['SUCCESSRESULT','STATUS','ATTEMPTS','N_','SERV_INI','I3_',"ARPU_Q","VIRTUAL_TINT","ATTEMPTS","ID"]
      if(col.TABLE_NAME === tableNames){
        // if(nombreTabla.some(prefix => prefix.includes(col.TABLE_NAME))){console.log('iteracion '+lar+'Trigger ! '+col.TABLE_NAME)}
        //if(nombreTabla.some(names =>  !names != col.TABLE_NAME  )){        
        if(col.COLUMN_NAME != 'SUCCESSRESULT' && col.COLUMN_NAME != 'STATUS'&& col.COLUMN_NAME != 'ATTEMPTS' && col.COLUMN_NAME !='ZONE' ){
          if(col.COLUMN_NAME !='os' && col.COLUMN_NAME !='AGE' && col.COLUMN_NAME !='T_SERV' && col.COLUMN_NAME != 'SERV_INI' && col.COLUMN_NAME != 'VIRTUAL_TINT' && col.COLUMN_NAME !='ATTEMPTS' && col.COLUMN_NAME !='ID'){
            if(!col.COLUMN_NAME.includes('I3_')){
              nombreTabla.push(col.TABLE_NAME);
              //console.log(cambiarNombre(col.COLUMN_NAME))
              columList.push(col);      
                        
            //}
          }                    
        }  
      }      
    }    
    });

    const callcol=[];
    if(columList.length > 1){

      columList.forEach(tabla =>{
        if(allColumnNames.indexOf(tabla.COLUMN_NAME) === -1 && allColumnNames.some(pre => callcol.indexOf(pre) == -1)){
        let evitarInt=['LONG RAW','BINARY_','FLOAT','NCHAR','NCLOB','ROWID','NUMBER', 'FLOAT','DATE','RAW' ,'CLOB','NCLOB','BLOB' ,'LONG'];
        let evitarString=['empty','ANYDATA','NVARCHAR2','VARCHAR2','CHAR'];
        let evitarDate=['DATE','INTERVAL','TIMESTAMP','DAY'];
        let tipicalPhoneColumnsNames = ["TELEFONO","NUMCEL","NUMCASA","CONTACTO","TEL_CONTACT1","TEL_CONTACT2","TELEFONO1","TELEFONO2","TEL_CONTACTO","NUMERO_FIJO","CONTACTO","TEL_2","TEL_MOVIL","TEL_FIJO","CLIENTE_CONTACTO","TEL_CONTATC1","TEL_CONTATC2","TEL_CONTATC"];
        let tipoDato='';
        const marcacionNombre=[];
        const contactName=tableNames;
        const jsonData = fs.readFileSync(jsonFile, 'utf8');
        const jsonObject = JSON.parse(jsonData);
        const query = "$.DIALERCONFIG2.DIALEROBJECT[?(@._attributes.name =="+"'"+contactName+"'"+")]..contactcolumns._attributes.display_name";
        const calllistDisplayNames = JSONPath({ json: jsonObject, path: query });
        
        const logn=calllistDisplayNames.length;
        //console.log(calllistDisplayNames[0].split('|'))
        
        for(let i = 0;i < evitarInt.length;i++){
          if(tabla.DATA_TYPE.includes(evitarInt[i])){           
            tipoDato='NUMERIC';
          }
        };
        for(let i=0;i < evitarString.length;i++){
          if(tabla.DATA_TYPE.includes(evitarString[i])){            
            tipoDato='TEXT';
          }
        };
        for(let i = 0 ; i < evitarDate.length; i ++ ){
          if(tabla.DATA_TYPE.includes(evitarDate[i])){           
            tipoDato='TIMESTAMP';
          }else{
            tipoDato='TEXT';
          }              
        }; 
        //CONDICIONAl PHONE COLUMNS
        
        if(logn != 0){
          if(calllistDisplayNames.some(prefix => ! allColumnNames.includes(prefix))){
          if(logn ==1){
            console.log('lgn == 1');
            if(calllistDisplayNames[0].split('|').length == 3){
              if(allColumnNames.indexOf(calllistDisplayNames[0].split('|')[1]) === -1 ){
              allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
              callcol.push(calllistDisplayNames[0].split('|')[1]);
              phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"});           
              };
            }else if(calllistDisplayNames[0].split('|').length == 4){
              if(allColumnNames.indexOf(calllistDisplayNames[0].split('|')[1]) === -1 && allColumnNames.indexOf(calllistDisplayNames[0].split('|')[2]) === -1 ){
              allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
              callcol.push(calllistDisplayNames[0].split('|')[1]);
              phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"});     
              
              allColumnNames.push(calllistDisplayNames[0].split('|')[2]);
              callcol.push(calllistDisplayNames[0].split('|')[2]);
              phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[2],"type": "Móvil"});           
              };
            }else if(calllistDisplayNames[0].split('|').length == 5){
              if(allColumnNames.indexOf(calllistDisplayNames[0].split('|')[1]) === -1 && allColumnNames.indexOf(calllistDisplayNames[0].split('|')[2]) === -1 && allColumnNames.indexOf(calllistDisplayNames[0].split('|')[3]) === -1 ){
              allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
              callcol.push(calllistDisplayNames[0].split('|')[1]);
              phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"});     
              
              allColumnNames.push(calllistDisplayNames[0].split('|')[2]);
              callcol.push(calllistDisplayNames[0].split('|')[2]);
              phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[2],"type": "Móvil"});     
              
              allColumnNames.push(calllistDisplayNames[0].split('|')[3]);
              callcol.push(calllistDisplayNames[0].split('|')[3]);
              phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[3],"type": "Móvil"});     
              }
            }
          }else if(logn == 2){
            console.log('lgn == 2');
            if(allColumnNames.indexOf(calllistDisplayNames[0].split('|')[1]) === -1 && allColumnNames.indexOf(calllistDisplayNames[1].split('|')[1]) === -1){

            
            if(calllistDisplayNames[0].split('|') == calllistDisplayNames[1].split('|')){

              console.log('Los campos son iguales, guardando solo un registro ');
              if(calllistDisplayNames[0].split('|').length == 3){
                console.log('display length  == 3');
                if(allColumnNames.indexOf(calllistDisplayNames[0].split('|')[1]) === -1 ){
                console.log('solo un objeto ');
                consle.log('guardando! ');
                allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                callcol.push(calllistDisplayNames[0].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"});   
                }  
              }else if(calllistDisplayNames[0].split('|').length == 4){console.log('display length  == 4');
                if(allColumnNames.indexOf(calllistDisplayNames[0].split('|')[1]) === -1 && allColumnNames.indexOf(calllistDisplayNames[0].split('|')[2]) === -1  ){
                console.log('dos objetos guardando ! ');
                
                allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                callcol.push(calllistDisplayNames[0].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"}); 
                
                allColumnNames.push(calllistDisplayNames[0].split('|')[2]);
                callcol.push(calllistDisplayNames[0].split('|')[2]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[2],"type": "Móvil"}); 
                }
              }else if(calllistDisplayNames[0].split('|').length == 5){
                console.log('display length  == 5');
                if(allColumnNames.indexOf(calllistDisplayNames[0].split('|')[1]) === -1 && allColumnNames.indexOf(calllistDisplayNames[0].split('|')[2]) === -1 && allColumnNames.indexOf(calllistDisplayNames[0].split('|')[3]) ===-1 ){
                consle.log('Son tres objetos, almacenando .. ');
                allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                callcol.push(calllistDisplayNames[0].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"}); 
                
                allColumnNames.push(calllistDisplayNames[0].split('|')[2]);
                callcol.push(calllistDisplayNames[0].split('|')[2]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[2],"type": "Móvil"}); 
                
                allColumnNames.push(calllistDisplayNames[0].split('|')[3]);
                callcol.push(calllistDisplayNames[0].split('|')[3]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[3],"type": "Móvil"}); 
              }
              }
            }else{
              console.log('else lgn == 2');
              if(allColumnNames.indexOf(calllistDisplayNames[0].split('|')[1] ) ===-1 && allColumnNames.indexOf(calllistDisplayNames[1].split('|')[1] === -1 )){
              
              if(calllistDisplayNames[0].split('|').length == 3 && calllistDisplayNames[1].split('|').length == 3){
                console.log('else lgn == 2 calllistDisplayNames[0].split().length = 3');
                if(calllistDisplayNames[0].split('|')[1] == calllistDisplayNames[1].split('|')[1]){
                allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                callcol.push(calllistDisplayNames[0].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"}); 
              }else{
              allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
              callcol.push(calllistDisplayNames[0].split('|')[1]);
              phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"}); 
              
              
              allColumnNames.push(calllistDisplayNames[1].split('|')[1]);
              callcol.push(calllistDisplayNames[1].split('|')[1]);
              phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[1],"type": "Móvil"}); 
              }
              }else if(calllistDisplayNames[0].split('|').length == 4 && calllistDisplayNames[1].split('|').length == 4){
                console.log('else lgn == 2 calllistDisplayNames[0].split().length = 4');
                console.log('ambos contienen dos elelementos ');

                if( calllistDisplayNames[0].split('|')[1] != calllistDisplayNames[0].split('|')[2] && calllistDisplayNames[0].split('|')[1] != calllistDisplayNames[1].split('|')[1] ){  
               allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                callcol.push(calllistDisplayNames[0].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"}); 
                
                allColumnNames.push(calllistDisplayNames[0].split('|')[2]);
                callcol.push(calllistDisplayNames[0].split('|')[2]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[2],"type": "Móvil"}); 
                
                
                allColumnNames.push(calllistDisplayNames[1].split('|')[1]);
                callcol.push(calllistDisplayNames[1].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[1],"type": "Móvil"}); 
                
                allColumnNames.push(calllistDisplayNames[1].split('|')[2]);
                callcol.push(calllistDisplayNames[1].split('|')[2]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[2],"type": "Móvil"}); }
                
              }else if(calllistDisplayNames[0].split('|').length == 5 && calllistDisplayNames[1].split('|').length == 5){
                console.log('else lgn == 2 calllistDisplayNames[0].split().length = 5');
                allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                callcol.push(calllistDisplayNames[0].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"}); 
                
                allColumnNames.push(calllistDisplayNames[0].split('|')[2]);
                callcol.push(calllistDisplayNames[0].split('|')[2]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[2],"type": "Móvil"}); 
                
                allColumnNames.push(calllistDisplayNames[0].split('|')[3]);
                callcol.push(calllistDisplayNames[0].split('|')[3]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[3],"type": "Móvil"}); 


                allColumnNames.push(calllistDisplayNames[1].split('|')[1]);
                callcol.push(calllistDisplayNames[1].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[1],"type": "Móvil"}); 
                
                allColumnNames.push(calllistDisplayNames[1].split('|')[2]);
                callcol.push(calllistDisplayNames[1].split('|')[2]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[2],"type": "Móvil"}); 
                
                allColumnNames.push(calllistDisplayNames[1].split('|')[3]);
                callcol.push(calllistDisplayNames[1].split('|')[3]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[3],"type": "Móvil"}); 


                allColumnNames.push(calllistDisplayNames[2].split('|')[1]);
                callcol.push(calllistDisplayNames[2].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[1],"type": "Móvil"}); 
                
                allColumnNames.push(calllistDisplayNames[2].split('|')[2]);
                callcol.push(calllistDisplayNames[2].split('|')[2]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[2],"type": "Móvil"}); 
                
                allColumnNames.push(calllistDisplayNames[2].split('|')[3]);
                callcol.push(calllistDisplayNames[2].split('|')[3]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[3],"type": "Móvil"}); 
              }else if(calllistDisplayNames[0].split('|').length == 3 || calllistDisplayNames[1].split('|').length == 3){
                if(calllistDisplayNames[0].split('|').length == 3){
                  console.log('else lgn == 2 calllistDisplayNames[0].split().length = 3 single !');
                  
                allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                callcol.push(calllistDisplayNames[0].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"}); 
                }if(calllistDisplayNames[1].split('|').length == 3){
                  console.log('else lgn == 2 calllistDisplayNames[1].split().length = 3 single !');
                allColumnNames.push(calllistDisplayNames[1].split('|')[1]);
                callcol.push(calllistDisplayNames[1].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[1],"type": "Móvil"}); 
                }
              }
            }
            }
          }
          }else if(logn == 3){
            console.log('lgn == 3');
            console.log('Son tres objetos en el arreglo ! \nverificando que no sean iguales ');
            if(calllistDisplayNames[0].split('|') == calllistDisplayNames[1].split('|') && calllistDisplayNames[0].split('|') ==calllistDisplayNames[2].split('|') ){
              //calllistDisplayNames[0].split('|').length == 3
              console.log('Son iguales almacenando array 1');
              if(calllistDisplayNames[0].split('|').length == 3 ){
                console.log('Un solo elemento');
                allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                callcol.push(calllistDisplayNames[0].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"}); 
              }else if(calllistDisplayNames[0].split('|').length == 4){
                
                allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                callcol.push(calllistDisplayNames[0].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"}); 
                
                allColumnNames.push(calllistDisplayNames[0].split('|')[2]);
                callcol.push(calllistDisplayNames[0].split('|')[2]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[2],"type": "Móvil"}); 
              }else if(calllistDisplayNames[0].split('|').length == 5){

                allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                callcol.push(calllistDisplayNames[0].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"}); 
                
                allColumnNames.push(calllistDisplayNames[0].split('|')[2]);
                callcol.push(calllistDisplayNames[0].split('|')[2]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[2],"type": "Móvil"}); 

                allColumnNames.push(calllistDisplayNames[0].split('|')[3]);
                callcol.push(calllistDisplayNames[0].split('|')[3]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[3],"type": "Móvil"}); 
                
              }

            }else{
              console.log('else lgn =');
              if(calllistDisplayNames[0].split('|').length == 3 || calllistDisplayNames[1].split('|').length == 3||calllistDisplayNames[2].split('|').length == 3){
                      if(calllistDisplayNames[0].split('|').length == 3){                  

                allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                callcol.push(calllistDisplayNames[0].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"}); 
                
                }else if(calllistDisplayNames[1].split('|').length == 3){                  
                  
                  allColumnNames.push(calllistDisplayNames[1].split('|')[1]);
                  callcol.push(calllistDisplayNames[1].split('|')[1]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[1],"type": "Móvil"}); 
                  
                }else if(calllistDisplayNames[2].split('|').length == 3){
                  
                  allColumnNames.push(calllistDisplayNames[2].split('|')[1]);
                  callcol.push(calllistDisplayNames[2].split('|')[1]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[1],"type": "Móvil"}); 
                  
                }else if(calllistDisplayNames[0].split('|').length == 4){                  
                  
                  allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                  callcol.push(calllistDisplayNames[0].split('|')[1]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"}); 
                  
                  allColumnNames.push(calllistDisplayNames[0].split('|')[2]);
                  callcol.push(calllistDisplayNames[0].split('|')[2]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[2],"type": "Móvil"}); 
                  
                }else if(calllistDisplayNames[1].split('|').length == 4){                  
                  
                  allColumnNames.push(calllistDisplayNames[1].split('|')[1]);
                  callcol.push(calllistDisplayNames[1].split('|')[1]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[1],"type": "Móvil"}); 
                  
                  allColumnNames.push(calllistDisplayNames[1].split('|')[2]);
                  callcol.push(calllistDisplayNames[1].split('|')[2]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[2],"type": "Móvil"}); 
                  
                }else if(calllistDisplayNames[2].split('|').length == 4){
                  allColumnNames.push(calllistDisplayNames[2].split('|')[1]);
                  callcol.push(calllistDisplayNames[2].split('|')[1]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[1],"type": "Móvil"}); 
                  
                  allColumnNames.push(calllistDisplayNames[2].split('|')[2]);
                  callcol.push(calllistDisplayNames[2].split('|')[2]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[2],"type": "Móvil"}); 
                }else if(calllistDisplayNames[0].split('|').length == 5){
                  allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                  callcol.push(calllistDisplayNames[0].split('|')[1]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1],"type": "Móvil"}); 

                  
                  allColumnNames.push(calllistDisplayNames[0].split('|')[2]);
                  callcol.push(calllistDisplayNames[0].split('|')[2]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[2],"type": "Móvil"}); 
                  
                  allColumnNames.push(calllistDisplayNames[0].split('|')[3]);
                  callcol.push(calllistDisplayNames[0].split('|')[3]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[3],"type": "Móvil"}); 
                }else if(calllistDisplayNames[1].split('|').length == 5){
                  allColumnNames.push(calllistDisplayNames[1].split('|')[1]);
                  callcol.push(calllistDisplayNames[1].split('|')[1]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[1],"type": "Móvil"}); 

                  
                  allColumnNames.push(calllistDisplayNames[1].split('|')[2]);
                  callcol.push(calllistDisplayNames[1].split('|')[2]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[2],"type": "Móvil"}); 
                  
                  allColumnNames.push(calllistDisplayNames[1].split('|')[3]);
                  callcol.push(calllistDisplayNames[1].split('|')[3]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[3],"type": "Móvil"}); 
                }else if(calllistDisplayNames[2].split('|').length == 5){
                  allColumnNames.push(calllistDisplayNames[2].split('|')[1]);
                  callcol.push(calllistDisplayNames[2].split('|')[1]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[1],"type": "Móvil"}); 

                  
                  allColumnNames.push(calllistDisplayNames[2].split('|')[2]);
                  callcol.push(calllistDisplayNames[2].split('|')[2]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[2],"type": "Móvil"}); 
                  
                  allColumnNames.push(calllistDisplayNames[2].split('|')[3]);callcol.push(calllistDisplayNames[2].split('|')[3]);
                  phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[3],"type": "Móvil"}); 
                }
              }
              
              
            
            }
          }else{
            console.log('');
          }
        } 
        }else{
        console.log('Error so se obtuvieron resultados :c');
        UpdateFile(tableNames);
        }
      
        //CONDICIONAL PHONE COLUMNS
        let phoneNames =[''];
        if(allColumnNames.indexOf(tabla.COLUMN_NAME) == -1){

          allColumnNames.push(cambiarNombre(tabla.COLUMN_NAME));                                                 
          callcol.push(tabla.COLUMN_NAME);
          if(!phoneNames.includes(tabla.COLUMN_NAME)){
            phoneNames.push(tabla.COLUMN_NAME);
            commonColumnEspecifications.push({
              "columnName": cambiarNombre(tabla.COLUMN_NAME), 
              "columnDataType": tipoDato,
              "min": 1,
              "max": 20000,
              "maxLength": 10
            });
          };
        };
                  
       
   
        
        body ={
          "name": tabla.TABLE_NAME,//CALLIST NAME 
          "division": {
            "id": "700acb56-0791-4af6-87b4-0d396401c646",
            "name": "Guatemala",
            "homeDivision": true,
            "selfUri": "/api/v2/authorization/divisions/700acb56-0791-4af6-87b4-0d396401c646"
          },
          "emailColumns": [],
          "phoneColumns": // Phone Columns Especification
          phoneColumnsEspecifications
          ,
          "columnNames":// ALL COLUMN NAMES 
          allColumnNames
          ,
          "previewModeColumnName": "",
          "previewModeAcceptedValues": [],
          "attemptLimits": null,
          "automaticTimeZoneMapping": false,
          "zipCodeColumnName": null,
          "trimWhitespace": true,
          "columnDataTypeSpecifications": //ESPECIFICACIONES DE COLUMNAS NO TELEFONICAS 
          commonColumnEspecifications
         };
       
     } });//forEach tabla 
      
      //console.log(JSON.stringify(body,null,4));   
        
      //UpdateFile(tabla.TABLE_NAME);
      console.log(body);
      client.setEnvironment(platformClient.PureCloudRegionHosts.ca_central_1);
      client.setAccessToken(tok);
      let apiInstance = new platformClient.OutboundApi();
      console.log('ENVIANDO BODY REQUEST = ');
      console.log(body);
      apiInstance.postOutboundContactlists(body).then((data) => {
        console.log('Funciono !!! !!!!!!!!!!!!!');
        console.log(JSON.stringify(data,null,4));
      //   let datte=new Date().toLocaleString();
      //   UpdateLog('Contact list  creada-------------------='+datte);  
           UpdateFile(tableNames);//guardando nombre de tabla en archivo 
      //   console.log(`postOutboundContactlists success! data: ${JSON.stringify(data, null, 2)}`);
      //   UpdateLog('Nombre: '+data.name);
      //   UpdateLog('Id: '+data.id);
      //   UpdateLog('Creado a : '+data.dateCreated);
      //   UpdateLog('En la división id: '+data.division.id);
      //   UpdateLog('En la división nombre: '+data.division.name);
      //   UpdateLog('En la división id: '+JSON.stringify(data));
      //   UpdateLog('Contact list  creada-------------------='+datte);                                  
      }).catch((err) => {
        console.log('Error !!!!');
        console.log(err);
      //   let dattte=new Date().toLocaleString();
      //   UpdateLog('Request ERROR-------------------='+dattte);         
      //   UpdateLog('Error ='+JSON.stringify(err));
           UpdateLog('Error !'+JSON.stringify(body)+'\n error '+JSON.stringify(err));
      //   UpdateLog('Request ERROR-------------------='+dattte);
      //   console.log("There was a failure calling postOutboundContactlists");
      //   console.error(err);
      //   throw new Error("Error OUTBOUND CONTACT LIST  = "+JSON.stringify(err,null,1));                   
      });
     // return body ;
    }else{
      console.log('Arrray vacio ! ');
      console.log('BUSCANDO EN ARCHIVO XML Y CREANDO SOLO COLUMNAS TELEFONICAS :C');
      const contactName=tableNames;
      const jsonData = fs.readFileSync(jsonFile, 'utf8');
      const jsonObject = JSON.parse(jsonData);
      const query = "$.DIALERCONFIG2.DIALEROBJECT[?(@._attributes.name =="+"'"+contactName+"'"+")]..contactcolumns._attributes.display_name";
      const calllistDisplayNames = JSONPath({ json: jsonObject, path: query });      
      const columNames=[calllistDisplayNames.toString().slice(1, -1).split('|')];
      const logn=calllistDisplayNames.length;
      console.log('CalllistDisplanName'+calllistDisplayNames);
   
      let commonColumnEspecifications=[{
        "columnName": "id", 
        "columnDataType": "NUMERIC",
        "min": 1,
        "max": 20000,
        "maxLength": 30
      },{
        "columnName": "zone", 
        "columnDataType": "text",
        "min": 1,
        "max": 20000,
        "maxLength": 30
      }];
  
      let allColumnNames=[
        "id",
        "zone"
      ];
      let phoneColumnsEspecifications=[];
      let body ={
        "name": tableNames,//CALLIST NAME 
        "division": {
          "id": "700acb56-0791-4af6-87b4-0d396401c646",
          "name": "Guatemala",
          "homeDivision": true,
          "selfUri": "/api/v2/authorization/divisions/700acb56-0791-4af6-87b4-0d396401c646"
        },
        "emailColumns": [],
        "phoneColumns": // Phone Columns Especification
        phoneColumnsEspecifications
        ,
        "columnNames":// ALL COLUMN NAMES 
        allColumnNames
        ,
        "previewModeColumnName": "",
        "previewModeAcceptedValues": [],
        "attemptLimits": null,
        "automaticTimeZoneMapping": false,
        "zipCodeColumnName": null,
        "trimWhitespace": true,
        "columnDataTypeSpecifications": //ESPECIFICACIONES DE COLUMNAS NO TELEFONICAS 
        commonColumnEspecifications
        };
      var phoneColumn='';
      var phoneColumn1='';
      var phoneColumn2='';
      var phoneColumn3='';
      if(logn != 0){
        if(allColumnNames.some(prefix => !calllistDisplayNames.includes(prefix) )){
        if(logn == 1){
          if(calllistDisplayNames[0].split('|').length <= 3){
            
            console.log('es solo un valor !  ');
            console.log('Calist DISPLAY NAMES'+calllistDisplayNames)
            console.log('Calist DISPLAY NAMES [0].split("|")[1]  ='+ calllistDisplayNames[0].split('|')[1]);
            phoneColumn1=calllistDisplayNames[0].split('|')[1];     
            allColumnNames.push(phoneColumn1);
            phoneColumnsEspecifications.push({
              "columnName": phoneColumn1
            ,"type": "Móvil"});
            }

            else if(calllistDisplayNames.toString().split('|').length == 4){
              phoneColumn1=calllistDisplayNames[0].split('|')[1];
              phoneColumn2=calllistDisplayNames[0].split('|')[2];
              allColumnNames.push(phoneColumn1);
              allColumnNames.push(phoneColumn2);
              phoneColumnsEspecifications.push({
                "columnName": phoneColumn1
              ,"type": "Móvil"});
              phoneColumnsEspecifications.push({
                "columnName": phoneColumn2
              ,"type": "Móvil"});
            }else if(calllistDisplayNames.toString().split('|').length == 5){
              phoneColumn1=calllistDisplayNames[0].split('|')[1];
              phoneColumn2=calllistDisplayNames[0].split('|')[2];
              phoneColumn3=calllistDisplayNames[0].split('|')[3];
              allColumnNames.push(phoneColumn1);
              allColumnNames.push(phoneColumn2);
              allColumnNames.push(phoneColumn3);
              phoneColumnsEspecifications.push({
                "columnName": phoneColumn1
              ,"type": "Móvil"});
              phoneColumnsEspecifications.push({
                "columnName": phoneColumn2
              ,"type": "Móvil"});
              phoneColumnsEspecifications.push({
                "columnName": phoneColumn3
              ,"type": "Móvil"});
            }
            
        
        }else if(logn == 2){
          phoneColumn1=calllistDisplayNames[0];
          phoneColumn2=calllistDisplayNames[1];
          if( phoneColumn1 != phoneColumn2){
            phoneColumnsEspecifications.push({
              "columnName": phoneColumn1.replace('|','').replace('|','')
            ,"type": "Móvil"});
            phoneColumnsEspecifications.push({
              "columnName": phoneColumn2.replace('|','').replace('|','')
            ,"type": "Móvil"});
            allColumnNames.push(phoneColumn1);
            allColumnNames.push(phoneColumn2);
          }else{
            if(calllistDisplayNames[0].split('|').length <=3){
            phoneColumnsEspecifications.push({
              "columnName": phoneColumn1.replace('|','').replace('|','')
            ,"type": "Móvil"});
            allColumnNames.push(phoneColumn1.replace('|','').replace('|',''));
            }else if(calllistDisplayNames[0].split('|').length ==4){
              phoneColumn1=calllistDisplayNames[0].split('|')[1];
              phoneColumn2=calllistDisplayNames[0].split('|')[2];
              phoneColumnsEspecifications.push({
                "columnName": phoneColumn1
              ,"type": "Móvil"});
              phoneColumnsEspecifications.push({
                "columnName": phoneColumn2
              ,"type": "Móvil"});
              allColumnNames.push(phoneColumn1);
              allColumnNames.push(phoneColumn2);
            }else if(calllistDisplayNames[0].split('|').length ==5){
              phoneColumn1=calllistDisplayNames[0].split('|')[1];
              phoneColumn2=calllistDisplayNames[0].split('|')[2];
              phoneColumn3=calllistDisplayNames[0].split('|')[3];
              phoneColumnsEspecifications.push({
                "columnName": phoneColumn1
              ,"type": "Móvil"});
              phoneColumnsEspecifications.push({
                "columnName": phoneColumn2
              ,"type": "Móvil"});
              phoneColumnsEspecifications.push({
                "columnName": phoneColumn3
              ,"type": "Móvil"});
              allColumnNames.push(phoneColumn1);
              allColumnNames.push(phoneColumn2);
              allColumnNames.push(phoneColumn3);
            }
          }
          
        }else if(logn == 3){
          phoneColumn1=calllistDisplayNames[0].toString().replace('|','').replace('|','');
          phoneColumn2=calllistDisplayNames[1].toString().replace('|','').replace('|','');
          phoneColumn=calllistDisplayNames[2].toString().replace('|','').replace('|','');
          if(phoneColumn1 != phoneColumn2 &&  phoneColumn1 != phoneColumn3 && phoneColumn3 !=phoneColumn2){
            phoneColumnsEspecifications.push({"columnName":phoneColumn1
                                            ,"type": "Móvil"});
            phoneColumnsEspecifications.push({"columnName":phoneColumn2
                                            ,"type": "Móvil"});
            phoneColumnsEspecifications.push({"columnName":phoneColumn3
                                            ,"type": "Móvil"});
            allColumnNames.push(phoneColumn1);
            allColumnNames.push(phoneColumn2);
            allColumnNames.push(phoneColumn3);
          }else{//var1 = 1 , var2 = 50  var3=  50 
            if( phoneColumn1 != phoneColumn2 && phoneColumn1 != phoneColumn3 ){
              if(calllistDisplayNames[0].split('|').length >=3){
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
              }else if (calllistDisplayNames[0].split('|').length ==4){
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[2]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[0].split('|')[2]);
              }else if (calllistDisplayNames[0].split('|').length ==5){
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[1]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[0].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[2]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[0].split('|')[2]);

                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[0].split('|')[3]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[0].split('|')[3]);

              }
              
            

            }if(phoneColumn2 != phoneColumn1 && phoneColumn2 != phoneColumn3){
              //PHONECOLUMN 2
              if(calllistDisplayNames[1].split('|').length >=3){
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[1]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[1].split('|')[1]);
              }else if (calllistDisplayNames[1].split('|').length ==4){
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[1]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[1].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[2]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[1].split('|')[2]);
              }else if (calllistDisplayNames[1].split('|').length ==5){
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[1]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[1].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[2]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[1].split('|')[2]);

                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[1].split('|')[3]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[1].split('|')[3]);

              }
            //PHONECOLUMN  2
            }if(phoneColumn3 != phoneColumn2 && phoneColumn3 != phoneColumn1){
              //phonecolumn 3
              if(calllistDisplayNames[2].split('|').length >=3){
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[1]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[2].split('|')[1]);
                callcol.push(calllistDisplayNames[2].split('|')[1]);
              }else if (calllistDisplayNames[2].split('|').length ==4){
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[1]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[2].split('|')[1]);
                callcol.push(calllistDisplayNames[2].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[2]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[2].split('|')[2]);
                callcol.push(calllistDisplayNames[2].split('|')[2]);
              }else if (calllistDisplayNames[2].split('|').length ==5){
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[1]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[2].split('|')[1]);
                callcol.push(calllistDisplayNames[2].split('|')[1]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[2]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[2].split('|')[2]);
                callcol.push(calllistDisplayNames[2].split('|')[2]);
                phoneColumnsEspecifications.push({"columnName":calllistDisplayNames[2].split('|')[3]
                ,"type": "Móvil"});
      
                allColumnNames.push(calllistDisplayNames[2].split('|')[3]);
                callcol.push(calllistDisplayNames[2].split('|')[3]);
              }
            }
            //phonecolumn 3
          }
        }else{
          console.log('Error no se encontraron datos en la query favor reintentar ');
          throw new Error('No se obtuvieron datos y se atraveso el condicional')
        }
        body ={
          "name": tableNames,//CALLIST NAME 
          "division": {
            "id": "700acb56-0791-4af6-87b4-0d396401c646",
            "name": "Guatemala",
            "homeDivision": true,
            "selfUri": "/api/v2/authorization/divisions/700acb56-0791-4af6-87b4-0d396401c646"
          },
          "emailColumns": [],
          "phoneColumns": // Phone Columns Especification
          phoneColumnsEspecifications
          ,
          "columnNames":// ALL COLUMN NAMES 
          allColumnNames
          ,
          "previewModeColumnName": "",
          "previewModeAcceptedValues": [],
          "attemptLimits": null,
          "automaticTimeZoneMapping": false,
          "zipCodeColumnName": null,
          "trimWhitespace": true,
          "columnDataTypeSpecifications": //ESPECIFICACIONES DE COLUMNAS NO TELEFONICAS 
          commonColumnEspecifications
        };

        client.setEnvironment(platformClient.PureCloudRegionHosts.ca_central_1);
        client.setAccessToken(tok);
        let apiInstance = new platformClient.OutboundApi();
         apiInstance.postOutboundContactlists(body).then((data) => {
          console.log(JSON.stringify(data));
        //     let datte=new Date().toLocaleString();
        //     UpdateLog('Contact list  creada-------------------='+datte);  
             UpdateFile(tableNames);//guardando nombre de tabla en archivo 
        //     console.log(`postOutboundContactlists success! data: ${JSON.stringify(data, null, 2)}`);
        //     UpdateLog('Nombre: '+data.name);
        //     UpdateLog('Id: '+data.id);
        //     UpdateLog('Creado a : '+data.dateCreated);
        //     UpdateLog('En la división id: '+data.division.id);
        //     UpdateLog('En la división nombre: '+data.division.name);
        //     UpdateLog('En la división id: '+JSON.stringify(data));
        //     UpdateLog('Contact list  creada-------------------='+datte);                                  
          }).catch((err) => {
            console.log(err);
        //     error+=1;
        //     let dattte=new Date().toLocaleString();
        //     UpdateLog('Request ERROR-------------------='+dattte);         
             UpdateLog('Error ='+JSON.stringify(err)+' BODY REQUEST \n'+JSON.stringify(body));
        //     UpdateLog('ERROR = '+JSON.stringify(body));
        //     UpdateLog('Request ERROR-------------------='+dattte);
        //     console.log("There was a failure calling postOutboundContactlists");
        //     console.error(err);
        //     throw new Error("Error OUTBOUND CONTACT LIST  = "+JSON.stringify(err,null,1));                   
        });




        return body;
        //actualizacion de body en caso de que se encuetre algo en el XML 
        
      }
      }else{
        console.log('No se obtuvieron registros ');
        phoneColumnsEspecifications.push({"columnName": "TELEFONO"
        ,"type": "Móvil"});
        allColumnNames.push("TELEFONO")
      }//No se encontraron datos en el xml
      
      body ={
      "name": tableNames,//CALLIST NAME 
      "division": {
        "id": "700acb56-0791-4af6-87b4-0d396401c646",
        "name": "Guatemala",
        "homeDivision": true,
        "selfUri": "/api/v2/authorization/divisions/700acb56-0791-4af6-87b4-0d396401c646"
      },
      "emailColumns": [],
      "phoneColumns": // Phone Columns Especification
      phoneColumnsEspecifications
      ,
      "columnNames":// ALL COLUMN NAMES 
      allColumnNames
      ,
      "previewModeColumnName": "",
      "previewModeAcceptedValues": [],
      "attemptLimits": null,
      "automaticTimeZoneMapping": false,
      "zipCodeColumnName": null,
      "trimWhitespace": true,
      "columnDataTypeSpecifications": //ESPECIFICACIONES DE COLUMNAS NO TELEFONICAS 
      commonColumnEspecifications
      };
      
      //console.log(JSON.stringify(body,null,4));
      client.setEnvironment(platformClient.PureCloudRegionHosts.ca_central_1);
      client.setAccessToken(tok);
      let apiInstance = new platformClient.OutboundApi();
       apiInstance.postOutboundContactlists(body).then((data) => {
        console.log('Funciono !!! !!!!!!!!!!!!!');
        console.log(JSON.stringify(data,null,4));
      //     let datte=new Date().toLocaleString();
      //     UpdateLog('Contact list  creada-------------------='+datte);  
           UpdateFile(tableNames);//guardando nombre de tabla en archivo 
      //     console.log(`postOutboundContactlists success! data: ${JSON.stringify(data, null, 2)}`);
      //     UpdateLog('Nombre: '+data.name);
      //     UpdateLog('Id: '+data.id);
      //     UpdateLog('Creado a : '+data.dateCreated);
      //     UpdateLog('En la división id: '+data.division.id);
      //     UpdateLog('En la división nombre: '+data.division.name);
      //     UpdateLog('En la división id: '+JSON.stringify(data));
      //     UpdateLog('Contact list  creada-------------------='+datte);                                  
        }).catch((err) => {
          console.log('Error !!!!');console.log(err);

          UpdateFile(tableNames);
      //     error+=1;
      //     let dattte=new Date().toLocaleString();
      //     UpdateLog('Request ERROR-------------------='+dattte);         
          // UpdateLog('Error ='+JSON.stringify(err)+' BODY REQUEST \n'+JSON.stringify(body));
      //     UpdateLog('ERROR = '+JSON.stringify(body));
      //     UpdateLog('Request ERROR-------------------='+dattte);
      //     console.log("There was a failure calling postOutboundContactlists");
      //     console.error(err);
      //     throw new Error("Error OUTBOUND CONTACT LIST  = "+JSON.stringify(err,null,1));                   
      });
      return body;
    }//ARRAY VACIO CONDICIONAL 

       
    
    
  } catch (e) {
    console.log('Error ' + e);
    let dattte=new Date().toLocaleString();
    UpdateLog('Request ERROR-------------------='+dattte);         
    UpdateLog('Error DE CODIGO  ='+e);
    UpdateLog('Request ERROR-------------------='+dattte);
    console.error(e);
    console.log('Error = '+e)
  }
};


export {
  crearCampaña
};