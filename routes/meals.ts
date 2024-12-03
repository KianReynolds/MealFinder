import express from "express";


import {
  insertSampleMeal,
  getMealByName,
  getMealsByLetter,
  getMealById,
  getRandomMeal,
  getMealCategories,
  getMealIngredients,
  updateMeal,
  deleteMeal,
  
} from "../controllers/meals";

const router = express.Router();

// Routes
router.post("/sample", insertSampleMeal);
router.get("/:name", getMealByName);
router.get("/:letter", getMealsByLetter);
router.get("/:id", getMealById);
router.get("/random", getRandomMeal);
router.get("/categories", getMealCategories);
//router.get("/ingredient/:ingredient", getMealIngredients);

export default router;
