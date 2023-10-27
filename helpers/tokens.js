import jwt from "jsonwebtoken";

export const generarJWT = (datos) =>
  jwt.sign({ id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
