import {
  Mesa,
  Comida,
  Opcion,
  Orden,
  Item,
  Item_Opcion,
  Waiter,
} from "../models/relations.js";

//Ordenes
export const createOrden = async (req, res) => {
  const { total, mesaId, items, people, descuento } = req.body;
  const waiter = req.waiter;
  const waiterId = waiter.id;

  try {
    const mesa = await Mesa.findByPk(mesaId);
    mesa.set({ estado: "Ocupado" });
    await mesa.save();
    const orden = await Orden.create({
      total,
      mesaId,
      waiterId,
      people,
      descuento,
    });

    items.forEach(async (item) => {
      const i = await Item.create({
        cantidad: item.cantidad,
        subtotal: item.subtotal,
        comidaId: item.comidaId,
        descuento: item.descuento,
        ordenId: orden.id,
      });
      item.opciones.forEach(async (opcion) => {
        await Item_Opcion.create({
          itemId: i.id,
          opcioneId: opcion.id,
        });
      });
    });
    res.send("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      include: [
        { model: Mesa },
        { model: Waiter, attributes: ["id", "nombre", "pin", "url"] },
        { model: Item, include: [{ model: Comida }, { model: Opcion }] },
      ],
    });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrden = async (req, res) => {
  const { id } = req.params;

  try {
    const ordenes = await Orden.findByPk(id, {
      include: [
        { model: Mesa },
        { model: Waiter, attributes: ["id", "nombre", "pin", "url"] },
        { model: Item, include: [{ model: Comida }, { model: Opcion }] },
      ],
    });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editOrden = async (req, res) => {
  const { id } = req.params;
  const { total, people, descuento } = req.body;
  try {
    const orden = await Orden.findByPk(id);
    await orden.set({
      total,
      people,
      descuento,
    });
    orden.save();
    res.send("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarEstadoOrden = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const orden = await Orden.findByPk(id);
    const mesaId = orden.mesaId;

    const mesa = await Mesa.findByPk(mesaId);
    925 - mesa.set({ estado: "Libre" });
    await mesa.save();

    const fechaActual = new Date();
    const horaActual = fechaActual.getHours() * 60 + fechaActual.getMinutes();

    const hora = new Date(orden.createdAt);
    const horaIncial = hora.getHours() * 60 + hora.getMinutes();

    const time = horaActual - horaIncial;

    console.log(time);
    orden.set({ timer: time });

    if (estado == "1") {
      orden.set({ estado: "Entregado" });
      await orden.save();
    }
    if (estado == "2") {
      orden.set({ estado: "Cancelado" });
      await orden.save();
    }
    res.send("Changed Status Successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarMesaOrden = async (req, res) => {
  const { id } = req.params;
  const { mesaId } = req.body;
  try {
    const orden = await Orden.findByPk(id);

    const IdTable = orden.mesaId;

    const mesa = await Mesa.findByPk(IdTable);
    mesa.set({ estado: "Libre" });
    await mesa.save();

    const newMesa = await Mesa.findByPk(mesaId);
    newMesa.set({ estado: "Ocupado" });
    await newMesa.save();

    orden.set({ mesaId: mesaId });
    await orden.save();
    res.send("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarWaiterOrden = async (req, res) => {
  const { id } = req.params;
  const { waiterId } = req.body;
  try {
    const orden = await Orden.findByPk(id);
    orden.set({ waiterId: waiterId });
    await orden.save();
    res.send("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const setTimer = async (req, res) => {
  const { id } = req.params;
  const { timer } = req.body;
  try {
    const orden = await Orden.findByPk(id);

    orden.set({ timer });
    await orden.save();

    res.send("Changed Status Successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
