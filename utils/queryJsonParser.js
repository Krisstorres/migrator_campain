import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSONPath } from "jsonpath-plus";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFile = path.join(__dirname, '../static/documents/archivo.json');
const outPutData = path.join(__dirname, '../static/documents/output.csv');


// function queryApp(){
//     try {
//         const data = [];
//         const csvFilePath = path.join(__dirname, '../static/documents/tablas_GT.csv');
//         const jsonFilePath = jsonFile;
//         const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
//         const jsonObject = JSON.parse(jsonData);
//         const query = '$..DIALERCONFIG2.DIALEROBJECT..[?(@.type=="1")].name';
//         const queryResult = JSONPath({ json: jsonObject, path: query });      
//         const excludedTables = new Set(); // To store table names to exclude       
//         fs.createReadStream(csvFilePath)
//             .pipe(csvParser())
//             .on('data', (row) => {
//                 if (row.COLUMN_NAME.includes('I3_')) {
//                     excludedTables.add(row.TABLE_NAME);
//                 }
//             })
//             .on('end', () => {
//                 const uniqueRows = new Map();
//                 queryResult.forEach(col => {
//                     if (!excludedTables.has(col)) { // Exclude if table name is in the set
//                         const matchingRows = data.filter(row => row.TABLE_NAME === col);
//                         matchingRows.forEach(match => {
//                             uniqueRows.set(match.TABLE_NAME, match);
//                         });
//                     }
//                 });
//                 const filteredData = Array.from(uniqueRows.values());
//                 console.log('filtered data:', filteredData);
//                 let i = 0;
//                 filteredData.forEach(col => {
//                     console.log('TABLE_NAME = ' + JSON.stringify(col.TABLE_NAME));
//                     console.log('COLUMN_NAME = ' + JSON.stringify(col.COLUMN_NAME));
//                     console.log('DATA_TYPE = ' + JSON.stringify(col.DATA_TYPE));
//                     console.log('DATA_LENGTH = ' + JSON.stringify(col.DATA_LENGTH));
//                     console.log('Cantidad de registros = ' + i);
//                     i += 1;
//                 });
//                 console.log('Cantidad de resultados obtenidos = ' + filteredData.length);
//                 return data;
//             });
//     } catch (e) {
//         console.log('Error typesControler = ' + e.toString());
//     }

// };



// function queryApp() {
//     try {
//         const data = [];
//         const csvFilePath = path.join(__dirname, '../static/documents/tablas_GT.csv');
//         const jsonData = fs.readFileSync(jsonFile, 'utf8');
//         const jsonObject = JSON.parse(jsonData);
//         const query = '$..DIALERCONFIG2.DIALEROBJECT..[?(@.type=="1")].name';
//         const campainNames = JSONPath({ json: jsonObject, path: query });
//         var   namesList=[];
//         console.log(' ');
//         console.log('Resultrado de query result = '+campainNames )
//         let i = 0;
//         campainNames.forEach(cols =>{
//             namesList+=campainNames[cols]
//             i+=0;
//             console.log('Nombre de contactList()')

//         });
        
//         console.log(' ');

//         fs.createReadStream(csvFilePath)
//             .pipe(csvParser())
//             .on('data', (row) => {
//                 data.push(row);
//             })
//             .on('end', () => {
//                 const excludedTables = new Set();
//                 data.forEach(row => {
//                     if (row.COLUMN_NAME.includes('I3_') || row.TABLE_NAME.includes('$')) {
//                         excludedTables.add(row.TABLE_NAME);
//                     }
//                 });

//                 const filteredData = data.filter(row => !excludedTables.has(row.TABLE_NAME));

//                 //console.log('filtered data:', filteredData);
//                 let i = 0;
//                 filteredData.forEach(col => {
//                     //console.log('TABLE_NAME = ' + JSON.stringify(col.TABLE_NAME));
//                     //console.log('COLUMN_NAME = ' + JSON.stringify(col.COLUMN_NAME));
//                     //console.log('DATA_TYPE = ' + JSON.stringify(col.DATA_TYPE));
//                    //console.log('DATA_LENGTH = ' + JSON.stringify(col.DATA_LENGTH));
//                     i += 1;
//                 });
//                // console.log('Cantidad de resultados obtenidos = ' + filteredData.length);
//             });
//     } catch (e) {
//         console.log('Error typesControler = ' + e.toString());
//     }



function queryApp() {
    try {
        const data = [];
        const csvFilePath = path.join(__dirname, '../static/documents/tablas_GT.csv');
        const jsonData = fs.readFileSync(jsonFile, 'utf8');
        const jsonObject = JSON.parse(jsonData);
        const query = '$..DIALERCONFIG2.DIALEROBJECT..PROPERTIES.calllist._attributes.display_name';
        const calllistDisplayNames = JSONPath({ json: jsonObject, path: query });
        var namesList = [];
        console.log(' ');
        //console.log('Resultado de la consulta result = ' + calllistDisplayNames);
        let n = 0;
        calllistDisplayNames.forEach(displayName => {
            n += 1;
            namesList += JSON.stringify(displayName).toString()+    ',';
            
            //console.log('Nombre de la lista de llamadas: ' + displayName);
        });
        namesList=namesList.trim().split(','); 
        console.log('nameList = '+namesList )
        console.log('Resulatado de query = '+n)

        console.log(' ');

        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                const excludedTables = new Set();
                data.forEach(row => {
                    if (row.COLUMN_NAME.includes('I3_') || row.TABLE_NAME.includes('$')) {
                        excludedTables.add(row.TABLE_NAME);
                    }
                });

                const filteredData = data.filter(row => !excludedTables.has(row.TABLE_NAME));

                //console.log('filtered data:', filteredData);
               
                filteredData.forEach(col => {
                    //console.log('TABLE_NAME = ' + JSON.stringify(col.TABLE_NAME));
                    //console.log('COLUMN_NAME = ' + JSON.stringify(col.COLUMN_NAME));
                    //console.log('DATA_TYPE = ' + JSON.stringify(col.DATA_TYPE));
                    //console.log('DATA_LENGTH = ' + JSON.stringify(col.DATA_LENGTH));
                
                });
                console.log('Cantidad de resultados obtenidos = ' + filteredData.length);
                
                return filteredData ;
            });
    } catch (e) {
        console.log('Error typesControler = ' + e.toString());
    }
}
//final 23:58



export {
    queryApp
};