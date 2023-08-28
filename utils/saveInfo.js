import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filename =path.join(__dirname, '../static/documents/tablasProcesadas.json')

function getOldData(){
    try{
        const jsonData=fs.readFileSync(filename,'utf8');
        return JSON.parse(jsonData);

    }catch(e){
        return [];

    }
}
function textToJSON(data) {

    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
        console.log('Data written to JSON file successfully.');
    } catch (error) {
        console.error('Error writing to JSON file:', error);
    }
}


export 
{
    textToJSON
}