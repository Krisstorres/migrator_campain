import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import csv from 'csv-parser';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tablas_gt = path.join(__dirname,'../static/documents/tablas_GT.csv');
const nombreContatJson= path.join(__dirname,'../static/documents/nameList.json');

const nombresExtraidos=[];     
const uniqueTables=new Set();


async function readInfo(route) {
    return new Promise((resolve, reject) => {
      const data = [];
      const inputStream = fs.createReadStream(route, 'utf8'); 
  
      inputStream
        .pipe(csv({ separator: ',' }))
        .on('data', (row) => {
          data.push({
            TABLE_NAME: row.TABLE_NAME,
            COLUMN_NAME: row.COLUMN_NAME,
            DATA_TYPE: row.DATA_TYPE,
            DATA_LENGTH: row.DATA_LENGTH,
          });
        })
        .on('end', () => {
          resolve(data);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
async function realizarFiltro() {
    try {
        //
        const tablaExtraidas= [];
       // await createJsonFile(nombreContatJson, listaDeNombres);
        //
        const jsonData = await fs.promises.readFile(nombreContatJson, 'utf-8');
        const jsonObject = JSON.parse(jsonData);
        console.log("Nombres de tablas  extraidos correctamente !!!");
        nombresExtraidos.push(jsonData);    
        //console.log('Largo de nombres extraidos = '+nombresExtraidos); 
        //
        const tablas = await readInfo(tablas_gt);
        console.log("Rablas de CSV extraidas correctamente !!! ");
        tablaExtraidas.push(JSON.stringify(tablas));

    


        

    } catch (e) {
        console.error('Error:  realizarFiltro() = ', e);
    }
};
async function filtarDatos(){
    await realizarFiltro();
    


    let i = 0;

    for(let index in tablaExtraidas) {
        const cols=tablaExtraidas[index];
        const tablaObj = JSON.parse(cols);
        for(let indice in  tablaObj){
            const items=tablaObj[indice]
     
            // Verificar si tableName no comienza con ninguno de los prefijos excluidos            
            //tableName.endsWith("$")                                                     
            // if(tableNames.some( prefix => tableName.toUpperCase() === prefix.toUpperCase() )){}
            i+=1;
            uniqueTables.add(items);
            //console.log('Tablas filtradas '+items.TABLE_NAME);                                                                                                                    
        };
    };
    console.log(' Se almacenaron (' + i+")filas en el objeto !");
    console.log('elementos = '+uniqueTables.length);

    return uniqueTables;

};



export{
    filtarDatos
};