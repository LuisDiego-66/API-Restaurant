import {
  Mesa,
  Comida,
  Opcion,
  Orden,
  Item,
  Waiter,
} from "../models/relations.js";

export const getAllWaiter = async (req, res) => {
  try {
    const waiters = await Waiter.findAll();
    res.json(waiters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWaiter = async (req, res) => {
  const waiter = req.waiter;
  const id = waiter.id;

  try {
    const w = await Waiter.findByPk(id);
    res.json(w);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const tableFromWaiter = async (req, res) => {
  const waiter = req.waiter;
  const id = waiter.id;
  try {
    const orden = await Orden.findAll({
      //attributes: ['mesaId'],
      where: {
        waiterId: id,
        estado: "Pendiente",
      },
      include: [
        { model: Mesa },
        { model: Item, include: [{ model: Comida }, { model: Opcion }] },
      ],
    });
    res.json(orden);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const orderFromWaiter = async (req, res) => {
  const waiter = req.waiter;
  const id = waiter.id;
  try {
    const orden = await Orden.findAll({
      //attributes: ['mesaId'],
      order: [["estado", "ASC"]],
      where: {
        waiterId: id,
      },
      include: [
        { model: Mesa },
        { model: Item, include: [{ model: Comida }, { model: Opcion }] },
      ],
    });
    res.json(orden);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
