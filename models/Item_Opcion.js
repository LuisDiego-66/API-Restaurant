import db from "../config/db.js" //instancia de la base de datos

const Item_Opcion = db.define('items_opciones',{},{ timestamps: false })
export default Item_Opcion