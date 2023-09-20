import { JSONPath } from "jsonpath-plus";
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import csv from 'csv-parser';
import iconv from 'iconv-lite';
import { moveMessagePortToContext } from "worker_threads";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tablas_gt = path.join(__dirname,'../static/documents/tablas_GT.csv');
const nombreContatJson= path.join(__dirname,'../static/documents/nameList.json');
const jsonFile = path.join(__dirname,'../static/documents/archivo.json');
const xmlPath= path.join(__dirname,'../static/uploads/Listas_de_contacto.xml' );
const jsonXmlPath= path.join(__dirname,'../static/documents/contactList.json' );
const tablaExtraidas= [];
const nombresExtraidos=[];     
const uniqueTables=new Set();

const xmlTransformedPath = path.join(__dirname,'../static/uploads/ContactList.xml' );
const nIncluir= ['REGUL_1','FULL_1','MIGPREAP_1','DTH_1','APORT_1','GPON_1','TBL_','CRCL','DEFTRAN','PROPAGATOR','DEFCALL','DEFDEF','VOID','SIZE','IMP','YNU','DEFCALL','DEFLOB','DEFCALLDEST','NOTNULL','RULES1','IMP_','DEPTREE','PIECES','ROLES','PROXY','SERVERS','EDITIONS','EXPTAB','TRANSPORT','VIOLATIONS','AUDIT','FILE','_PING','_ACE','XDS','OUTPUT','EXECT','SYNONYMS','_CONDITIONS','RULE_','CATALOG','CATALOG','REPORT','_REPORT','_FORMATS','STATS1','TBS_','_USAGE','GLOBAL','_NAME','TAB','FORMATS','POLICIES','USERS','PROXY','PROPERTIES','CONTEXT','COLUMNS','PATHS','TABLESPACE','REPORT','FORMATS','_POLICIES','_DIF','_ACTIONS','PRIVS','_COMMENTS','DIALER_','_USER_','_SYS_','WM_','_EXPRESSION','_LOCK','TABQUOTAS','_TRIG','_stat',' _user_','_PROGRESS','_ALERTS','_GROUPS','_OBJ','_STATS','_COMPAT','_TRAIL','_CHECK','MAP','USR','_TRAIL','_CAPTURE','_BLOCK#','_QUERY','_TABLES','_OBJECTS','_OBJS','_VIEW','_varray','CDB_', 'I3_', 'EXU', 'USER_', 'DBA', '_DBA', 'RPT_', 'ALL_', 'SYS', 'REPCAT', 'HS_', 'APEX', 'CODE_', 'EXPMAPIOT', 'QT17410', 'DISK_AND_FIXED_OBJECTS', 'WWV_','_ALL','UTL_','REDACTION_','PRODUCT_','CHANGE_','_BASE',' DATAPUMP_',' NLS_','AQ_','SCHEDULER',' MVIEW_','ALERT_','DBMSHSXP_','C_OBJ','CRLIB','DBMS_','MGMT_','QT17933_','_DEF',' IMPDP_','DATAPUMP_','LOGMNR','DEFSCHEDULE','ORA_','PRIV_','DATABASE_','DOCUMENT','MVIEW_',' LOADER_','TTS_','LOGSTDBY','_BUFFER','TS_',' FLASHBACK','_PRIVILEGES',' QUEUE_',' UNIFIED_','I3','_ACTUAL','DM_','CLUSTER','EXPCOMPRESSED','NLS_','LOADER','_CONTENT','_INFO'];
async function getContactListNames() {  
    const jsonData = fs.readFileSync(jsonFile, 'utf8');
    const jsonObject = JSON.parse(jsonData);
    const query = '$..DIALERCONFIG2.DIALEROBJECT..PROPERTIES.calllist._attributes.display_name';
    const calllistDisplayNames = JSONPath({ json: jsonObject, path: query });
    return calllistDisplayNames;
};
async function createJsonFile(filePath, dataArray) {
    try {
        const jsonString = JSON.stringify(dataArray, null, 2);
        await fs.promises.writeFile(filePath, jsonString, 'utf-8');
        console.log(`Archivo JSON creado en: ${filePath}`);
    } catch (error) {
        console.error('Error al crear el archivo JSON:', error);
    }
};
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
        const listaDeNombres = await getContactListNames();
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
async function folderCreator(){
    try{
        fs.access(jsonXmlPath).then(() =>{
            
            console.log('El directorio no existe. \nCreando archivo....');
            fs.writeFile(jsonXmlPath,' ','utf8',(error) => {
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
function writeFile(data) {
    try {
        fs.writeFileSync(jsonXmlPath, JSON.stringify(data, null, 2), 'utf8');
        console.log('Data written to JSON file successfully.');
    } catch (error) {
        console.error('Error writing to JSON file:', error);
    }
};
async function crearJsonXml (){
    const json = convert.xml2json(xmlPath, { compact: true, spaces: 4 });
    await writeFile(json);



}
export{
    filtarDatos
};