import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filename =path.join(__dirname, '../static/documents/ProcessLog.json')
var msj = '';
async function folderCreator(){
    try{
        fs.access(filename).then(() =>{
            
            console.log('El directorio no existe. \nCreando archivo....');
            fs.writeFile(filename,' ','utf8',(error) => {
                if(!error){
                    console.log('Archivo creado correctamente ! !!')
                }else{
                    console.log('Error  al crear archivo');
                }
            })


        }).catch((e) =>{
            console.log('Directorio Existente\nGenerando "reporte"... ')
        });
    }catch(e){

    };
};


function readFile() {
    try {
        const jsonData = fs.readFileSync(filename, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        return [];
    }
};

function writeFile(data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
        console.log('Data written to JSON file successfully.');
    } catch (error) {
        console.error('Error writing to JSON file:', error);
    }
};

async function UpdateLog(newData) {
    await folderCreator()
    const existingData = readFile();
    const updatedData = [...existingData, newData];
    writeFile(updatedData);
};
function textToJSON(data) {

    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
        console.log('Data written to JSON file successfully.');
    } catch (error) {
        console.error('Error writing to JSON file:', error);
    }
};


export 
{
    UpdateLog
};