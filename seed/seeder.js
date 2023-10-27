import {exit} from 'node:process'//una forma de terminar los procesos
import categorias from './categorias.js'
import mesas from './mesas.js'
import opciones from './opciones.js'
import variantes from './variantes.js'
import db from "../config/db.js" //instancia de la base de datos
import{ Categoria,Mesa, Opcion, Variante} from '../models/relations.js' //los modelos importados desde el documento de relaciones


const importarDatos = async () => {
    try{
        await db.authenticate()
        await db.sync()

        await Promise.all([ 
            Categoria.bulkCreate(categorias),
            Mesa.bulkCreate(mesas),
            Opcion.bulkCreate(opciones),
            Variante.bulkCreate(variantes)
        ]) 

        console.log('Datos Importados Correctamente')
        exit() 
    }catch(error){
        console.log(error)
        exit(1)
    }
}
const eliminarDatos = async () => {
    try{
        await Promise.all([ 
        await db.sync({force:true}) //elimina todos los datos de las tablas
    ])
        console.log('Datos Eliminados Correctamente')
        exit()
    }catch(error){
        console.log(error)
        exit(1)
    }
}

// cuando se mande llamar al script de db del package se preguntara si el 2do termino del arreglo enviado es -i y asi ejecutara el seeder
if(process.argv[2]=="-i"){ // son los argumentos que se mandaran desde la consola
    importarDatos();
}

if(process.argv[2]=="-e"){ 
    eliminarDatos();
}