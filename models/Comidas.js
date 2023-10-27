import { DataTypes } from "sequelize";
import db from "../config/db.js"; //instancia de la base de datos

const Comida = db.define(
  "comidas",
  {
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(100),
    },
    precio: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);
export default Comida;
