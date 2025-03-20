import { Request, Response,RequestHandler } from "express";
import axios from "axios";
import { mealsCollection } from "../src/database";
import { Meal, themealdbResponse } from "../models/meal";
import { usersCollection } from "../src/database";
import User from "../models/user";
import { error } from "console";
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";


export const addMealToFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firebaseId } = req.params;
    const favouriteMeal = req.body;

    const user = await usersCollection.findOne({ firebaseId });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const updatedUser = await usersCollection.updateOne(
      { firebaseId },
      { $push: { favorites: favouriteMeal } }
    );

    if (updatedUser.modifiedCount === 1) {
      res.status(200).json({ message: 'Meal added to favorites' });
    } else {
      res.status(500).json({ message: 'Failed to add meal to favorites' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeMealFromFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firebaseId, mealId } = req.params;

    const user = await usersCollection.findOne({ firebaseId });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updatedUser = await usersCollection.updateOne(
      { firebaseId },
      { $pull: { favorites: { idMeal: mealId } } } // Remove the meal from favorites
    );

    if (updatedUser.modifiedCount === 1) {
      res.status(200).json({ message: "Meal removed from favorites" });
    } else {
      res.status(500).json({ message: "Failed to remove meal from favorites" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Fetch a meal by its name
export const getMealByName = async (req: Request, res: Response) => {
  const { name } = req.params;

  if (!name) {
    res.status(400).json({ error: "Meal name is required" });
    return;
  }
  try {
    const response = await axios.get(`${BASE_URL}/search.php?s=${name}`);

    if (!response.data.meals) {
      res.status(404).json({ message: `No meals found with the name: ${name}` });
      return;
    }
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching meal by name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMealsByIngredients: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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
    const response = await axios.get(`${BASE_URL}/filter.php`, {
      params: { i: ingredientArray.join(',') }
    });

    if (!response.data.meals) {
      res.status(404).json({ message: "No meals found for the given ingredients." });
      return;
    }

    res.status(200).json(response.data);
    return;
  } catch (error) {
    console.error("Error fetching meals by ingredients:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};


// Fetch meals by the first letter
export const getMealsByLetter = async (req: Request, res: Response) => {
  const { letter } = req.params;

  if (!letter || letter.length !== 1 || !/^[a-zA-Z]$/.test(letter)) {
    res.status(400).json({ error: "Please provide a single valid letter (a-z)." });
    return;
  }

  try {
    const response = await axios.get(`${BASE_URL}/search.php?f=${letter}`);

    if (!response.data.meals) {
      res.status(404).json({ message: `No meals found for the letter: ${letter}` });
      return;
    }
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching meals by first letter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch a random meal
export const getRandomMeal = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${BASE_URL}/random.php`);

    if (!response.data.meals || response.data.meals.length === 0) {
      res.status(404).json({ message: "No random meal found" });
      return;
    }

    const meal = response.data.meals[0];
    const mealId = meal.idMeal;

    res.status(200).json({ mealId, meal });
  } catch (error) {
    console.error("Error fetching random meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch meal categories
export const getMealCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`${BASE_URL}/categories.php`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching meal categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
