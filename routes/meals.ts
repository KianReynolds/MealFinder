import express from "express";
import {
  //insertSampleMeal,
  getMealByName,
  getMealsByLetter,
  //getMealById,
  //getRandomMeal,
  //getMealCategories,
  //getMealIngredients,
  addMealToFavorites, // Import the addMealToFavorites controller
  removeMealFromFavorites,
  getMealsByIngredients,
} from "../controllers/meals"; // Add the function here

const router = express.Router();

// Routes
//router.post("/sample", insertSampleMeal);
router.get("/:name", getMealByName);
router.get("/:letter", getMealsByLetter);
router.get("/:ingredients", getMealsByIngredients);
//router.get("/:id", getMealById);
//router.get("/random", getRandomMeal);
//router.get("/categories", getMealCategories);
//router.get("/ingredient/:ingredient", getMealIngredients);

// Route to add meal to user's favourites
router.post("/:firebaseId/favorites", addMealToFavorites);
router.delete("/:firebaseId/favorites/:mealId", removeMealFromFavorites);
//router.delete("/:firebaseId/favorites/:recipeId", removeMealFromFavorites); 
export default router;

