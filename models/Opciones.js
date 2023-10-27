import { DataTypes } from "sequelize"
import db from "../config/db.js" //instancia de la base de datos

const Opcion = db.define('opciones',{
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    precio: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
},{ timestamps: false }
)
export default Opcion