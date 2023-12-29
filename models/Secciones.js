import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Seccion = db.define(
  "secciones",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
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
export default Seccion;
