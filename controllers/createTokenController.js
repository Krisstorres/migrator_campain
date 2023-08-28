import express from 'express';
import axios from 'axios';
import platformClient from 'purecloud-platform-client-v2'; 
//import { queryApp } from '../utils/queryJsonParser.js';
import { createToken } from '../utils/getToken.js';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSONPath } from "jsonpath-plus";
import {textToJSON} from '../utils/saveInfo.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFile = path.join(__dirname, '../static/documents/archivo.json');
const outPutData = path.join(__dirname, '../static/documents/output.csv');  
const app=express();
const axxios=axios.default;
const client = platformClient.ApiClient.instance;
var daira =[];

app.use(express.json());



// async function queryApp() {
//   try {
//       const csvFilePath = path.join(__dirname, '../static/documents/tablas_GT.csv');
//       const jsonData = fs.readFileSync(jsonFile, 'utf8');
//       const jsonObject = JSON.parse(jsonData);
//       const query = '$..DIALERCONFIG2.DIALEROBJECT..PROPERTIES.calllist._attributes.display_name';
//       const calllistDisplayNames = JSONPath({ json: jsonObject, path: query });

//       const data = await new Promise((resolve, reject) => {
//           const dataArray = [];
//           fs.createReadStream(csvFilePath)
//               .pipe(csvParser())
//               .on('data', (row) => {
//                   dataArray.push(row);
//               })
//               .on('end', () => {
//                   resolve(dataArray);
//               })
//               .on('error', (error) => {
//                   reject(error);
//               });
//       });

//       const excludedTables = new Set();
//       data.forEach(row => {
//           if (row.COLUMN_NAME.includes('I3_') || row.TABLE_NAME.includes('$')) {
//               excludedTables.add(row.TABLE_NAME);
//           }
//       });

//       const filteredData = data.filter(row => !excludedTables.has(row.TABLE_NAME));

//       const uniqueColumnNames = new Set();
//       const nonDuplicateRows = [];
      
//       filteredData.forEach(row => {
//           if (!uniqueColumnNames.has(row.COLUMN_NAME)) {
//               uniqueColumnNames.add(row.COLUMN_NAME);
//               nonDuplicateRows.push(row);
//           }
//       });

//       console.log('Datos sin duplicados: ', nonDuplicateRows);

//       return nonDuplicateRows;
//   } catch (error) {
//       console.log('Error typesControler = ' + error.toString());
//       throw error;
//   }
// }
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
      //console.log(JSON.stringify(col.TABLE_NAME));
      //console.log(JSON.stringify(col.COLUMN_NAME));
      //console.log(JSON.stringify(col.DATA_TYPE));
      //console.log(JSON.stringify(col.DATA_LENGTH));
      client.setEnvironment(platformClient.PureCloudRegionHosts.us_east_1);
      client.setAccessToken(token);
      let apiInstance = new platformClient.OutboundApi();
      let body ={
        "id": "a2456f36-22b2-438c-835a-e4bd9345d977",
        "name": JSON.stringify(col.TABLE_NAME),
        "dateCreated": "2023-08-24T19:50:23.953Z",
        "version": 1,
        "division": {
          "id": "700acb56-0791-4af6-87b4-0d396401c646",
          "name": "Guatemala",
          "homeDivision": true,
          "selfUri": "/api/v2/authorization/divisions/700acb56-0791-4af6-87b4-0d396401c646"
        },
        "columnNames": [
          "valor",
          JSON.stringify(col.COLUMN_NAME)
        ],
        "phoneColumns": [
          {
            "columnName": "valor",
            "type": "Móvil"
          }
        ],
        "previewModeColumnName": "",
        "automaticTimeZoneMapping": false,
        "trimWhitespace": true,
        "selfUri": "/api/v2/outbound/contactlists/a2456f36-22b2-438c-835a-e4bd9345d977"
      }
      apiInstance.postOutboundContactlists(body).then((data) => {
          console.log(`postOutboundContactlists success! data: ${JSON.stringify(data, null, 2)}`);
      }).catch((err) => {
          console.log("There was a failure calling postOutboundContactlists");
          console.error(err);
      });
     });

      return nonDuplicateRows;
  } catch (error) {
      console.log('Error typesControler = ' + error.toString());
      throw error;
  }
}




async function newContactList(token){  
  client.setEnvironment(platformClient.PureCloudRegionHosts.us_east_1);
  client.setAccessToken(token);
  let apiInstance = new platformClient.OutboundApi();
  let body ={
    "id": "a2456f36-22b2-438c-835a-e4bd9345d977",
    "name": "PRUEBA_NUMERO_CINCO",
    "dateCreated": "2023-08-24T19:50:23.953Z",
    "version": 1,
    "division": {
      "id": "4f6793c1-ac28-44ae-b777-70a4adb6496d",
      "name": "Home",
      "selfUri": "/api/v2/authorization/divisions/4f6793c1-ac28-44ae-b777-70a4adb6496d"
    },
    "columnNames": [
      "Prueba",
      "valor",
      "CallRecordLastAttempt-Prueba",
      "CallRecordLastResult-Prueba",
      "CallRecordLastAgentWrapup-Prueba",
      "SmsLastAttempt-Prueba",
      "SmsLastResult-Prueba",
      "Callable-Prueba",
      "ContactableByVoice-Prueba",
      "ContactableBySms-Prueba",
      "AutomaticTimeZone-Prueba"
    ],
    "phoneColumns": [
      {
        "columnName": "valor",
        "type": "Móvil"
      }
    ],
    "previewModeColumnName": "",
    "automaticTimeZoneMapping": false,
    "trimWhitespace": true,
    "selfUri": "/api/v2/outbound/contactlists/a2456f36-22b2-438c-835a-e4bd9345d977"
  }
  apiInstance.postOutboundContactlists(body).then((data) => {
      console.log(`postOutboundContactlists success! data: ${JSON.stringify(data, null, 2)}`);
  }).catch((err) => {
      console.log("There was a failure calling postOutboundContactlists");
      console.error(err);
  });
};



async function crearCampaña(req,res ) {
  var tok=await createToken();
  tok=tok.toString();
  console.log('Token '+tok)
  // queryApp(tok)
  // .then(filteredData => {
  //     console.log('Datos filtrados obtenidos:', filteredData);
  // })
  // .catch(error => {
  //     console.error('Error:', error);
  // });

  
// await newContactList(tok);

textToJSON('hola');
};

export {
    crearCampaña
};
