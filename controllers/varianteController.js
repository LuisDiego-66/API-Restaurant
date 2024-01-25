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

export const variantesDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const variante = await Variante.findByPk(id);
    if (!variante) {
      return res.send("no existe el registro");
    }
    await variante.update({ deletedAt: new Date() });

    res.json(variante);
  } catch (error) {
    console.log(error);
  }
};

export const variantesUpdate = async (req, res) => {
  const { id } = req.params;
  const { nombre, estado } = req.body;
  try {
    const variante = await Variante.findByPk(id);

    variante.set({
      nombre: nombre,
      estado: estado,
    });

    await variante.save();

    res.send("ok");
  } catch (error) {
    console.log(error);
  }
};
