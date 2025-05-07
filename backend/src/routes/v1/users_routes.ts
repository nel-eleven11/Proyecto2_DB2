import Router from "express";
import {
  createUsuario,
  createMultipleUsuarios,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  updateMultipleUsuarios,
  deleteUsuario,
  deleteMultipleUsuarios,
  getUsuarioOrdenes,
  createUsuarioOrden,
  getUsuariosByNameOrApellido,
  sortUsuariosByFechaRegistro,
  queryUsuarios,
} from '../../controllers/user/userController';

const router = Router();

// CRUD routes
router.post("/", createUsuario);
router.post("/bulk", createMultipleUsuarios);
router.get("/", getUsuarios);
router.get("/:id", getUsuarioById);
router.put("/bulk", updateMultipleUsuarios);
router.put("/:id", updateUsuario);
router.delete("/bulk", deleteMultipleUsuarios);
router.delete("/:id", deleteUsuario);

// Nested routes for ordenes
router.get("/:id/ordenes", getUsuarioOrdenes);
router.post("/:id/ordenes", createUsuarioOrden);

// Queries for users
router.get("/by-name", getUsuariosByNameOrApellido);
router.get("/sorted-by-registration", sortUsuariosByFechaRegistro);
router.get("/query", queryUsuarios);


export default router;
