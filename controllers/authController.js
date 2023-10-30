import { Waiter } from "../models/relations.js";
import { generarJWT } from "../helpers/tokens.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { nombre, password, correo, pin, celular, direccion } = req.body;

  try {
    const waiterPin = await Waiter.findOne({
      where: { pin },
    });
    const waiterEmail = await Waiter.findOne({
      where: { correo },
    });

    if (waiterPin || waiterEmail) {
      return res.status(500).json({ error: "pin or email already exists" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    await cloudinary.uploader.upload(req.file.path, async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "error",
        });
      }
      const url = result.url;

      const passwordHash = await bcrypt.hash(password, 10);
      const newWaiter = new Waiter({
        nombre,
        password: passwordHash,
        correo,
        pin,
        celular,
        direccion,
        url,
      });

      await newWaiter.save();
      res.status(200).json({
        success: true,
        message: "Uploaded successfull",
      });
    });
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
