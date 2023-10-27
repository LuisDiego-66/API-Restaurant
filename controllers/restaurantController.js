import Comida_Variante from "../models/Comida_Variante.js";
import {
  Mesa,
  Categoria,
  Comida,
  Variante,
  Opcion,
  Orden,
  Item,
  Item_Opcion,
  Waiter,
} from "../models/relations.js";

//Mesas
export const createMesa = async (req, res) => {
  const { numero, capacidad, auxiliar, seccion, mesas } = req.body;
  let estado = "Libre";

  if (auxiliar && mesas != null) {
    estado = "Ocupado";
    const mesa = await Mesa.create({
      numero,
      capacidad,
      auxiliar,
      seccion,
      estado,
      mesas,
    });
    res.json(mesa);
  } else {
    const mesa = await Mesa.create({
      numero,
      capacidad,
      auxiliar,
      seccion,
      estado,
    });
    res.json(mesa);
  }
};

export const getMesas = async (req, res) => {
  const mesas = await Mesa.findAll();
  res.json(mesas);
};

export const cambiarEstadoMesa = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const mesa = await Mesa.findByPk(id);

  if (estado == "1") {
    mesa.set({ estado: "Libre" });
    await mesa.save();
    console.log("se cambio el estado a Libre");
  }
  if (estado == "2") {
    mesa.set({ estado: "Ocupado" });
    await mesa.save();
    console.log("se cambio el estado a Ocupado");
  }
  res.send("Changed Status Successfully");
};

export const cambiarEstadoMesas = async (req, res) => {
  const { tableAux, tablesIds } = req.body;
  const mesaAux = await Mesa.findByPk(tableAux);

  tablesIds.forEach(async (table) => {
    const mesa = await Mesa.findByPk(table.id);

    if (mesa.estado == "Libre") {
      mesa.set({ estado: "Ocupado" });
      await mesa.save();
    } else if (mesa.estado == "Ocupado") {
      mesa.set({ estado: "Libre" });
      mesaAux.set({ estado: "Deshabilitado" });
      await Promise.all([mesa.save(), mesaAux.save()]);
    }
  });
  res.send("Changed Status Successfully");
};

//Categorias
export const createCategoria = async (req, res) => {
  const { nombre } = req.body;
  const url = req.file.filename;
  await Categoria.create({
    nombre,
    url,
  });
  res.send("ok");
};

export const getCategorias = async (req, res) => {
  const categorias = await Categoria.findAll();
  res.json(categorias);
};

export const getComidaCategoria = async (req, res) => {
  const { id } = req.params;
  const comidas = await Comida.findAll({
    where: { categoriaId: id },
    include: {
      model: Variante,
      include: { model: Opcion },
    },
  });
  res.json(comidas);
};

//Opciones
export const createOpcion = async (req, res) => {
  const { nombre, precio, varianteId } = req.body;
  await Opcion.create({
    nombre,
    precio,
    varianteId,
  });
  res.send("ok");
};

export const getOpciones = async (req, res) => {
  const opciones = await Opcion.findAll();
  res.json(opciones);
};

//Variantes
export const createVariante = async (req, res) => {
  const { tamaño, estado } = req.body;
  await Variante.create({
    tamaño,
    estado,
  });
  res.send("ok");
};

export const getVariantes = async (req, res) => {
  const variantes = await Variante.findAll();
  res.json(variantes);
};

//Items
export const getItems = async (req, res) => {
  const item = await Item.findAll();
  res.json(item);
};

export const createItem = async (req, res) => {
  const { id: ordenId } = req.params;
  const { cantidad, subtotal, comidaId, opciones } = req.body;

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
};

//Comidas
export const createComida = async (req, res) => {
  const { nombre, descripcion, precio, categoriaId, url, variantes } = req.body;
  //const url = req.file.filename

  const comida = await Comida.create({
    nombre,
    descripcion,
    precio,
    url,
    categoriaId,
  });
  variantes.forEach(async (variante) => {
    await Comida_Variante.create({
      comidaId: comida.id,
      varianteId: variante.id,
    });
  });
  res.send("ok");
};

export const getComidas = async (req, res) => {
  const comidas = await Comida.findAll({
    include: {
      model: Variante,
      include: { model: Opcion },
    },
  });
  res.json(comidas);
};

export const getComida = async (req, res) => {
  const { id } = req.params;
  const comidas = await Comida.findByPk(id, {
    include: {
      model: Variante,
      include: { model: Opcion },
    },
  });
  res.json(comidas);
};

//Ordenes
export const createOrden = async (req, res) => {
  const { estado, total, mesaId, items } = req.body;

  const waiter = req.waiter;
  const waiterId = waiter.id;

  const orden = await Orden.create({
    estado,
    total,
    mesaId,
    waiterId,
  });

  items.forEach(async (item) => {
    const i = await Item.create({
      cantidad: item.cantidad,
      subtotal: item.subtotal,
      comidaId: item.comidaId,
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
};

export const getOrdenes = async (req, res) => {
  const ordenes = await Orden.findAll({
    include: [
      { model: Mesa },
      { model: Item, include: [{ model: Comida }, { model: Opcion }] },
    ],
  });
  res.json(ordenes);
};

export const getOrden = async (req, res) => {
  const { id } = req.params;
  const ordenes = await Orden.findByPk(id, {
    include: [
      { model: Mesa },
      { model: Item, include: [{ model: Comida }, { model: Opcion }] },
    ],
  });
  res.json(ordenes);
};

export const cambiarEstadoOrden = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const orden = await Orden.findByPk(id);

  if (estado == "1") {
    orden.set({ estado: "Entregado" });
    await orden.save();
  }
  if (estado == "2") {
    orden.set({ estado: "Cancelado" });
    await orden.save();
  }
  res.send("Changed Status Successfully");
};

export const cambiarMesaOrden = async (req, res) => {
  const { id } = req.params;
  const { mesaId } = req.body;

  const orden = await Orden.findByPk(id);
  orden.set({ mesaId: mesaId });
  await orden.save();
  res.send("ok");
};

export const cambiarWaiterOrden = async (req, res) => {
  const { id } = req.params;
  const { waiterId } = req.body;

  const orden = await Orden.findByPk(id);
  orden.set({ waiterId: waiterId });
  await orden.save();
  res.send("ok");
};

export const getAllWaiter = async (req, res) => {
  const waiters = await Waiter.findAll();
  res.json(waiters);
};

export const getWaiter = async (req, res) => {
  const waiter = req.waiter;
  const id = waiter.id;
  const w = await Waiter.findByPk(id);
  res.json(w);
};

export const tableFromWaiter = async (req, res) => {
  const waiter = req.waiter;
  const id = waiter.id;

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
};
