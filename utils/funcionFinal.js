import express from 'express';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFile = path.join(__dirname, '../static/documents/archivo.json');
const outPutData = path.join(__dirname, '../static/documents/output.csv');  
const tablas_procesadas=path.join(__dirname,'../static/documents/tablasProcesadas.json');
const logger=path.join(__dirname,'../static/documents/ProcessLog.json');
const app=express();
const axxios=axios.default;
const client = platformClient.ApiClient.instance;






//funcion final
//------------------------------------------------------------------------
async function subirContactList(){
    client.setEnvironment(platformClient.PureCloudRegionHosts.ca_central_1);
    client.setAccessToken(token);
    let apiInstance = new platformClient.OutboundApi();
    let body ={
      "name": "Test_Cristian_TRES",
      "division": {
        "id": "700acb56-0791-4af6-87b4-0d396401c646",
        "name": "Guatemala",
        "homeDivision": true,
        "selfUri": "/api/v2/authorization/divisions/700acb56-0791-4af6-87b4-0d396401c646"
      },
      "emailColumns": [],
      "phoneColumns": [
        {
          "columnName": "valor",
          "type": "Móvil"
        }
      ],
      "columnNames": [
        "inin-outbound-id",
        "Prueba",
        "valor",
        "id",
      ],
      "previewModeColumnName": "",
      "previewModeAcceptedValues": [],
      "attemptLimits": null,
      "automaticTimeZoneMapping": false,
      "zipCodeColumnName": null,
      "trimWhitespace": true,
      "columnDataTypeSpecifications": [
        {
          "columnName": "id", 
          "columnDataType": "numeric",
          "min": 1,
          "max": 20000,
          "maxLength": 30
        }
      ]
    }
    apiInstance.postOutboundContactlists(body).then((data) => {
        console.log(`postOutboundContactlists success! data: ${JSON.stringify(data, null, 2)}`);
    }).catch((err) => {
        console.log("There was a failure calling postOutboundContactlists");
        console.error(err);
    });
};
//------------------------------------------------------------------------
//funcinon antigua 
//------------------------------------------------------------------------
async function queryApp(token) {
    try {
        const csvFilePath = path.join(__dirname, '../static/documents/tablas_GT.csv');
        const jsonData = fs.readFileSync(jsonFile, 'utf8');
        const jsonObject = JSON.parse(jsonData);
        const query = '$..DIALERCONFIG2.DIALEROBJECT..PROPERTIES.calllist._attributes.display_name';
        const calllistDisplayNames = JSONPath({ json: jsonObject, path: query });
  
        const data = await new Promise((resolve, reject) => {
            const dataArray = [];
            fs.createReadStream(csvFilePath)
                .pipe(csvParser())
                .on('data', (row) => {
                    dataArray.push(row);
                })
                .on('end', () => {
                    resolve(dataArray);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
  
        const excludedTables = new Set();
        data.forEach(row => {
            if (row.COLUMN_NAME.includes('I3_') || row.TABLE_NAME.includes('$')) {
                excludedTables.add(row.TABLE_NAME);
            }
        });
  
        const filteredData = data.filter(row => !excludedTables.has(row.TABLE_NAME));
  
        const uniqueTableNames = new Set();
        const nonDuplicateRows = [];
      
        filteredData.forEach(row => {
            if (!uniqueTableNames.has(row.TABLE_NAME)) {
                uniqueTableNames.add(row.TABLE_NAME);
                nonDuplicateRows.push(row);
            }
        });
  //-------------------------REALIZANDO QUERY A MURECLOUD
  
       console.log('Datos sin duplicados: ', nonDuplicateRows)
       nonDuplicateRows.forEach(col =>{
        console.log(JSON.stringify(col.TABLE_NAME));
        console.log(JSON.stringify(col.COLUMN_NAME));
        console.log(JSON.stringify(col.DATA_TYPE));
        console.log(JSON.stringify(col.DATA_LENGTH));
    //     client.setEnvironment(platformClient.PureCloudRegionHosts.us_east_1);
    //     client.setAccessToken(token);
    //     let apiInstance = new platformClient.OutboundApi();
    //     let body ={
    //       "id": "a2456f36-22b2-438c-835a-e4bd9345d977",
    //       "name": JSON.stringify(col.TABLE_NAME),
    //       "dateCreated": "2023-08-24T19:50:23.953Z",
    //       "version": 1,
    //       "division": {
    //         "id": "700acb56-0791-4af6-87b4-0d396401c646",
    //         "name": "Guatemala",
    //         "homeDivision": true,
    //         "selfUri": "/api/v2/authorization/divisions/700acb56-0791-4af6-87b4-0d396401c646"
    //       },
    //       "columnNames": [
    //         "valor",
    //         JSON.stringify(col.COLUMN_NAME)
    //       ],
    //       "phoneColumns": [
    //         {
    //           "columnName": "valor",
    //           "type": "Móvil"
    //         }
    //       ],
    //       "previewModeColumnName": "",
    //       "automaticTimeZoneMapping": false,
    //       "trimWhitespace": true,
    //       "selfUri": "/api/v2/outbound/contactlists/a2456f36-22b2-438c-835a-e4bd9345d977"
    //     }
    //     apiInstance.postOutboundContactlists(body).then((data) => {
    //         console.log(`postOutboundContactlists success! data: ${JSON.stringify(data, null, 2)}`);
    //     }).catch((err) => {
    //         console.log("There was a failure calling postOutboundContactlists");
    //         console.error(err);
    //     });
        });
  
         return nonDuplicateRows;
    } catch (error) {
        console.log('Error typesControler = ' + error.toString());
        throw error;
    }
  };
//------------------------------------------------------------------------

//funcion esperar:
//------------------------------------------------------------------------
async function esperar(minutos) {
    return new Promise(resolve => setTimeout(resolve, minutos * 60 * 1000));
}

async function funcionConEspera() {
    console.log('Llamando a la función con espera.');
    try{
    await esperar(10);
    console.log('Espera completada.');
    }catch(e){
    console.log('Fallo espera '+e )
    }
    
}
//Usar ese bucle.





// async function bucleConFuncion() {
//     const ciclosTotales = 1000; 
//     for (let ciclo = 1; ciclo <= ciclosTotales; ciclo++) {
//         console.log(`Ciclo ${ciclo} completado.`);

//         if (ciclo % 100 === 0) {
//             await funcionConEspera();
//         }
//     }
// }
//------------------------------------------------------------------------
