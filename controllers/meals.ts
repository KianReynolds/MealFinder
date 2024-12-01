import { Request, Response } from "express";
import axios from "axios";
import { mealsCollection } from "../src/database";
import { Meal } from "../models/meal";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// Insert a sample meal
export const insertSampleMeal = async (req: Request, res: Response) => {
  //create a new meal in the database
  try {
    const newMeal = req.body as Meal;

    const result = await mealsCollection.insertOne(newMeal)

    if (result) {
      res.status(201)
      .location(`${result.insertedId}`)
      .json({message : 
        `Created a new meal with id ${result.insertedId}`
      })} else {
        res.status(500).send("Failed to create a new meal");
      }
    }
    catch (error) {
      if (error instanceof Error)
      {
        console.log(`issue with inserting ${error.message}`);
      }
      else{
        console.log(`error with ${error}`)
      }
      res.status(400).send(`Unable to create new meal`);
    }
};

// // Fetch meal by name
// export const getMealByName = async (req: Request, res: Response): Promise<void> => {
//   const { name } = req.params;
//   try {
//     const response = await axios.get(`${BASE_URL}/search.php?s=${name}`);
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching meal by name:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Fetch meals by first letter
// export const getMealsByLetter = async (req: Request, res: Response): Promise<void> => {
//   const { letter } = req.params;
//   try {
//     const response = await axios.get(`${BASE_URL}/search.php?f=${letter}`);
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching meals by first letter:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Fetch meal by ID
// export const getMealById = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params;
//   try {
//     const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching meal by ID:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Fetch random meal
// export const getRandomMeal = async (_req: Request, res: Response): Promise<void> => {
//   try {
//     const response = await axios.get(`${BASE_URL}/random.php`);
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching random meal:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Fetch meal categories
// export const getMealCategories = async (_req: Request, res: Response): Promise<void> => {
//   try {
//     const response = await axios.get(`${BASE_URL}/categories.php`);
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching meal categories:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
