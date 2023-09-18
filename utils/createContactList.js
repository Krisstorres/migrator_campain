import express from 'express';
import axios from 'axios';
import platformClient from 'purecloud-platform-client-v2'; 

const app=express();
app.use(express.json());




async function crearContactList(token){
client.setEnvironment(platformClient.PureCloudRegionHosts.us_east_1);
client.setAccessToken(token);
let apiInstance = new platformClient.OutboundApi();
let body ={
  "name": "Test_Cristian_DOS",
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
    "CallRecordLastAttempt-Prueba",
    "CallRecordLastResult-Prueba",
    "CallRecordLastAgentWrapup-Prueba",
    "SmsLastAttempt-Prueba",
    "SmsLastResult-Prueba",
    "Callable-Prueba",
    "ContactableByVoice-Prueba",
    "ContactableBySms-Prueba",
    "AutomaticTimeZone-Prueba",
    "ContactCallable",
    "ContactableByVoice",
    "ContactableBySms",
    "ContactableByEmail",
    "ZipCodeAutomaticTimeZone",
    "CallRecordLastAttempt-valor",
    "CallRecordLastResult-valor",
    "CallRecordLastAgentWrapup-valor",
    "SmsLastAttempt-valor",
    "SmsLastResult-valor",
    "Callable-valor",
    "ContactableByVoice-valor",
    "ContactableBySms-valor",
    "AutomaticTimeZone-valor"
  ],
  "previewModeColumnName": "",
  "previewModeAcceptedValues": [],
  "attemptLimits": null,
  "automaticTimeZoneMapping": false,
  "zipCodeColumnName": null,
  "trimWhitespace": true
};
apiInstance.postOutboundContactlists(body).then((data) => {
    console.log(`postOutboundContactlists success! data: ${JSON.stringify(data, null, 2)}`);
}).catch((err) => {
    console.log("There was a failure calling postOutboundContactlists");
    console.error(err);
});
};
async function test(token){
    try{
        const resultado = await crearContactList(token);   
        console.log(resultado);
        return resultado;
    }catch(e){
        console.log('Error Test () =  '+e)
        return 'Error En Test() Create Contact list =  '+e 
    };
}

export {
    test
};


