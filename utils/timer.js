async function esperar(minutos) {
    return new Promise(resolve => setTimeout(resolve, minutos * 60 * 1000));
}

async function funcionConEspera(min) {
    console.log('Llamando a la función con espera.');
    try{
    await esperar(min);
    console.log('Espera completada.');
    }catch(e){
    console.log('Fallo espera '+e )
    }
    
}
export {
    funcionConEspera
};

