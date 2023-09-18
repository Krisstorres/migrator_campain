import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filename =path.join(__dirname, '../static/documents/tablasProcesadas.json')

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

function UpdateFile(newData) {
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
    UpdateFile
};