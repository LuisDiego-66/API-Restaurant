import { DataTypes } from "sequelize";
import db from "../config/db.js"; //instancia de la base de datos

const Item = db.define(
  "items",
  {
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    descuento: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  { timestamps: false }
);
export default Item;
