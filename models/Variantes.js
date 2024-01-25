import { DataTypes } from "sequelize";
import db from "../config/db.js"; //instancia de la base de datos

const Variante = db.define(
  "variantes",
  {
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM,
      values: ["Multiple", "Singular"],
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  { timestamps: false }
);
export default Variante;
