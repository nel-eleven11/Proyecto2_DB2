import Router from "express";
import {
  createArticulo,
  createMultipleArticulos,
  getArticulos,
  getArticuloById,
  updateArticulo,
  updateMultipleArticulos,
  deleteArticulo,
  deleteMultipleArticulos,
  sortArticulosByPrice,
  getAvailableArticulos,
  getArticulosByPrice,
  queryArticulos,
} from "../../controllers/menu_article/menu_article_controller";

const router = Router();

// CRUD routes
router.post("/", createArticulo);
router.post("/bulk", createMultipleArticulos);
router.get("/", getArticulos);
router.get("/:id", getArticuloById);
router.put("/:id", updateArticulo);
router.put("/bulk", updateMultipleArticulos);
router.delete("/:id", deleteArticulo);
router.delete("/bulk", deleteMultipleArticulos);

// Queries for menu_articles
router.get("/sorted-by-price", sortArticulosByPrice);
router.get("/available", getAvailableArticulos);
router.get("/by-price", getArticulosByPrice);
router.get("/query", queryArticulos);

export default router;
