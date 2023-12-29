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
    s1_price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    s2_price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    s3_price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM,
      values: ["Habilitado", "Deshabilitado"],
      defaultValue: "Habilitado",
    },
    horaInicio: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    horaFin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { timestamps: false }
);
export default Comida;
