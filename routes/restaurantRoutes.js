import express from "express";
import {
  createMesa,
  getMesas,
  cambiarEstadoMesa,
  cambiarEstadoMesas,
  createCategoria,
  getCategorias,
  getComidaCategoria,
  createOpcion,
  getOpciones,
  createVariante,
  getVariantes,
  getItems,
  createItem,
  createComida,
  getComidas,
  getComida,
  createOrden,
  getOrdenes,
  getOrden,
  cambiarEstadoOrden,
  cambiarMesaOrden,
  cambiarWaiterOrden,
  getAllWaiter,
  getWaiter,
  tableFromWaiter,
} from "../controllers/restaurantController.js";
import upload from "../middlewares/subirImagen.js";
import authentication from "../middlewares/authentication.js";

const router = express.Router();

//Mesas
router.post("/mesas/create", authentication, createMesa);
router.get("/mesas/get", authentication, getMesas);
router.post("/change-table-status/:id", authentication, cambiarEstadoMesa); //post que cambia el estado de una mesa de libre a ocupado o viceversa

router.post("/change-table-status", authentication, cambiarEstadoMesas); //post que cambia el estado varias mesas

//Categorias
router.post(
  "/categorias/create",
  authentication,
  upload.single("imagen"),
  createCategoria
);
router.get("/categorias/get", authentication, getCategorias);
router.get("/categorias/get/all", authentication, getComidas); //Lista todas las Comidas
router.get("/categorias/get/:id", authentication, getComidaCategoria); //lista comidas por categoria

//Opciones
router.post("/opciones/create", authentication, createOpcion);
router.get("/opciones/get", authentication, getOpciones);

//Variantes
router.post("/variantes/create", authentication, createVariante);
router.get("/variantes/get", authentication, getVariantes);

//Items
router.get("/items/get", authentication, getItems);
router.post("/items/create/:id", authentication, createItem); // agregar nuevo item a la orden

//Comidas
router.post("/comidas/create", authentication, createComida); // Comida Completa
router.get("/comidas/get", authentication, getComidas); //ver todas las comidas con sus variantes y las opciones de las variantes
router.get("/comidas/get/:id", authentication, getComida);

//Ordenes
router.post("/ordenes/create", authentication, createOrden); // Orden Completa
router.get("/ordenes/get", authentication, getOrdenes); //ver la orden con la comida, items y la mesa
router.get("/ordenes/get/:id", authentication, getOrden);
router.post("/change-order-status/:id", authentication, cambiarEstadoOrden); //Cambiar estado de orden
router.post("/change-order-table/:id", authentication, cambiarMesaOrden); //Cambiar mesa de la orden
router.post("/change-order-waiter/:id", authentication, cambiarWaiterOrden); //Cambiar mesero de la orden

//Meseros
router.get("/waiters/get", authentication, getWaiter); // del empleado con la sesion abierta
router.get("/table-from-waiter/get", authentication, tableFromWaiter);

//lista de meseros SuperAdmin
router.get("/waiters/getAll", authentication, getAllWaiter); // superAdmin

export default router;
