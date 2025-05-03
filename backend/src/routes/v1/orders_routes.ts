import Router from "express";
import {
  createOrden,
  getOrdenes,
  getOrdenById,
  updateOrden,
  deleteOrden,
} from "../../controllers/order/order_controller";

const router = Router();

// CRUD routes
router.post("/", createOrden);
router.get("/", getOrdenes);
router.get("/:id", getOrdenById);
router.put("/:id", updateOrden);
router.delete("/:id", deleteOrden);

export default router;
