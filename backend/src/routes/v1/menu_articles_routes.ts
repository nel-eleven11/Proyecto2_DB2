import Router from "express";
import {
  createArticulo,
  getArticulos,
  getArticuloById,
  updateArticulo,
  deleteArticulo,
} from "../../controllers/menu_article/menu_article_controller";

const router = Router();

// CRUD routes
router.post("/", createArticulo);
router.get("/", getArticulos);
router.get("/:id", getArticuloById);
router.put("/:id", updateArticulo);
router.delete("/:id", deleteArticulo);

export default router;
