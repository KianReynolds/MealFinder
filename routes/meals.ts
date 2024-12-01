import express from "express";
import {
  insertSampleMeal,
  getMealByName,
  getMealsByLetter,
  getMealById,
  getRandomMeal,
  getMealCategories,
} from "../controllers/meals";

const router = express.Router();

// Routes
router.post("/meals/sample", insertSampleMeal);
router.get("/search/:name", getMealByName);
router.get("/meals/:letter", getMealsByLetter);
router.get("/meal/:id", getMealById);
router.get("/random", getRandomMeal);
router.get("/categories", getMealCategories);

export default router;
