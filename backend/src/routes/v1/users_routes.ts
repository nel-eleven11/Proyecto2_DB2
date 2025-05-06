import Router from "express";
import {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  getUsuarioOrdenes,
  createUsuarioOrden,
  getUsuariosByNameOrApellido,
  sortUsuariosByFechaRegistro,
  queryUsuarios,
} from '../../controllers/user/userController';

const router = Router();

// CRUD routes
router.post("/", createUsuario);
router.get("/", getUsuarios);
router.get("/:id", getUsuarioById);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);

// Nested routes for ordenes
router.get("/:id/ordenes", getUsuarioOrdenes);
router.post("/:id/ordenes", createUsuarioOrden);

// Queries for users
router.get("/by-name", getUsuariosByNameOrApellido);
router.get("/sorted-by-registration", sortUsuariosByFechaRegistro);
router.get("/query", queryUsuarios);


export default router;
