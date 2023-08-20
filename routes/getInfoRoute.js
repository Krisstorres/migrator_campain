import { express } from "express";




// app.get('/xml', async (req, res) => {
//     try {
//         const filePath = path.join(__dirname, './uploads/1692192152575dialer_config(3)(1).xml');
//         fs.readFile(filePath, 'utf-8', (err, data) => {
//             if (!err) {
//                 console.log(data);
//                 xml2js.parseString(data, (parseError, result) => {
//                     if (!parseError) {
//                         const dialerObjects = Array.isArray(result.DIALERCONFIG2.DIALEROBJECT) ? result.DIALERCONFIG2.DIALEROBJECT : [result.DIALERCONFIG2.DIALEROBJECT];

//                         const etiquetasType1 = dialerObjects.filter(obj => obj.$ && obj.$['type'] && obj.$['type'][0] === '1');
//                         //Etiquetas sin filtrado 
//                         const contenidoEtiquetas = etiquetasType1.map(etiqueta => etiqueta.PROPERTIES[0]);
//                         //extraxendo solo los valores de estas etiquetas
//                         res.json(contenidoEtiquetas);

//                         console.log(contenidoEtiquetas);

//                     } else {
//                         console.log('Error parse error = ' + parseError);
//                         console.error('Error parse error = ' + parseError);
//                     }
//                 });
//             } else {
//                 console.log('Error de lectura = ' + err);
//                 console.error('Error de lectura = ' + err);
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error al leer el archivo XML.');
//     }
// });