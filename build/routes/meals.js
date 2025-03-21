"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const meals_1 = require("../controllers/meals"); // Add the function here
const router = express_1.default.Router();
// Routes
//router.post("/sample", insertSampleMeal);
router.get("/:name", meals_1.getMealByName);
router.get("/:letter", meals_1.getMealsByLetter);
router.get("/:ingredients", meals_1.getMealsByIngredients);
//router.get("/:id", getMealById);
//router.get("/random", getRandomMeal);
//router.get("/categories", getMealCategories);
//router.get("/ingredient/:ingredient", getMealIngredients);
// Route to add meal to user's favourites
router.post("/:firebaseId/favorites", meals_1.addMealToFavorites);
router.delete("/:firebaseId/favorites/:mealId", meals_1.removeMealFromFavorites);
//router.delete("/:firebaseId/favorites/:recipeId", removeMealFromFavorites); 
exports.default = router;
