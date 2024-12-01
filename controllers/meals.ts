import { Request, Response } from "express";
import axios from "axios";
import { mealsCollection } from "../src/database";
import { Meal } from "../models/meal";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// Insert a sample meal
export const insertSampleMeal = async (req: Request, res: Response): => {
  const sampleMeal: Meal = {
    name: "Spicy Arrabiata Penne",
    category: "Vegetarian",
    instructions: "Bring a large pot of water to a boil...",
    ingredients: ["Penne", "Tomato Sauce", "Garlic"],
  };

  try {
    //const mealCollection = mealsCollection();
    const result = await mealsCollection.insertOne(sampleMeal);
    res.status(201).json({ message: "Sample meal inserted", id: result.insertedId });
  } catch (error) {
    console.error("Error inserting meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch meal by name
export const getMealByName = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/search.php?s=${name}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching meal by name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch meals by first letter
export const getMealsByLetter = async (req: Request, res: Response): Promise<void> => {
  const { letter } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/search.php?f=${letter}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching meals by first letter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch meal by ID
export const getMealById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching meal by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch random meal
export const getRandomMeal = async (_req: Request, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`${BASE_URL}/random.php`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching random meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch meal categories
export const getMealCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`${BASE_URL}/categories.php`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching meal categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
