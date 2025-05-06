import Router from "express";
import {
  createArticulo,
  getArticulos,
  getArticuloById,
  updateArticulo,
  deleteArticulo,
  sortArticulosByPrice,
  getAvailableArticulos,
  getArticulosByPrice,
  queryArticulos,
} from "../../controllers/menu_article/menu_article_controller";

const router = Router();

// CRUD routes
router.post("/", createArticulo);
router.get("/", getArticulos);
router.get("/:id", getArticuloById);
router.put("/:id", updateArticulo);
router.delete("/:id", deleteArticulo);

// Queries for menu_articles
router.get("/sorted-by-price", sortArticulosByPrice);
router.get("/available", getAvailableArticulos);
router.get("/by-price", getArticulosByPrice);
router.get("/query", queryArticulos);

export default router;
