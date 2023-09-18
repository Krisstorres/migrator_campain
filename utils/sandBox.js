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
const tableNames= [
    "CALLBACK_GT",
    "CC_GUATEMALA",
    "NPS_TIENDASGT",
    "SERVICEL_SING",
    "SERVICEL_SINGTIA",
    "LDI2DAFASE",
    "SERVICEL_SING",
    "BIENVENIDA_PORTABILIDAD1",
    "INMOBILIARIAS",
    "SERVICEL_SINGTIA",
    "DTH",
    "Nuevo Proyecto, Top of Mind",
    "DTH_GT",
    "PruebasAdmin",
    "NICARAGUA PRUEBA CAMPAÑA",
    "DTH_CR",
    "CALLBACK_GT",
    "DTH_TLMK",
    "CLARO_VIDEO",
    "SATIS_CORP_EJECUTIVO",
    "SIXBELLPREPOST1",
    "CC_COSTA_RICA",
    "BIENVENIDA_POSTPAGO",
    "BIENVENIDA_PORTABILIDAD",
    "CC_COSTA_RICA",
    "BIENVENIDA_CASA_CLARO",
    "CLARO_VIDEO",
    "SATIS_TIENDAS_CR",
    "TLMK_HFC",
    "TLMK_DTH",
    "MERCADEOCR",
    "TLMK_ALTASMOVILES",
    "TLMK_RENOVACIONES",
    "TLMK_INTERNET",
    "MERCADEOCR",
    "Validacion Mail",
    "portout_pan",
    "Validacion Mail",
    "SATISFACCION2_PA",
    "portout_pan",
    "SATISFA_SERVTEC_CAC",
    "SATISFA_SERVTEC_CAC",
    "OPERACIONES_GT",
    "SATISF_TELECOMUNIQUE",
    "Solucel",
    "SATIS_CORP_EJECUTIVO",
    "SATISFACCION_PA",
    "FIJO_PAN",
    "BIENVENIDA_MOVIL_PA",
    "DESCUENTOSXT",
    "BIENVENIDA_CASA_CLARO",
    "PRUEBASNPS_PA",
    "NPS_GT_CLARO_PREPAGO",
    "NPS_GT_CLARO_HFC",
    "NPS_CR_CLARO_DTH",
    "NPS_GT_CLARO_INTERNET",
    "TMK_GT_TIPOPUSH",
    "TMK_GT_TIPOPUSH",
    "NPS_CR_CLARO_DTH",
    "NPS_CR_CLARO_POSTPAGO",
    "MARKETSHARECR",
    "MARKETSHAREGT",
    "NPS_GT_CLARO_POSTPAGO",
    "GT_OL_OUT_ALTADTH",
    "GT_OL_OUT_ALTAINTER",
    "TMK_GT_TIPOFORMULARIO",
    "GT_OL_OUT_MIGPREAP",
    "GT_OL_OUT_RENOVAMOV",
    "SATISF_TELECOMUNIQUE",
    "NPS_PA_MOVISTAR",
    "NPS_CR_CLARO_PREPAGO",
    "PA_EDT_OUT_ALTAINTER",
    "PA_EDT_OUT_ALTADTH",
    "PA_O27_OUT_ALTADTH",
    "PA_O27_OUT_ALTAINTER",
    "PA_EDT_OUT_MIGPREAP",
    "PA_EDT_OUT_UPSELLMOV",
    "PA_O27_OUT_MIGPREAP",
    "PA_O27_OUT_UPSELLMOV",
    "NPS_TIENDASCR",
    "TMK_GT_TIPOPUSH",
    "TMK_GT_TIPOPUSH",
    "NPS_GT_TIGO",
    "TMK_PA_TIPOPUSH",
    "TMK_PA_TIPOPUSH",
    "TMK_CR_TIPOPUSH",
    "TMK_CR_TIPOPUSH",
    "NPS GT",
    "SERVICEL_CONGTIA",
    "NPS_TIENDASCR",
    "DTH_GT",
    "TMK_DTH",
    "TIENDAS_CR",
    "POSTPAGO_GT",
    "TMK_PA_TIPOPUSH",
    "PROYECTO_CONECTIVIDAD_TMK",
    "CAMPAÑA_IPTV_GT",
    "NPS_CR_KOLBI",
    "TMK_PA_TIPOPUSH",
    "CAMPAÑA_IPTV_CR",
    "CR_RD_OUT_MIGPREAP",
    "TMK_DTH",
    "TURBONETT_BASICO",
    "CAMPAÑA_SATISFACCION_HFC_GT",
    "CAMPAÑA_GT_DTH",
    "CAMPAÑA_DTH_CR",
    "ALTASNUEVAS_GT_TIGO",
    "ALTASNUEVAS_CR_KOLBI",
    "ALTASNUEVAS_GT_CLARO",
    "PRUEBAAUDIO",
    "PRUEBAS_AUDIO",
    "SoporteCC_Pa",
    "Nuevo Proyecto, Top of Mind",
    "PruebaCotizador",
    "PA_EDT_OUT_ALTADTH",
    "PA_EDT_OUT_ALTAINTER",
    "PA_EDT_OUT_MIGPREAP",
    "PA_EDT_OUT_UPSELLMOV",
    "PA_O27_OUT_ALTADTH",
    "PA_O27_OUT_ALTAINTER",
    "PA_O27_OUT_MIGPREAP",
    "PA_O27_OUT_UPSELLMOV",
    "PRUEBAAUDIO",
    "TLMK_ALTASMOVILES",
    "TLMK_DTH",
    "TLMK_HFC",
    "TLMK_INTERNET",
    "TLMK_RENOVACIONES",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_GT_TIPOPUSH",
    "TMK_GT_TIPOPUSH",
    "GT_CC01",
    "GT_CC01",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_CR_TIPOPUSH",
    "TMK_GT_INTERNET",
    "TMK_GT_TIPOPUSH",
    "TMK_GT_TIPOPUSH",
    "TMK_GT_TIPOPUSH",
    "TMK_CR_TIPOPUSH",
    "TMK_GT_TIPOPUSH",
    "FIJO_PAN",
    "CR_ONE27_OUT_ESP",
    "CR_ONE27_OUT_ITX",
    "CR_ONE27_OUT_ITX",
    "TMK_CR_TIPOPUSH",
    "INMOBILIARIAS",
    "PA_CCPA_OUT_TODO",
    "GT_FJ_OUT_MIGPREAP",
    "GT_FJ_OUT_RENOVAMOV",
    "TMK_GT_TIPOPUSH",
    "TMK_PA_TIPOPUSH",
    "TMK_PA_TIPOFORMULARIO",
    "SATIS_TIENDAS_CR",
    "CR_RD_OUT_INTER",
    "TMK_PA_TIPOFORMULARIO",
    "NPS_CR_MOVISTAR",
    "TMK_GT_TIPOFORMULARIO",
    "GT_OL_OUT_ALTADTH",
    "GT_OL_OUT_ALTAINTER",
    "GT_FJ_OUT_RENOVAMOV",
    "GT_FJ_OUT_ALTAINTER",
    "GT_FJ_OUT_ALTADTH",
    "TMK_PA_TIPOFORM_TLSF",
    "CR_EDT_OUT_MIGPREAP",
    "DTH_TLMK",
    "NPS_CR_KOLBI_HFC",
    "NPS_CR_TIGO_DTH",
    "PRUEBAAUDIO",
    "GT_BRM_OUT_ALTADTH",
    "GT_BRM_OUT_ALTAINTER",
    "GT_One27_OUT_MIGPREAP",
    "GT_One27_OUT_RENOVAMOV",
    "GT_One27_OUT_ALTADTH",
    "GT_One27_OUT_ALTAINTER",
    "GT_One27_OUT_MIGPREAP",
    "GT_One27_OUT_ALTADTH",
    "TMK_GT_TIPOPUSH",
    "GT_BRM_OUT_UPSELLMOV",
    "TMK_GT_TIPOPUSH",
    "GT_BRM_OUT_ALTAHFC",
    "SAT_MM_GT",
    "GT_TW_OUT_MIGPREAP",
    "GT_TW_OUT_RENOVAMOV",
    "GT_TW_OUT_ALTADTH",
    "GT_TW_OUT_ALTAHFC",
    "GT_TW_OUT_ALTAINTER",
    "GT_TW_OUT_UPSELLINT",
    "GT_TW_OUT_UPSELLMOV",
    "TMK_GT_TIPOPUSH",
    "TMK_GT_TIPOPUSH",
    "GT_TW_OUT_ALTAHFC",
    "GT_TW_OUT_ALTAINTER",
    "GT_TW_OUT_RENOVAMOV",
    "GT_TW_OUT_UPSELLMOV",
    "GT_TW_OUT_UPSELLINT",
    "TMK_GT_TIPOPUSH",
    "GT_TW_OUT_MIGPREAP",
    "TMK_GT_INTERNET",
    "TMK_GT_TIPOFORMULARIO",
    "BIENVENIDA_PORTABILIDAD",
    "BIENVENIDA_POSTPAGO",
    "CAMPAÑA_DTH_CR",
    "CAMPAÑA_GT_DTH",
    "CAMPAÑA_IPTV_CR",
    "CAMPAÑA_IPTV_GT",
    "DTH_CR",
    "GT_FJ_OUT_ALTADTH",
    "GT_FJ_OUT_ALTAINTER",
    "GT_OL_OUT_MIGPREAP",
    "GT_OL_OUT_RENOVAMOV",
    "PruebaCotizador",
    "SATISFACCION_PA",
    "SERVICEL_CONGTIA",
    "TIENDAS_CR",
    "GT_One27_OUT_RENOVAMOV",
    "NPS GT",
    "CAMPAÑA_SATISFACCION_HFC_GT",
    "TMK_CR_TIPOFORMULARIO",
    "TMK_CR_TIPOFORMULARIO",
    "TMK_CR_TIPOFORMULARIO",
    "TMK_CR_TIPOFORMULARIO",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_PA_TIPOFORMULARIO",
    "TMK_PA_TIPOFORMULARIO",
    "TMK_PA_TIPOFORMULARIO",
    "TMK_PA_TIPOFORMULARIO",
    "TMK_CR_TIPOFORMULARIO",
    "GT_DIGITALIZACION",
    "TMK_PA_TIPOFORM_TLSF",
    "NPS_GT_TIGO_FIJO",
    "SAT_MM_GT",
    "GT_DIGITALIZACION",
    "TMK_GT_TIPOFORMULARIO",
    "GT_One27_OUT_ALTAINTER",
    "TMK_CR_TIPOFORMULARIO",
    "TMK_CR_TIPOPUSH",
    "TMK_GT_TIPOFORM_TLSF",
    "CR_ONE27_OUT_ESP",
    "MARKETSHARENI",
    "NPS_CR_TIGO",
    "NPS_GT_TIGO_DTH",
    "NPS_NI_TELECABLE",
    "NPS GT",
    "NPS_GT_CLARO_GPON",
    "TMK_CR_TIPOFORMULARIO",
    "NPS_GT_CLARO_IFI",
    "NPS_CR_CLARO_IFI",
    "NPS_CR_CLARO_GPON",
    "NPS_CR_CLARO_IPTV",
    "NPS_GT_CLARO_IPTV",
    "TMK_CR_TIPOPUSH",
    "TMK_GT_TIPOFORM_TLSF",
    "CR_AMS_OUT_INTER",
    "TMK_CR_TIPOFORM_TLSF",
    "NPS_GT_TIGO_FIJO",
    "CR_AMS_OUT_ADQUI",
    "CR_AMS_OUT_CAPTA",
    "CR_AMS_OUT_INTER",
    "CR_AMS_OUT_MPREAP",
    "CR_AMS_OUT_UPSELL",
    "CR_BRM_OUT_ADQUI",
    "CR_BRM_OUT_INTER",
    "CR_BRM_OUT_UPSELL",
    "CR_BRM_OUT_CAPTA",
    "CR_BRM_OUT_MPREAP",
    "CR_EDT_OUT_INTER",
    "GT_BRM_OUT_ALTAINTER",
    "GT_BRM_OUT_ALTAHFC",
    "CR_BRM_OUT_UPSELL",
    "CR_ANEXA_OUT_ADQUI",
    "CR_ANEXA_OUT_INTER",
    "CR_ANEXA_OUT_UPSELL",
    "CR_ANEXA_OUT_CAPTA",
    "CR_ANEXA_OUT_MPREAP",
    "TMK_CR_TIPOFORMULARIO",
    "TMK_CR_TIPOPUSH",
    "TMK_CR_TIPOFORMULARIO",
    "TMK_CR_TIPOPUSH",
    "NPS_CR_KOLBI_HFC",
    "ALTASNUEVAS_CLARO_CR",
    "ALTASNUEVAS_NI",
    "NPS_CR_CABLETICA",
    "MUESTRA_DETRACTORES_NPS",
    "MARKETSHARENI",
    "GT_SEL_OUT_ALTADTH",
    "GT_SEL_OUT_ALTAHFC",
    "GT_SEL_OUT_ALTAINTER",
    "GT_SEL_OUT_MIGPREAP",
    "GT_SEL_OUT_RENOVAMOV",
    "GT_SEL_OUT_UPSELLINT",
    "GT_SEL_OUT_UPSELLMOV",
    "GT_SEL_OUT_ALTADTH",
    "GT_SEL_OUT_ALTAHFC",
    "GT_SEL_OUT_ALTAINTER",
    "GT_SEL_OUT_MIGPREAP",
    "GT_SEL_OUT_RENOVAMOV",
    "GT_SEL_OUT_UPSELLINT",
    "GT_SEL_OUT_UPSELLMOV",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_GT_TIPOPUSH",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_GT_TIPOPUSH",
    "NPS_NI_TELECABLE",
    "CR_AMS_OUT_MPREAP",
    "CR_ANEXA_OUT_ADQUI",
    "CR_ANEXA_OUT_MPREAP",
    "CR_RD_OUT_FULL",
    "TMK_CR_TIPOFORMULARIO",
    "TMK_CR_TIPOFORMULARIO",
    "CR_AMS_OUT_ADQUI",
    "CR_OUT_CAPTA_2",
    "TMK_PA_TIPOPUSH",
    "CR_BRM_OUT_CAPTA",
    "CR_RD_OUT_IFI",
    "CR_RD_OUT_IPTV",
    "CR_RD_OUT_REGUL",
    "CR_EDT_OUT_RENOV",
    "CR_EDT_OUT_FULL",
    "CR_EDT_OUT_IFI",
    "CR_EDT_OUT_IPTV",
    "CR_EDT_OUT_APORT",
    "CR_EDT_OUT_DTH",
    "CR_RD_OUT_APORT",
    "CR_EDT_OUT_REGUL",
    "CR_RD_OUT_DTH",
    "CR_RD_OUT_RENOV",
    "CR_RD_OUT_IPTV",
    "CR_RD_OUT_REGUL",
    "CR_RD_OUT_RENOV",
    "CR_EDT_OUT_FULL",
    "CR_EDT_OUT_IPTV",
    "CR_EDT_OUT_RENOV",
    "TMK_CR_TIPOPUSH",
    "OPERACIONES_GT",
    "CR_EDT_OUT_MIGPREAP",
    "CR_EDT_OUT_DTH",
    "MUESTRA_DETRACTORES_NPS",
    "PROYECTO_CONECTIVIDAD_TMK",
    "CR_BRM_OUT_UPSELL",
    "CR_ANEXA_OUT_CAPTA",
    "MARKETSHARENI",
    "CR_ANEXA_OUT_INTER",
    "TURBONETT_BASICO",
    "CR_RD_OUT_APORT",
    "ALTASNUEVAS_NI",
    "MARKETSHARENI",
    "CR_EDT_OUT_IFI",
    "CR_EDT_OUT_REGUL",
    "CR_EDT_OUT_GPON",
    "CR_EDT_OUT_GPON",
    "CR_RD_OUT_GPON",
    "CR_RD_OUT_GPON",
    "NPS_CR_TIGO_DTH",
    "NPS_CR_LIBERTY_POST",
    "CR_EDT_OUT_INTER",
    "CR_BRM_OUT_INTER",
    "CR_BRM_OUT_MPREAP",
    "NPS_CR_LIBERTY_POST",
    "GT_FJ_OUT_MIGPREAP",
    "GT_BRM_OUT_ALTADTH",
    "CR_RD_OUT_INTER",
    "CR_RD_OUT_MIGPREAP",
    "ALTASNUEVAS_MOVISTAS_CR",
    "CR_RD_OUT_IFI",
    "GT_TW_OUT_ALTADTH",
    "CR_RD_OUT_FULL",
    "TMK_CR_TIPOFORMULARIO",
    "TMK_CR_TIPOFORMULARIO",
    "GT_BRM_OUT_MIGPREAP",
    "GT_BRM_OUT_RENOVAMOV",
    "GT_BRM_OUT_UPSELLMOV",
    "BIENVENIDA_MOVIL_PA",
    "MARKETSHAREGT",
    "MARKETSHARECR",
    "ALTASNUEVAS_GT_TIGO",
    "ALTASNUEVAS_CR_KOLBI",
    "ALTASNUEVAS_CLARO_CR",
    "ALTASNUEVAS_GT_CLARO",
    "ALTASNUEVAS_MOVISTAS_CR",
    "NPS_CR_CLARO_POSTPAGO",
    "NPS_CR_CLARO_PREPAGO",
    "NPS_CR_CABLETICA",
    "NPS_CR_KOLBI_HFC",
    "NPS_CR_KOLBI_PREPAGO",
    "NPS_CR_KOLBI_PREPAGO",
    "NPS_CR_LIBERTY_POST",
    "NPS_CR_TIGO",
    "NPS_CR_TIGO_DTH",
    "NPS_CR_TIGO_HFC",
    "NPS_GT_TIGO_DTH",
    "NPS_GT_TIGO",
    "NPS_CR_KOLBI",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_GT_TIPOFORMULARIO",
    "CR_AMS_OUT_UPSELL",
    "CR_EDT_OUT_APORT",
    "NPS_GT_CLARO_POSTPAGO",
    "NPS_GT_CLARO_PREPAGO",
    "NPS_CR_CLARO_DTH",
    "NPS_CR_CLARO_IPTV",
    "NPS_GT_CLARO_DTH",
    "NPS_GT_CLARO_GPON",
    "NPS_GT_CLARO_HFC",
    "NPS_GT_CLARO_INTERNET",
    "NPS_GT_CLARO_IPTV",
    "NPS_CR_CLARO_IFI",
    "NPS_CR_CLARO_GPON",
    "NPS_GT_CLARO_IFI",
    "CR_RD_OUT_DTH",
    "NPS_CR_MOVISTAR",
    "CR_AMS_OUT_CAPTA",
    "Solucel",
    "GT_BRM_OUT_RENOVAMOV",
    "SIXBELLPREPOST1",
    "GT_BRM_OUT_MIGPREAP",
    "DESCUENTOSXT",
    "GT_BRM_OUT_UPSELLINT",
    "GT_BRM_OUT_UPSELLINT",
    "PA_CCPA_OUT_TODO",
    "POSTPAGO_GT",
    "CL_Levantamiento",
    "CR_BRM_OUT_ADQUI",
    "TMK_CR_TIPOFORMULARIO",
    "TMK_CR_TIPOFORMULARIO",
    "CL_Levantamiento",
    "TMK_GT_TIPOFORM_TLSF",
    "CR_ANEXA_OUT_UPSELL",
    "TMK_CR_TIPOPUSH",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_CR_TIPOFORMULARIO",
    "TMK_PA_TIPOFORMULARIO",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_CR_TIPOFORM_TLSF",
    "TMK_CR_TIPOFORMULARIO",
    "TMK_GT_TIPOFORM_TLSF",
    "TMK_GT_TIPOFORMULARIO",
    "TMK_CR_TIPOPUSH"
];
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
      const inputStream = fs.createReadStream(route, 'utf8'); // Especificar UTF-8 como codificación
  
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

    tablaExtraidas.forEach(cols => {
        const tablaObj = JSON.parse(cols);

        tablaObj.forEach(items => {
            const tableName = items.TABLE_NAME;

            // Verificar si tableName no comienza con ninguno de los prefijos excluidos
            const excluir = ['REGUL_1','FULL_1','MIGPREAP_1','DTH_1','APORT_1','GPON_1','TBL_','CRCL','DEFTRAN','PROPAGATOR','DEFCALL','DEFDEF','VOID','SIZE','IMP','YNU','DEFCALL','DEFLOB','DEFCALLDEST','NOTNULL','RULES1','IMP_','DEPTREE','PIECES','ROLES','PROXY','SERVERS','EDITIONS','EXPTAB','TRANSPORT','VIOLATIONS','AUDIT','FILE','_PING','_ACE','XDS','OUTPUT','EXECT','SYNONYMS','_CONDITIONS','RULE_','CATALOG','CATALOG','REPORT','_REPORT','_FORMATS','STATS1','TBS_','_USAGE','GLOBAL','_NAME','TAB','FORMATS','POLICIES','USERS','PROXY','PROPERTIES','CONTEXT','COLUMNS','PATHS','TABLESPACE','REPORT','FORMATS','_POLICIES','_DIF','_ACTIONS','PRIVS','_COMMENTS','DIALER_','_USER_','_SYS_','WM_','_EXPRESSION','_LOCK','TABQUOTAS','_TRIG','_stat',' _user_','_PROGRESS','_ALERTS','_GROUPS','_OBJ','_STATS','_COMPAT','_TRAIL','_CHECK','MAP','USR','_TRAIL','_CAPTURE','_BLOCK#','_QUERY','_TABLES','_OBJECTS','_OBJS','_VIEW','_varray','CDB_', 'I3_', 'EXU', 'USER_', 'DBA', '_DBA', 'RPT_', 'ALL_', 'SYS', 'REPCAT', 'HS_', 'APEX', 'CODE_', 'EXPMAPIOT', 'QT17410', 'DISK_AND_FIXED_OBJECTS', 'WWV_','_ALL','UTL_','REDACTION_','PRODUCT_','CHANGE_','_BASE',' DATAPUMP_',' NLS_','AQ_','SCHEDULER',' MVIEW_','ALERT_','DBMSHSXP_','C_OBJ','CRLIB','DBMS_','MGMT_','QT17933_','_DEF',' IMPDP_','DATAPUMP_','LOGMNR','DEFSCHEDULE','ORA_','PRIV_','DATABASE_','DOCUMENT','MVIEW_',' LOADER_','TTS_','LOGSTDBY','_BUFFER','TS_',' FLASHBACK','_PRIVILEGES',' QUEUE_',' UNIFIED_','I3','_ACTUAL','DM_','CLUSTER','EXPCOMPRESSED','NLS_','LOADER','_CONTENT','_INFO'];
            //tableName.endsWith("$")
           
            
                                  
                           // if(tableNames.some( prefix => tableName.toUpperCase() === prefix.toUpperCase() )){}
                            i+=1;
                            uniqueTables.add(items);
                            //console.log('Tablas filtradas '+items.TABLE_NAME);
                            
                        
                    
                
                
            
        });
    });
    console.log(' Se almacenaron (' + i+")filas en el objeto !");
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