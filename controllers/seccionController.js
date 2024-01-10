import { Op } from "sequelize";
import { Seccion, Mesa, Orden, Waiter } from "../models/relations.js";

//secciones
export const createSeccion = async (req, res) => {
  let { nombre, descripcion, estado, fechaI, fechaF } = req.body;
  try {
    if (fechaI != null && fechaF != null) {
      fechaI = new Date(fechaI);
      fechaF = new Date(fechaF);

      const horaInicio = fechaI.getHours() * 60 + fechaI.getMinutes();
      const horaFin = fechaF.getHours() * 60 + fechaF.getMinutes();

      await Seccion.create({
        nombre,
        descripcion,
        estado,
        horaInicio,
        horaFin,
      });
    } else {
      await Seccion.create({
        nombre,
        descripcion,
        estado,
      });
    }
    res.send("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSecciones = async (req, res) => {
  try {
    const fechaActual = new Date();
    const horaActual = fechaActual.getHours() * 60 + fechaActual.getMinutes;

    const secciones = await Seccion.findAll();

    const newSecciones = await Promise.all(
      secciones.map(async (s) => {
        const seccion = await Seccion.findOne({
          where: {
            id: s.id,
            estado: "Habilitado",
            [Op.or]: [
              {
                [Op.and]: [
                  { horaInicio: { [Op.lte]: horaActual } },
                  { horaFin: { [Op.gte]: horaActual } },
                ],
              },
              {
                [Op.and]: [{ horaInicio: 0 }, { horaFin: 0 }],
              },
            ],
          },
        });

        s.dataValues.enabled = !!seccion;

        return s;
      })
    );

    res.json(newSecciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSeccion = async (req, res) => {
  try {
    const { id } = req.params;
    const seccion = await Seccion.findByPk(id);
    res.json(seccion);
  } catch (error) {
    res.send(error);
  }
};

export const updateSeccion = async (req, res) => {
  let { nombre, descripcion, estado, fechaI, fechaF } = req.body;
  const { id } = req.params;
  try {
    const seccion = await Seccion.findByPk(id);

    if (fechaI != null && fechaF != null) {
      fechaI = new Date(fechaI);
      fechaF = new Date(fechaF);
      const horaInicio = fechaI.getHours() * 60 + fechaI.getMinutes();
      const horaFin = fechaF.getHours() * 60 + fechaF.getMinutes();

      seccion.set({
        nombre,
        descripcion,
        estado,
        horaInicio,
        horaFin,
      });
      await seccion.save();
      res.status(200).json({
        message: "successful update",
      });
    } else {
      seccion.set({
        nombre,
        descripcion,
        estado,
      });
      await seccion.save();
      res.status(200).json({
        message: "successful update",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const seccionMesas = async (req, res) => {
  const { id } = req.params;
  try {
    const mesas = await Mesa.findAll({
      order: [["numero", "ASC"]],
      where: {
        seccionId: id,
      },
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
    console.log(error);
  }
};
