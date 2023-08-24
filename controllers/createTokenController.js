import express from 'express';
import axios from 'axios';
import csvParser  from 'csv-parser';
import fs from 'fs';
import path from 'path'; 
import {fileURLToPath} from 'url';
import { JSONPath } from "jsonpath-plus"; // Note the capitalized JSONPath
import csvWriter  from 'csv-writer';


const csvvwriter =csvWriter.createObjectCsvWriter;
const app=express();
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const dirpath= path.join(__dirname,'..','/static/uploads')
const jsonFile='controllers/archivo.json'
var content={};
const axxios=axios.default;

app.use(express.json());


function queryApp() {
    try {
      const data = [];
      const csvFilePath = 'controllers/tablas_GT.csv';
      const jsonFilePath = jsonFile;
      const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
      const jsonObject = JSON.parse(jsonData);
      const query = '$..DIALERCONFIG2.DIALEROBJECT..[?(@.type=="1")].name';
      const queryResult = JSONPath({ json: jsonObject, path: query });
      
      fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', () => {
          const uniqueRows = new Map();
          queryResult.forEach(col => {
            const matchingRows = data.filter(row => row.TABLE_NAME === col);
            matchingRows.forEach(match => {
              uniqueRows.set(match.TABLE_NAME, match);
            });
          });
          
          const filteredData = Array.from(uniqueRows.values());
  
          console.log('filtered data:', filteredData);
          let i = 0;
          filteredData.forEach(col => {
            console.log('TABLE_NAME = ' + JSON.stringify(col.TABLE_NAME));
            console.log('COLUMN_NAME = ' + JSON.stringify(col.COLUMN_NAME));
            console.log('DATA_TYPE = ' + JSON.stringify(col.DATA_TYPE));
            console.log('DATA_LENGTH = ' + JSON.stringify(col.DATA_LENGTH));
            console.log('Cantidad de registros = ' + i);
            i += 1;
          });
  
          console.log('Cantidad de resultados obtenidos = ' + filteredData.length);
          return data;
        });
    } catch (e) {
      console.log('Error typesControler = ' + e.toString());
    }
  }
  
  


async function createToken(clientId, clientSecret){

    const encodedData = Buffer.from(clientId + ':' + clientSecret).toString('base64');
    try{
    const { data } = await axios.post('https://login.mypurecloud.com/oauth/token', "grant_type=client_credentials",{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + encodedData
        }
    
    }); 
    console.log('Funcionó !')
    console.log('Token = '+data.access_token.toString())

    return data.access_token.toString();
    }catch(e){
        console.log('Error de token '+e)
    }
};

// async function crearCampaña(req,res ) {
//     console.log('Creando campañas');
//     let response     = {"msg":"Pro9ceso iniciado"};
//     let clientKey    = "97d7a7e8-786a-4491-9830-31032a2d0e19";
//     let clientSecret = "4h0lHZ8D0ZMpEKWt-UMJ-vtMPZkS0DbRP5XVRJgle1g";
//     const tokenObj   = await Token.createToken(clientKey,clientSecret);
//     let data         = {
//         "name": "ABC_Prueba_DOS",
//         "division": {
//             "id": "4f6793c1-ac28-44ae-b777-70a4adb6496d",
//             "name": "Home",
//             "homeDivision": true,
//             "selfUri": "/api/v2/authorization/divisions/4f6793c1-ac28-44ae-b777-70a4adb6496d"
//         },
//         "emailColumns": [],
//         "phoneColumns": [
//             {
//                 "columnName": "valor",
//                 "type": "Móvil"
//             }
//         ],
//         "columnNames": [
//             "inin-outbound-id",
//             "Prueba",
//             "valor",
//             "ContactCallable",
//             "ContactableByVoice",
//             "ContactableBySms",
//             "ContactableByEmail",
//             "ZipCodeAutomaticTimeZone",
//             "CallRecordLastAttempt-Prueba",
//             "CallRecordLastResult-Prueba",
//             "CallRecordLastAgentWrapup-Prueba",
//             "SmsLastAttempt-Prueba",
//             "SmsLastResult-Prueba",
//             "Callable-Prueba",
//             "ContactableByVoice-Prueba",
//             "ContactableBySms-Prueba",
//             "AutomaticTimeZone-Prueba"
//         ],
//         "previewModeColumnName": "",
//         "previewModeAcceptedValues": [],
//         "attemptLimits": null,
//         "automaticTimeZoneMapping": false,
//         "zipCodeColumnName": null
//     };
//     let options      = {
//         method:'POST',
//         url:"https://api.mypurecloud.com/api/v2/outbound/campaigns",
//         data:data,
//         headers:{
//             'Authorization': tokenObj.token_type+' '+tokenObj.access_token,
//             'Content-Type' : 'application/json'
//         },
//         raxConfig:{
//             retry:3,
//             noResponseRetries:2,
//             retrDelay:5000,
//             httpMethodsToRetry:['GET','HEAD','OPTIONS','DELETE','PUT','POST'],
//             statusCodesToRetry:[
//                 [429,429],
//                 [504,504],

//             ],
//             backoffType:'static',
//             onRetryAmpttempt:err =>{
//                 const cfgr=rax.getConfig(err);
//                 log.error(cfg,`${url} Retry error: ${err.response.status}`);

//             }
//         }
//     };
//     try{
//         let result=await axxios(options).catch(function (error){
//             console.log('Error al crear campaña :'+error.response.status+" - "+error.response.statusText);
//             response={"msg":"proceso fallido",resultado: error.response.status};        
//         });
//         if(result != undefined){
//             if(result.data != undefined){
//                 response={"msg":"proceso realizado", resultado:result.data};
//                 console.log('Data: '+JSON.stringify(result.data));     
//                 res.status(200).send('realizado con exito ')       
//             }else{
//                 console.log('No data ');    
//                 res.status(500).send('error')
//             }
            
    
//         }else{
//             console.log('No result: ')
//         }res.status(200).json(response)
        
//     }catch(e){
//         console.log('Error al subir el archivo = '+e)
//         res.status(500).send('error ')
//     }
    
// };
async function crearCampaña(req,res ) {

    try{
        
        queryApp();
        //nuevoCsv();
        //res.send(createToken('97d7a7e8-786a-4491-9830-31032a2d0e19','4h0lHZ8D0ZMpEKWt-UMJ-vtMPZkS0DbRP5XVRJgle1g'))
    }catch(e){
        console.log('Error en Crear Campaña ='+e)
    }
    
};


export {
    crearCampaña
};