import express from "express";


import {
  insertSampleMeal,
  getMealByName,
  getMealsByLetter,
  getMealById,
  getRandomMeal,
  getMealCategories,
  updateMeal,
  deleteMeal,
  
} from "../controllers/meals";

const router = express.Router();

// Routes
router.post("/sample", insertSampleMeal);
router.get("/search/:name", getMealByName);
router.get("/letter/:letter", getMealsByLetter);
router.get("/:id", getMealById);
router.get("/random", getRandomMeal);
router.get("/categories", getMealCategories);

export default router;
