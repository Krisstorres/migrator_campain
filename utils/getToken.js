//importaciones 
import express from 'express';
import axios from 'axios';
//importaciones 

//variables 

//a38c0d8d-ae48-40ab-b477-b0b727cd4db2 
//alexis client id
//julio client id 
//8bb43af4-7c78-43d5-a82d-44f11e173e5b
//giercko client id 
//'b99ef2a9-2922-432b-b756-229e9c27c927'

//6WC3u8DYOvYjagEDmag6Pztkl94pjPU5VyjyfeZfMCk
//alexis client Secret 
//8xIm_r0Ve5DtK_fKgs2oZMPDhYPIOmQi44Ezv3Xo3gQ
//Julio Client Secret 
//'7sWKuILXHegvP_kWvUFYCqr2oEQOSuMCg_Zu5ZiCzlA'
//Giercko Client Secret 
const app=express();
const clientId='196f79a5-0e98-451e-b599-0689f87cec12';
const clientSecret='vb-KZWQcKg-Gwssp-lSAzjd3IpKXdPVreZb21IZ6bAA';
const encodedData = Buffer.from(clientId + ':' + clientSecret).toString('base64');
app.use(express.json());
//variables 


  
  

//logica get token 
async function createToken(){
    try{
    const { data } = await axios.post('https://login.cac1.pure.cloud/oauth/token', "grant_type=client_credentials",{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + encodedData
        }
    
    }); 


    return data.access_token;
    }catch(e){
        console.log('Error de token '+e)
    }
};

//exportando funcion 
export {
    createToken
};  