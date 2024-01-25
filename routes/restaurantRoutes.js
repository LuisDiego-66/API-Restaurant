import express from "express";

import { saludo } from "../controllers/Controller.js";
import {
  createMesa,
  getMesas,
  getMesasWaiters,
  cambiarEstadoMesa,
  cambiarEstadoMesas,
  mesaDelete,
} from "../controllers/mesaController.js";

import {
  createCategoria,
  getCategorias,
  getCategoria,
  getComidaCategoria,
  cambiarEstadoCategoria,
  updateCatedoria,
  categoriasDelete,
} from "../controllers/categoriaController.js";

import { createOpcion, getOpciones } from "../controllers/opcionController.js";
import {
  createVariante,
  getVariantes,
  variantesDelete,
  variantesUpdate,
} from "../controllers/varianteController.js";

import {
  createItem,
  getItems,
  editItem,
  itemsDelete,
} from "../controllers/itemController.js";

import {
  createComidaNormal,
  createComida,
  getComidas,
  getComida,
  cambiarEstadoComida,
  updateComida,
  comidasDelete,
} from "../controllers/comidaController.js";

import {
  createOrden,
  getOrdenes,
  getOrden,
  editOrden,
  cambiarEstadoOrden,
  cambiarMesaOrden,
  cambiarWaiterOrden,
  setTimer,
} from "../controllers/ordenController.js";

import {
  getAllWaiter,
  getWaiter,
  tableFromWaiter,
  orderFromWaiter,
} from "../controllers/waiterController.js";

import {
  createSeccion,
  getSecciones,
  updateSeccion,
  seccionMesas,
  getSeccion,
  seccionesDetele,
} from "../controllers/seccionController.js";

import upload from "../middlewares/subirImagen.js";
import authentication from "../middlewares/authentication.js";
import permissions from "../middlewares/permissions.js";

const router = express.Router();

router.get("/", saludo);

//########################################################################################   Mesas
router.post("/mesas/create", authentication, permissions(3), createMesa);
router.get("/mesas/get", authentication, permissions(4), getMesas);
router.get(
  "/mesas/mesas-waiters/get",
  authentication,
  permissions(4),
  getMesasWaiters
);
router.post(
  "/mesas/change-status/:id", //post que cambia el estado de una mesa de libre a ocupado o viceversa
  authentication,
  permissions(3),
  cambiarEstadoMesa
);
router.post(
  "/mesas/change-status", //post que cambia el estado varias mesas
  authentication,
  permissions(3),
  cambiarEstadoMesas
);
router.post("/mesas/delete/:id", authentication, permissions(2), mesaDelete);

//########################################################################################   Categorias
router.post(
  "/categorias/create",
  authentication,
  permissions(2),
  upload.single("imagen"),
  createCategoria
);
router.get("/categorias/get/all", authentication, permissions(4), getComidas); //Lista todas las Comidas

router.get("/categorias/get", authentication, permissions(4), getCategorias);

router.get("/categorias/get/:id", authentication, permissions(2), getCategoria);

router.get(
  "/categorias/get-comidas/:id", //lista comidas por categoria
  authentication,
  permissions(4),
  getComidaCategoria
);
router.post(
  "/categorias/change-status/:id", //cambiar estado a categoria
  authentication,
  permissions(2),
  cambiarEstadoCategoria
);
router.post(
  "/categorias/update/:id",
  authentication,
  permissions(2),
  updateCatedoria
);

router.post(
  "/categorias/delete/:id",
  authentication,
  permissions(2),
  categoriasDelete
);

//########################################################################################   Opciones
router.post("/opciones/create", authentication, permissions(2), createOpcion);
router.get("/opciones/get", authentication, permissions(4), getOpciones);

//########################################################################################   Variantes
router.post(
  "/variantes/create",
  authentication,
  permissions(2),
  createVariante
);
router.get("/variantes/get", authentication, permissions(4), getVariantes);
router.post(
  "/variantes/update/:id",
  authentication,
  permissions(4),
  variantesUpdate
);

router.post(
  "/variantes/delete/:id",
  authentication,
  permissions(4),
  variantesDelete
);

//########################################################################################   Item
router.post("/items/create/:id", authentication, permissions(2), createItem); // agregar nuevo item a la orden
router.get("/items/get", authentication, permissions(4), getItems);
router.post("/items/editar/:id", authentication, permissions(2), editItem); // editar nuevo item a la orden
router.post("/items/delete/:id", authentication, permissions(2), itemsDelete);
//########################################################################################   Comida
router.post(
  "/comidas/create", //Crear Comida Normal
  authentication,
  permissions(2),
  upload.single("imagen"),
  createComidaNormal
);
router.post(
  "/comidas/createAll", //Comida Completa
  authentication,
  permissions(2),
  upload.single("imagen"),
  createComida
);
router.get("/comidas/get", authentication, permissions(4), getComidas); //ver todas las comidas con sus variantes y las opciones de las variantes
router.get("/comidas/get/:id", authentication, permissions(4), getComida);
router.post(
  "/comidas/change-status/:id", //Cambiar estado Comida
  authentication,
  permissions(3),
  cambiarEstadoComida
);

router.post(
  "/comidas/update/:id",
  authentication,
  permissions(2),
  updateComida
);

router.post(
  "/comidas/delete/:id",
  authentication,
  permissions(2),
  comidasDelete
);

//########################################################################################   Orden
router.post("/ordenes/create", authentication, permissions(4), createOrden); // Orden Completa
router.get("/ordenes/get", authentication, permissions(4), getOrdenes); //ver la orden con la comida, items y la mesa
router.get("/ordenes/get/:id", authentication, permissions(4), getOrden);
router.post("/ordenes/editar/:id", authentication, permissions(3), editOrden);
router.post(
  "/ordenes/change-status/:id", //Cambiar estado de orden
  authentication,
  permissions(2),
  cambiarEstadoOrden
);
router.post(
  "/ordenes/change-table/:id", //Cambiar mesa de la orden
  authentication,
  permissions(3),
  cambiarMesaOrden
);
router.post(
  "/ordenes/change-waiter/:id", //Cambiar mesero de la orden
  authentication,
  permissions(3),
  cambiarWaiterOrden
);
router.post("/ordenes/setTimer/:id", authentication, permissions(3), setTimer);

//########################################################################################   Waiter
router.get("/waiters/get", authentication, permissions(4), getWaiter); // del empleado con la sesion abierta
router.get(
  "/waiters/tables-waiter/get", // mesas del mesero actual
  authentication,
  permissions(4),
  tableFromWaiter
);
router.get(
  "/waiters/orders-waiter/get", // ordenes del mesero autenticado
  authentication,
  permissions(4),
  orderFromWaiter
);
router.get("/waiters/getAll", authentication, permissions(3), getAllWaiter); // superAdmin

//########################################################################################   Seccion
router.post("/secciones/create", authentication, permissions(4), createSeccion);
router.get("/secciones/get", authentication, permissions(4), getSecciones);
router.post(
  "/secciones/update/:id",
  authentication,
  permissions(2),
  updateSeccion
);
router.get(
  "/secciones/mesas-seccion/:id",
  authentication,
  permissions(4),
  seccionMesas
);
router.get("/secciones/get/:id", authentication, permissions(2), getSeccion);

router.post(
  "/secciones/delete/:id",
  authentication,
  permissions(2),
  seccionesDetele
);

export default router;
