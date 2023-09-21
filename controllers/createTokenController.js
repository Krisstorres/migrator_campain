import axios from 'axios';
import platformClient from 'purecloud-platform-client-v2'; 
import { createToken } from '../utils/getToken.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSONPath } from "jsonpath-plus";
import {UpdateFile} from '../utils/saveInfo.js';
import { UpdateLog } from '../utils/loger.js'; 
import {filtarDatos} from '../utils/sandBox.js';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);
const jsonFile = path.join(__dirname, '../static/documents/archivo.json');
const outPutData = path.join(__dirname, '../static/documents/output.csv');  
const tablas_Gt=path.join(__dirname, '../static/documents/tablas_GT.csv');  
const tablas_procesadas=path.join(__dirname,'../static/documents/tablasProcesadas.json')
const nameList=path.join(__dirname,'../static/documents/nameList.json')
const sinRepetir=path.join(__dirname,'../static/documents/sinRepetir.json')
const axxios=axios.defaults;

let client = platformClient.ApiClient.instance;

function getPhoneColumns(entrada){
  const datosLimpio = entrada.join('');
  const elementos = datosLimpio.split('|').filter(item => item !== '');
  let elementosUnicos = [...new Set(elementos)];
  elementosUnicos=elementosUnicos.sort();
  //console.log(elementosUnicos);
  return elementosUnicos;
};

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
};//Funcion para leer el archivo JSON 


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
}//Cambiar nombres con simbolos no codificados

//Funcion para migrar las campañas masivamente 
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
  try{
  //{      
    const contactName=tableNames;
    const jsonData = fs.readFileSync(jsonFile, 'utf8');
    const jsonObject = JSON.parse(jsonData);
    const query = "$.DIALERCONFIG2.DIALEROBJECT[?(@._attributes.name =="+"'"+contactName+"'"+")]..contactcolumns._attributes.display_name";
    const calllistDisplayNames = JSONPath({ json: jsonObject, path: query });
  //} => QUERY PARA SACAR LAS COLUMN NAMES 
  
  //{
    const callisName=tableNames;
    const jsonData2 = fs.readFileSync(jsonFile, 'utf8');
    const jsonObject2 = JSON.parse(jsonData);
    const query2 = "$.DIALERCONFIG2.DIALEROBJECT[?(@._attributes.name =="+"'"+callisName+"'"+")].PROPERTIES.calllisttable._text";
    const calllistDisplayNames2 = JSONPath({ json: jsonObject, path: query2 });
  //} => QUERY PARA OBTENER EL CALLISTABLE 

    const columList=[]
    const resultado=await filtarDatos();
    const nombreTabla=[];
    const nombreColumna=[];
    let lar=0;
    resultado.forEach(col =>{
      lar++;
     // console.log(col.TABLE_NAME)  var evitar = ['SUCCESSRESULT','STATUS','ATTEMPTS','N_','SERV_INI','I3_',"ARPU_Q","VIRTUAL_TINT","ATTEMPTS","ID"]
      if(col.TABLE_NAME === calllistDisplayNames2[0]){
        // if(nombreTabla.some(prefix => prefix.includes(col.TABLE_NAME))){console.log('iteracion '+lar+'Trigger ! '+col.TABLE_NAME)}
        //if(nombreTabla.some(names =>  !names != col.TABLE_NAME  )){        
        if(col.COLUMN_NAME != 'SUCCESSRESULT' && col.COLUMN_NAME != 'STATUS'&& col.COLUMN_NAME != 'ATTEMPTS' && col.COLUMN_NAME !='ZONE'  ){
          if(col.COLUMN_NAME !='ID'){
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

      for(let index in columList){
      //for que que corta los procesos 
        const tabla=columList[index];        
        let evitarInt=['LONG RAW','BINARY_','FLOAT','NCHAR','NCLOB','ROWID','NUMBER', 'FLOAT','DATE','RAW' ,'CLOB','NCLOB','BLOB' ,'LONG'];
        let evitarString=['empty','ANYDATA','NVARCHAR2','VARCHAR2','CHAR'];
        let evitarDate=['DATE','INTERVAL','TIMESTAMP','DAY'];        
        let tipoDato='';//tipo de dato a almacenar !                         
        for(let i = 0;i < evitarInt.length;i++){
          if(tabla.DATA_TYPE.includes(evitarInt[i])){           
            tipoDato='NUMERIC';
          };
        };
        for(let i=0;i < evitarString.length;i++){
          if(tabla.DATA_TYPE.includes(evitarString[i])){            
            tipoDato='TEXT';
          };
        };
        for(let i = 0 ; i < evitarDate.length; i ++ ){
          if(tabla.DATA_TYPE.includes(evitarDate[i])){           
            tipoDato='TIMESTAMP';
          }else{
            tipoDato='TEXT';
          };              
        };      
        const phoneColums = getPhoneColumns(calllistDisplayNames);  
        for(let index in phoneColums ){
          const phoneCollumn=phoneColums[index];
          if(allColumnNames.indexOf(phoneCollumn) == -1){
          allColumnNames.push(phoneCollumn);
          phoneColumnsEspecifications.push({"columnName":phoneCollumn,"type": "Móvil"});
          }
        }
        if(allColumnNames.indexOf(tabla.COLUMN_NAME) == -1){
          allColumnNames.push(cambiarNombre(tabla.COLUMN_NAME));                                                 
          callcol.push(tabla.COLUMN_NAME);
            commonColumnEspecifications.push({
              "columnName": cambiarNombre(tabla.COLUMN_NAME), 
              "columnDataType": tipoDato,
              "min": 1,
              "max": 20000,
              "maxLength": 10
            });          
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
       
      };//FIN DE FOR PRINCIPAL ! ! 

      console.log('Hay datos en la tabla csv '); 
      console.log('Nombre de callist = '+tableNames);
      client = platformClient.ApiClient.instance;    
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

    }else{
      console.log('Arrray vacio ! ');
      console.log('BUSCANDO EN ARCHIVO XML Y CREANDO SOLO COLUMNAS TELEFONICAS :C');
      console.log('CalllistDisplanName'+calllistDisplayNames);
      const phoneColums = getPhoneColumns(calllistDisplayNames);  
        for(let index in phoneColums ){
          const phoneCollumn=phoneColums[index];
          if(allColumnNames.indexOf(phoneCollumn) == -1){
          allColumnNames.push(phoneCollumn);
          phoneColumnsEspecifications.push({"columnName":phoneCollumn,"type": "Móvil"});
          }
        }
        console.log('TABLE NAME = '+tableNames)
        console.log(phoneColumnsEspecifications);
        console.log( allColumnNames);
        if(phoneColumnsEspecifications.length === 0 ){
          phoneColumnsEspecifications.push({"columnName":"Telefono","type": "Móvil"});
          allColumnNames.push("Telefono");
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
        client = platformClient.ApiClient.instance;    
        client.setEnvironment(platformClient.PureCloudRegionHosts.ca_central_1);
        client.setAccessToken(tok);
        let apiInstance = new platformClient.OutboundApi();
        console.log('No hay datos en la tabla csv '); 
        console.log('Nombre de callist = '+tableNames);
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
            //     let dattte=new Date().toLocaleString();
            UpdateLog(JSON.stringify(err)+'\n'+JSON.stringify(body))        //     error+=1;
        //     UpdateLog('Request ERROR-------------------='+dattte);         
            // UpdateLog('Error ='+JSON.stringify(err)+' BODY REQUEST \n'+JSON.stringify(body));
        //     UpdateLog('ERROR = '+JSON.stringify(body));
        //     UpdateLog('Request ERROR-------------------='+dattte);
        //     console.log("There was a failure calling postOutboundContactlists");
        //     console.error(err);
        //     throw new Error("Error OUTBOUND CONTACT LIST  = "+JSON.stringify(err,null,1));                   
        });      
    }
    //Enviar request con body actualizad !
    

       
    
    
  }catch (e) {
    console.log('Error ' + e);
    let dattte=new Date().toLocaleString();
    UpdateLog('Request ERROR-------------------='+dattte);         
    UpdateLog('Error DE CODIGO  ='+e);
    UpdateLog('Request ERROR-------------------='+dattte);
    console.error(e);
    console.log('Error = '+e)
  }//try catch principal 
};//fin de funcion 

//funcion que se llama desde el mainApp.js
async function crearCampaña(){
  const names=leerArchivoJSON(sinRepetir);
  let i = 0 ; 
  let jumped=0;
  var tok=await createToken();
  tok=tok.toString();
  for (let index = 0; index < names.length; index++) {
    const col = names[index];//Asignamos los nombres de la tabla a las variables col    
    const jsonData = fs.readFileSync(tablas_procesadas, 'utf8');
    const jsonObject = JSON.parse(jsonData);//obteniendo tablas procesadas.
    
    if(!jsonObject.some(prefix => prefix === col.toUpperCase())){//filtrando tablas procesadas 
      const body =await CrearContactList(col,tok);
      //console.log('Tabla no existe en los registros ');
      i+=1;
      if(i >=1){
        break;
      }
    
      
    }else{
      //console.log('Tabla procesada, Santando proceso ! ');
      //console.log('Nombre de la tabla '+col );
      jumped+=1;
      continue;
    }
  }
  console.log('Cantidad de tablas saltadas = '+jumped)
};


export {
  crearCampaña
};