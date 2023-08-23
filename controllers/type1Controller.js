import { xml2json} from "xml-js";
import fs from 'fs';
import path from 'path'; 
import {fileURLToPath} from 'url';
import { JSONPath } from "jsonpath-plus"; // Note the capitalized JSONPath


const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const dirpath= path.join(__dirname,'..','/static/uploads')
const jsonFile='controllers/archivo.json'
var content={};



function getTypes1(req, res) {
  try {
    
    if(JSON.stringify(req.body.msg) != ''){
      res.status(200).send('Peticion realizada con exito')
    }
    else{
      res.status(500).send('Peticion erronea request.ody vacio ')
    }  
    
  } catch (e) {
    console.log('Error typesControler = ' + e.toString());
    res.status(500).json({ error: 'Internal server error ='+e.toString() });
  }
}

// function getTypes5(req, res) {
//   var xml=fs.readFileSync('C:/Users/crist/OneDrive/Desktop/MigradorFinal/migrator_campain/static/uploads/1692636121144dialer_config.xml',{encoding:'utf8',flag:'r'});
//   var xmlData=xml2json(xml,{
//     compact:true,
//     spaces:4
//   })
//   var queryContent=[];
//   var query='$..DIALERCONFIG2.DIALEROBJECT..[?(@.type=="1")].name'
//   content=xmlData;
//   //console.log(xmlData)
//   fs.writeFile(jsonFile,content,(err)=>{
//     if(!err){
//       console.log('Archivo creado correctamente ! ! ! ')
//       queryContent=content.query;
//       res.send(queryContent+'bb ')
//     }else{
//       console.log('Error al crear el archivo ='+err )
//     }
//   });
  
// }
function getTypes5(req,res){
  
  
  const jsonFilePath = jsonFile;
  ;
  const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
  const jsonObject = JSON.parse(jsonData);
  
  const query = '$..DIALERCONFIG2.DIALEROBJECT..[?(@.type=="1")].name';
  const queryResult = JSONPath({ json: jsonObject, path: query });
  res.json({msg: queryResult.toString()})
  console.log(queryResult);
  var ListaNombres=[]
  let quantity = 0 ; 
  queryResult.forEach(col => {
    ListaNombres=col.concat(' ')
    quantity+=1;
  });
  console.log('Cantidad de resultados obtenidos = '+quantity)
  
};
export { getTypes1, getTypes5 };
