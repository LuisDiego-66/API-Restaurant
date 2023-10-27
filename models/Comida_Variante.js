import db from "../config/db.js" //instancia de la base de datos

const Comida_Variante = db.define('comida_variante',{},{ timestamps: false })
export default Comida_Variante