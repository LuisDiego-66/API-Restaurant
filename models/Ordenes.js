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
  },
  { timestamps: true }
);
export default Orden;
