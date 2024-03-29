import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Mesa = db.define(
  "mesas",
  {
    numero: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM,
      values: ["Libre", "Ocupado", "Deshabilitado", "Reservado", "Bloqueado"],
      defaultValue: "Libre",
    },
    mesas: {
      type: DataTypes.STRING,
    },
    auxiliar: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  { timestamps: false }
);
export default Mesa;
