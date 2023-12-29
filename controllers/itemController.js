import { Item, Item_Opcion } from "../models/relations.js";

//Items
export const createItem = async (req, res) => {
  const { id: ordenId } = req.params;
  const { cantidad, subtotal, comidaId, opciones } = req.body;
  try {
    const item = await Item.create({
      cantidad,
      subtotal,
      comidaId,
      ordenId,
    });
    opciones.forEach(async (opcion) => {
      await Item_Opcion.create({
        itemId: item.id,
        opcioneId: opcion.id,
      });
    });
    res.send("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const item = await Item.findAll();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editItem = async (req, res) => {
  const { id } = req.params;
  const { cantidad, subtotal, comidaId } = req.body;

  try {
    const item = await Item.findByPk(id);
    await item.set({
      cantidad,
      subtotal,
      comidaId,
    });
    item.save();
    res.send("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
