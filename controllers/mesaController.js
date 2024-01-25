import { DATE, Op } from "sequelize";
import { Mesa, Orden, Waiter } from "../models/relations.js";

//Mesas
export const createMesa = async (req, res) => {
  const { numero, capacidad, auxiliar, seccionId, mesas } = req.body;

  try {
    if (auxiliar && mesas != null) {
      let estado = "Ocupado";
      const mesa = await Mesa.create({
        numero,
        capacidad,
        auxiliar,
        seccionId,
        estado,
        mesas,
      });
      res.json(mesa);
    } else {
      const mesa = await Mesa.create({
        numero,
        capacidad,
        auxiliar,
        seccionId,
      });
      res.json(mesa);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMesas = async (req, res) => {
  try {
    const mesas = await Mesa.findAll({
      where: { estado: { [Op.not]: "Bloqueado" } },
    });
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMesasWaiters = async (req, res) => {
  try {
    const mesas = await Mesa.findAll({
      order: [["numero", "ASC"]],
    });

    const promises = mesas.map(async (mesa) => {
      const orden = await Orden.findOne({
        where: {
          mesaId: mesa.id,
          estado: "Pendiente",
        },
        include: { model: Waiter },
      });

      if (orden) {
        mesa.dataValues.orden = orden;
      }
      return mesa;
    });

    const mesasConOrdenes = await Promise.all(promises);

    res.json(mesasConOrdenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarEstadoMesa = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const mesa = await Mesa.findByPk(id);
    switch (estado) {
      case "1":
        mesa.set({ estado: "Libre" });
        await mesa.save();
        break;
      case "2":
        mesa.set({ estado: "Ocupado" });
        await mesa.save();
        break;
      case "3":
        mesa.set({ estado: "Deshabilitado" });
        await mesa.save();
        break;
      case "4":
        mesa.set({ estado: "Reservado" });
        await mesa.save();
        break;
      case "5":
        mesa.set({ estado: "Bloqueado" });
        await mesa.save();
        break;
      default:
        console.log("Estado no reconocido");
        break;
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

export const mesaDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const mesa = await Mesa.findByPk(id);
    if (!mesa) {
      return res.send("no existe el registro");
    }
    await mesa.update({ deletedAt: new Date() });

    res.json(mesa);
  } catch (error) {
    console.log(error);
  }
};
