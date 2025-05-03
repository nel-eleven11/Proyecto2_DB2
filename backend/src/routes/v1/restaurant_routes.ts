import Router from "express";
import {
  createRestaurante,
  getRestaurantes,
  getRestauranteById,
  updateRestaurante,
  deleteRestaurante,
  getRestauranteResenas,
  createRestauranteResena,
  getRestauranteArticulos,
  createRestauranteArticulo,
} from "../../controllers/restaurant/restaurant_controller";

const router = Router();

// CRUD routes
router.post("/", createRestaurante);
router.get("/", getRestaurantes);
router.get("/:id", getRestauranteById);
router.put("/:id", updateRestaurante);
router.delete("/:id", deleteRestaurante);

// Nested routes for resenas
router.get("/:id/resenas", getRestauranteResenas);
router.post("/:id/resenas", createRestauranteResena);

// Nested routes for articulos_menu
router.get("/:id/articulos", getRestauranteArticulos);
router.post("/:id/articulos", createRestauranteArticulo);

export default router;
