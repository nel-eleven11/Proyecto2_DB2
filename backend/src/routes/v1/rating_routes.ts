import Router from "express";
import {
  createResena,
  getResenas,
  getResenaById,
  updateResena,
  deleteResena,
} from "../../controllers/rating/rating_controller";

const router = Router();

// CRUD routes
router.post("/", createResena);
router.get("/", getResenas);
router.get("/:id", getResenaById);
router.put("/:id", updateResena);
router.delete("/:id", deleteResena);

export default router;
