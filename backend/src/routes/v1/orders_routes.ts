import Router from "express";
import {
  createOrden,
  createMultipleOrdenes,
  getOrdenes,
  getOrdenById,
  updateOrden,
  updateMultipleOrdenes,
  deleteOrden,
  deleteMultipleOrdenes,
  getOrdenesByEstado,
  getOrdenesByRestaurant,
  sortOrdenesByDate,
  sortOrdenesByTotal,
  queryOrdenes,
} from "../../controllers/order/order_controller";

const router = Router();

// Queries for orders
router.get("/by-status", getOrdenesByEstado);
router.get("/by-restaurant/:id", getOrdenesByRestaurant);
router.get("/sorted-by-date", sortOrdenesByDate);
router.get("/sorted-by-total", sortOrdenesByTotal);
router.get("/query", queryOrdenes);

// CRUD routes
router.post("/", createOrden);
router.post("/bulk", createMultipleOrdenes);
router.get("/", getOrdenes);
router.get("/:id", getOrdenById);
router.put("/bulk", updateMultipleOrdenes);
router.put("/:id", updateOrden);
router.delete("/bulk", deleteMultipleOrdenes);
router.delete("/:id", deleteOrden);



export default router;
