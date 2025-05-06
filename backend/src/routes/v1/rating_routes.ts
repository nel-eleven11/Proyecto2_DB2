import Router from "express";
import {
  createResena,
  getResenas,
  getResenaById,
  updateResena,
  deleteResena,
  getResenasByUsuario,
  sortResenasByRating,
  sortResenasByDate,
  queryResenas,
} from "../../controllers/rating/rating_controller";

const router = Router();

// CRUD routes
router.post("/", createResena);
router.get("/", getResenas);
router.get("/:id", getResenaById);
router.put("/:id", updateResena);
router.delete("/:id", deleteResena);

// Queries for ratings
router.get("/by-user/:id", getResenasByUsuario);
router.get("/sorted-by-rating", sortResenasByRating);
router.get("/sorted-by-date", sortResenasByDate);
router.get("/query", queryResenas);


export default router;
