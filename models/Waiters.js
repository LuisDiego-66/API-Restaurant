import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

const Waiter = db.define(
  "waiters",
  {
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    celular: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

Waiter.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
export default Waiter;
