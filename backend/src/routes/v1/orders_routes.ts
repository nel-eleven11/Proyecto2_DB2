import Router from "express";
import {
  createOrden,
  getOrdenes,
  getOrdenById,
  updateOrden,
  deleteOrden,
  getOrdenesByEstado,
  getOrdenesByRestaurant,
  sortOrdenesByDate,
  sortOrdenesByTotal,
  queryOrdenes,
} from "../../controllers/order/order_controller";

const router = Router();

// CRUD routes
router.post("/", createOrden);
router.get("/", getOrdenes);
router.get("/:id", getOrdenById);
router.put("/:id", updateOrden);
router.delete("/:id", deleteOrden);

// Queries for orders
router.get("/by-status", getOrdenesByEstado);
router.get("/by-restaurant/:id", getOrdenesByRestaurant);
router.get("/sorted-by-date", sortOrdenesByDate);
router.get("/sorted-by-total", sortOrdenesByTotal);
router.get("/query", queryOrdenes);



export default router;
