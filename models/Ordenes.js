import { DataTypes } from "sequelize";
import db from "../config/db.js"; //instancia de la base de datos

const Orden = db.define(
  "ordenes",
  {
    estado: {
      type: DataTypes.ENUM,
      values: ["Pendiente", "Entregado", "Cancelado"],
      defaultValue: "Pendiente",
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    people: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descuento: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    timer: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { timestamps: true }
);
export default Orden;
