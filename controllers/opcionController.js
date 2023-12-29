import { Opcion } from "../models/relations.js";

//Opciones
export const createOpcion = async (req, res) => {
  const { nombre, precio, varianteId } = req.body;

  try {
    await Opcion.create({
      nombre,
      precio,
      varianteId,
    });
    res.send("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOpciones = async (req, res) => {
  try {
    const opciones = await Opcion.findAll();
    res.json(opciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
