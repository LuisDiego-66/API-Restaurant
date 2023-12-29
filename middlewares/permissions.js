import jwt from "jsonwebtoken";
import { Waiter } from "../models/relations.js";

const permissions = (rol) => {
  return async (req, res, next) => {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const waiter = await Waiter.findByPk(decoded.id);

      const rolPermitido = Number(rol);
      const rolWaiter = Number(waiter.rol);
      if (rolWaiter <= rolPermitido) {
        return next();
      } else {
        return res.send("invalid permissions");
      }
    } catch (error) {
      return res.send(error);
    }
  };
};
export default permissions;
