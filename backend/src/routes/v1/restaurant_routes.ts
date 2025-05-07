import Router from "express";
import {
  createRestaurante,
  createMultipleRestaurantes,
  getRestaurantes,
  getRestauranteById,
  updateRestaurante,
  updateMultipleRestaurantes,
  deleteRestaurante,
  deleteMultipleRestaurantes,
  getRestauranteResenas,
  createRestauranteResena,
  getRestauranteArticulos,
  createRestauranteArticulo,
  getRestaurantesByCategories,
  sortRestaurantesByRating,
  getRestaurantesByName,
  queryRestaurantes,
} from "../../controllers/restaurant/restaurant_controller";

const router = Router();

// CRUD routes
router.post("/", createRestaurante);
router.post("/bulk", createMultipleRestaurantes);
router.get("/", getRestaurantes);
router.get("/:id", getRestauranteById);
router.put("/bulk", updateMultipleRestaurantes);
router.put("/:id", updateRestaurante);
router.delete("/bulk", deleteMultipleRestaurantes);
router.delete("/:id", deleteRestaurante);

// Nested routes for resenas
router.get("/:id/resenas", getRestauranteResenas);
router.post("/:id/resenas", createRestauranteResena);

// Nested routes for articulos_menu
router.get("/:id/articulos", getRestauranteArticulos);
router.post("/:id/articulos", createRestauranteArticulo);

// Queries routes for restaurant
router.get("/by-categories", getRestaurantesByCategories);
router.get("/sorted-by-rating", sortRestaurantesByRating);
router.get("/by-name", getRestaurantesByName);
router.get("/query", queryRestaurantes);



export default router;
