import { DataTypes } from "sequelize";
import db from "../config/db.js"; //instancia de la base de datos

const Categoria = db.define(
  "categorias",
  {
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  { timestamps: false }
);
export default Categoria;
