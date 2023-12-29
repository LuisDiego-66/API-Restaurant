import Comida_Variante from "../models/Comida_Variante.js";
import { Op } from "sequelize";
import { Comida, Variante, Opcion } from "../models/relations.js";
import cloudinary from "../utills/cloudinary.js";

//Comidas
export const createComidaNormal = async (req, res) => {
  let {
    nombre,
    descripcion,
    precio,
    estado,
    s1_price,
    s2_price,
    s3_price,
    categoriaId,
    fechaI,
    fechaF,
  } = req.body;

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
      if (fechaI != null && fechaF != null) {
        fechaI = new Date(fechaI);
        fechaF = new Date(fechaF);

        const horaInicio = fechaI.getHours() * 60 + fechaI.getMinutes();
        const horaFin = fechaF.getHours() * 60 + fechaF.getMinutes();

        await Comida.create({
          nombre,
          descripcion,
          precio,
          categoriaId,
          url,
          estado,
          s1_price,
          s2_price,
          s3_price,
          horaInicio,
          horaFin,
        });
      } else {
        await Comida.create({
          nombre,
          descripcion,
          precio,
          categoriaId,
          url,
          estado,
          s1_price,
          s2_price,
          s3_price,
        });
      }
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
  let {
    nombre,
    descripcion,
    precio,
    categoriaId,
    variantes,
    estado,
    s1_price,
    s2_price,
    s3_price,
    fechaI,
    fechaF,
  } = req.body;

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

      if (fechaI != null && fechaF != null) {
        fechaI = new Date(fechaI);
        fechaI = new Date(fechaF);

        const horaInicio = fechaI.getHours() * 60 + fechaI.getMinutes();
        const horaFin = fechaF.getHours() * 60 + fechaF.getMinutes();

        const comida = await Comida.create({
          nombre,
          descripcion,
          precio,
          url,
          categoriaId,
          estado,
          s1_price,
          s2_price,
          s3_price,
          horaInicio,
          horaFin,
        });
        variantes.forEach(async (variante) => {
          await Comida_Variante.create({
            comidaId: comida.id,
            varianteId: variante.id,
          });
        });
      } else {
        const comida = await Comida.create({
          nombre,
          descripcion,
          precio,
          url,
          categoriaId,
          estado,
          s1_price,
          s2_price,
          s3_price,
        });
        variantes.forEach(async (variante) => {
          await Comida_Variante.create({
            comidaId: comida.id,
            varianteId: variante.id,
          });
        });
      }
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
    const fechaActual = new Date();
    const horaActual = fechaActual.getHours() * 60 + fechaActual.getMinutes();

    const comidas = await Comida.findAll({
      where: {
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
      where: {
        estado: "Habilitado",
      },
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

export const cambiarEstadoComida = async (req, res) => {
  const { id } = req.params;
  try {
    const comida = await Comida.findByPk(id);

    if (comida.estado == "Habilitado") {
      comida.set({ estado: "Deshabilitado" });
      await comida.save();
    } else if (comida.estado == "Deshabilitado") {
      comida.set({ estado: "Habilitado" });
      await comida.save();
    }
    res.send("Changed Status Successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComida = async (req, res) => {
  let {
    nombre,
    descripcion,
    precio,
    estado,
    s1_price,
    s2_price,
    s3_price,
    categoriaId,
    fechaI,
    fechaF,
  } = req.body;
  const { id } = req.params;
  try {
    const comida = await Comida.findByPk(id);

    if (fechaI != null && fechaF != null) {
      fechaI = new Date(fechaI);
      fechaF = new Date(fechaF);

      const horaInicio = fechaI.getHours() * 60 + fechaI.getMinutes();
      const horaFin = fechaF.getHours() * 60 + fechaF.getMinutes();

      comida.set({
        nombre,
        descripcion,
        precio,
        categoriaId,
        estado,
        s1_price,
        s2_price,
        s3_price,
        horaInicio,
        horaFin,
      });
      await comida.save();
      res.status(200).json({
        message: "successful update",
      });
    } else {
      comida.set({
        nombre,
        descripcion,
        precio,
        categoriaId,
        estado,
        s1_price,
        s2_price,
        s3_price,
      });
      await comida.save();
      res.status(200).json({
        message: "successful update",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
