"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMealCategories = exports.getRandomMeal = exports.getMealsByLetter = exports.getMealsByIngredients = exports.getMealByName = exports.removeMealFromFavorites = exports.addMealToFavorites = void 0;
const axios_1 = __importDefault(require("axios"));
const database_1 = require("../src/database");
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const addMealToFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firebaseId } = req.params;
        const favouriteMeal = req.body;
        const user = yield database_1.usersCollection.findOne({ firebaseId });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const updatedUser = yield database_1.usersCollection.updateOne({ firebaseId }, { $push: { favorites: favouriteMeal } });
        if (updatedUser.modifiedCount === 1) {
            res.status(200).json({ message: 'Meal added to favorites' });
        }
        else {
            res.status(500).json({ message: 'Failed to add meal to favorites' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.addMealToFavorites = addMealToFavorites;
const removeMealFromFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firebaseId, mealId } = req.params;
        const user = yield database_1.usersCollection.findOne({ firebaseId });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const updatedUser = yield database_1.usersCollection.updateOne({ firebaseId }, { $pull: { favorites: { idMeal: mealId } } } // Remove the meal from favorites
        );
        if (updatedUser.modifiedCount === 1) {
            res.status(200).json({ message: "Meal removed from favorites" });
        }
        else {
            res.status(500).json({ message: "Failed to remove meal from favorites" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.removeMealFromFavorites = removeMealFromFavorites;
// Fetch a meal by its name
const getMealByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    if (!name) {
        res.status(400).json({ error: "Meal name is required" });
        return;
    }
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/search.php?s=${name}`);
        if (!response.data.meals) {
            res.status(404).json({ message: `No meals found with the name: ${name}` });
            return;
        }
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Error fetching meal by name:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getMealByName = getMealByName;
const getMealsByIngredients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ingredients } = req.params; // Use params instead of query
    // Log the ingredients to check what's being received
    console.log("Ingredients received:", req.params.ingredients);
    if (!ingredients || typeof ingredients !== 'string') {
        res.status(400).json({ error: "Please provide ingredients separated by commas." });
        return;
    }
    const ingredientArray = ingredients.split(',').map(ingredient => ingredient.trim().toLowerCase());
    if (ingredientArray.length === 0) {
        res.status(400).json({ error: "At least one ingredient must be provided." });
        return;
    }
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/filter.php`, {
            params: { i: ingredientArray.join(',') }
        });
        if (!response.data.meals) {
            res.status(404).json({ message: "No meals found for the given ingredients." });
            return;
        }
        res.status(200).json(response.data);
        return;
    }
    catch (error) {
        console.error("Error fetching meals by ingredients:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
});
exports.getMealsByIngredients = getMealsByIngredients;
// Fetch meals by the first letter
const getMealsByLetter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { letter } = req.params;
    if (!letter || letter.length !== 1 || !/^[a-zA-Z]$/.test(letter)) {
        res.status(400).json({ error: "Please provide a single valid letter (a-z)." });
        return;
    }
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/search.php?f=${letter}`);
        if (!response.data.meals) {
            res.status(404).json({ message: `No meals found for the letter: ${letter}` });
            return;
        }
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Error fetching meals by first letter:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getMealsByLetter = getMealsByLetter;
// Fetch a random meal
const getRandomMeal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/random.php`);
        if (!response.data.meals || response.data.meals.length === 0) {
            res.status(404).json({ message: "No random meal found" });
            return;
        }
        const meal = response.data.meals[0];
        const mealId = meal.idMeal;
        res.status(200).json({ mealId, meal });
    }
    catch (error) {
        console.error("Error fetching random meal:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getRandomMeal = getRandomMeal;
// Fetch meal categories
const getMealCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/categories.php`);
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Error fetching meal categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getMealCategories = getMealCategories;
