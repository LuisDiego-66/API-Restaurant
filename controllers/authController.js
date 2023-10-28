import { Waiter } from "../models/relations.js";
import { generarJWT } from "../helpers/tokens.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { nombre, password, correo, pin, celular, direccion } = req.body;

  try {
    const waiterPin = await Waiter.findAll({
      where: pin,
    });
    const waiterEmail = await Waiter.findAll({
      where: correo,
    });

    if (waiterPin || waiterEmail) {
      return res.status(500).json({ error: "pin or email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newWaiter = new Waiter({
      nombre,
      password: passwordHash,
      correo,
      pin,
      celular,
      direccion,
    });

    await newWaiter.save();
    res.send("waiter created");
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { correo, password } = req.body;
  const waiter = await Waiter.findOne({ where: { correo } });

  if (!waiter) {
    return res.send("waiter does not exist");
  }

  if (!waiter.verificarPassword(password)) {
    return res.send("Incorrect password");
  }

  //Autenticar
  const token = generarJWT({ id: waiter.id, nombre: waiter.nombre });
  res.json({ token });
};

export const loginPin = async (req, res) => {
  const { pin } = req.body;
  const waiter = await Waiter.findOne({ where: { pin } });

  if (!waiter) {
    return res.send("waiter does not exist");
  }

  //Autenticar
  const token = generarJWT({ id: waiter.id, nombre: waiter.nombre });
  res.json({ token });
};
