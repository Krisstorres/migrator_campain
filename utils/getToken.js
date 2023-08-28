//importaciones 
import express from 'express';
import axios from 'axios';
//importaciones 

//variables 
const app=express();
//a38c0d8d-ae48-40ab-b477-b0b727cd4db2
const clientId='b99ef2a9-2922-432b-b756-229e9c27c927';
const clientSecret='7sWKuILXHegvP_kWvUFYCqr2oEQOSuMCg_Zu5ZiCzlA';
//6WC3u8DYOvYjagEDmag6Pztkl94pjPU5VyjyfeZfMCk
const encodedData = Buffer.from(clientId + ':' + clientSecret).toString('base64');
app.use(express.json());
//variables 


  
  

//logica get token 
async function createToken(){
    try{
    const { data } = await axios.post('https://login.mypurecloud.com/oauth/token', "grant_type=client_credentials",{
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