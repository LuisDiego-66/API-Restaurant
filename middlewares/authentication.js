import jwt from "jsonwebtoken";
import { Waiter } from "../models/relations.js";

const authentication = async (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) {
    return res.send("invalid access");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const waiter = await Waiter.findByPk(decoded.id);

    if (waiter) {
      req.waiter = waiter;
    } else {
      return res.send("invalid access");
    }
    return next();
  } catch (error) {
    return res.send("JWT invalid");
  }
};

export default authentication;
