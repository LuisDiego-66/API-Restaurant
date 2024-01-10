import { Op } from "sequelize";
import { Categoria, Comida, Variante, Opcion } from "../models/relations.js";
import cloudinary from "../utills/cloudinary.js";

//Categorias
export const createCategoria = async (req, res) => {
  let { nombre, estado, fechaI, fechaF } = req.body;
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

        await Categoria.create({
          nombre,
          url,
          estado,
          horaInicio,
          horaFin,
        });
      } else {
        await Categoria.create({
          nombre,
          url,
          estado,
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

export const getCategorias = async (req, res) => {
  try {
    const fechaActual = new Date();
    const horaActual = fechaActual.getHours() * 60 + fechaActual.getMinutes();

    const categorias = await Categoria.findAll();

    const newCategorias = await Promise.all(
      categorias.map(async (c) => {
        const categoria = await Categoria.findOne({
          where: {
            id: c.id,
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

        c.dataValues.enabled = !!categoria;

        return c;
      })
    );
    res.json(newCategorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);
    res.json(categoria);
  } catch (error) {
    res.send(error);
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

export const cambiarEstadoCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findByPk(id);

    if (categoria.estado == "Habilitado") {
      categoria.set({ estado: "Deshabilitado" });
      await categoria.save();
    } else if (categoria.estado == "Deshabilitado") {
      categoria.set({ estado: "Habilitado" });
      await categoria.save();
    }
    res.send("Changed Status Successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCatedoria = async (req, res) => {
  let { nombre, estado, fechaI, fechaF } = req.body;
  const { id } = req.params;
  try {
    const categoria = await Categoria.findByPk(id);

    if (fechaI != null && fechaF != null) {
      fechaI = new Date(fechaI);
      fechaF = new Date(fechaF);
      const horaInicio = fechaI.getHours() * 60 + fechaI.getMinutes();
      const horaFin = fechaF.getHours() * 60 + fechaF.getMinutes();

      await categoria.set({
        nombre,
        estado,
        horaInicio,
        horaFin,
      });
      categoria.save();
      res.status(200).json({
        message: "successful update",
      });
    } else {
      await categoria.set({
        nombre,
        estado,
      });
      categoria.save();
      res.status(200).json({
        message: "successful update",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
