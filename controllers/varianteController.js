import { Variante } from "../models/relations.js";

//Variantes
export const createVariante = async (req, res) => {
  const { nombre, estado } = req.body;

  try {
    await Variante.create({
      nombre,
      estado,
    });
    res.send("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVariantes = async (req, res) => {
  try {
    const variantes = await Variante.findAll();
    res.json(variantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
