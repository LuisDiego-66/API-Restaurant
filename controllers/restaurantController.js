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
import cloudinary from "../utills/cloudinary.js";

export const saludo = async (req, res) => {
  res.send("hola mundo");
};

//Mesas
export const createMesa = async (req, res) => {
  const { numero, capacidad, auxiliar, seccion, mesas } = req.body;
  let estado = "Libre";

  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMesas = async (req, res) => {
  try {
    const mesas = await Mesa.findAll();
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMesasWaiters = async (req, res) => {
  try {
    const mesas = await Mesa.findAll({
      include: { model: Orden, include: { model: Waiter } },
    });
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarEstadoMesa = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarEstadoMesas = async (req, res) => {
  const { tableAux, tablesIds } = req.body;

  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Categorias
export const createCategoria = async (req, res) => {
  const { nombre } = req.body;
  try {
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
      await Categoria.create({
        nombre,
        url,
      });
      res.status(200).json({
        success: true,
        message: "Uploaded successfull",
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getComidaCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const comidas = await Comida.findAll({
      where: { categoriaId: id },
      include: {
        model: Variante,
        include: { model: Opcion },
      },
    });
    res.json(comidas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

//Variantes
export const createVariante = async (req, res) => {
  const { tamaño, estado } = req.body;

  try {
    await Variante.create({
      tamaño,
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

//Items
export const getItems = async (req, res) => {
  try {
    const item = await Item.findAll();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

//Comidas
export const createComidaNormal = async (req, res) => {
  const { nombre, descripcion, precio, categoriaId } = req.body;

  try {
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

      await Comida.create({
        nombre,
        descripcion,
        precio,
        categoriaId,
        url,
      });

      res.status(200).json({
        success: true,
        message: "Uploaded successfull",
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createComida = async (req, res) => {
  const { nombre, descripcion, precio, categoriaId, variantes } = req.body;

  try {
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

      res.status(200).json({
        success: true,
        message: "Uploaded successfull",
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getComidas = async (req, res) => {
  try {
    const comidas = await Comida.findAll({
      include: {
        model: Variante,
        include: { model: Opcion },
      },
    });
    res.json(comidas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getComida = async (req, res) => {
  const { id } = req.params;

  try {
    const comidas = await Comida.findByPk(id, {
      include: {
        model: Variante,
        include: { model: Opcion },
      },
    });
    res.json(comidas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Ordenes
export const createOrden = async (req, res) => {
  const { total, mesaId, items } = req.body;

  const waiter = req.waiter;
  const waiterId = waiter.id;

  try {
    const orden = await Orden.create({
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      include: [
        { model: Mesa },
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
        { model: Item, include: [{ model: Comida }, { model: Opcion }] },
      ],
    });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarEstadoOrden = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarMesaOrden = async (req, res) => {
  const { id } = req.params;
  const { mesaId } = req.body;
  try {
    const orden = await Orden.findByPk(id);
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
