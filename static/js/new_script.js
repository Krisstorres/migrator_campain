const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const dirpath= path.join(__dirname,'..','/uploads')




    let dirList=[];
    fs.readdir(dirpath,(e,cols) => {
        if(!e){
            let cont= 0;
            cols.forEach(col =>{
                cont+=1;
                console.log('Columnas de archivos = '+col);
                dirList+=col.concat(',');                
            });
                console.log('Cantidad de elementos detectados = '+Math.max(cont));
                console.log('Elementos en la lista ='.concat(dirList));
            return dirList; 
        }else{
            console.log('Error aL OBTENER LA INFIO'+e)
        }
    });





//getFiles();
app.use(express.static(path.join(__dirname, 'public')));
script.js

