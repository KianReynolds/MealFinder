import { Request, Response } from "express";
import axios from "axios";
import { mealsCollection } from "../src/database";
import { Meal } from "../models/meal";
import { ObjectId } from "mongodb";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

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


export const getMealByName =async  (req: Request, res: Response) => {
  const { name } = req.params;
  
  if(!name){
    res.status(400).json({ error: "Meal name is required"});
    return;
  }
  try {
    const response = await axios.get(`${BASE_URL}/search.php?s=${name}`);

    if(!response.data.meals){
      res.status(404).json({message: `No meals found with the name: ${name}`});
    }
    res.status(200).json(response.data);

 } catch (error) {
  if (error instanceof Error)
  {
   console.log(`issue with inserting ${error.message}`);
  }
  else{
    console.log(`error with ${error}`)
  }
  res.status(400).send(`Unable to get user`);
}

};


export const getMealById = async (req: Request, res: Response) => {
  //get a single meal by ID from the database
  
  let id:string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const meal = (await mealsCollection.findOne(query)) as Meal;

    if (meal) {
        res.status(200).send(meal);
    }
} catch (error) {
  if (error instanceof Error)
  {
   console.log(`issue with inserting ${error.message}`);
  }
  else{
    console.log(`error with ${error}`)
  }
  res.status(400).send(`Unable to get meal id`);
}

};



export const updateMeal = async (req: Request, res: Response) => {
  let id:string = req.params.id;
  try{
    const newData = req.body;

    if(!ObjectId.isValid(id)) {
      return res.status(400).send({error: 'Invalid user ID format.' });
    }

    const query = { _id: new ObjectId(id) };

    const result = await mealsCollection.updateOne(query, {$set : newData});

    if(result.matchedCount === 0){
      return res.status(404).send({error: 'User not found'});
    }

    return res.status(200).send({message: 'User updated successfully'});

  }catch (error) {
    if (error instanceof Error)
    {
     console.log(`issue with inserting ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to update user`);
}

 
};

export const deleteMeal = async (req: Request, res: Response) => { 
  
  let id:string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await mealsCollection.deleteOne(query);

    if (result && result.deletedCount) {
        res.status(202).json({message :`Successfully removed user with id ${id}`});
    } else if (!result) {
        res.status(400).json({message: `Failed to remove user with id ${id}`});
    } else if (!result.deletedCount) {
        res.status(404).json({message: `no user fround with id ${id}`});
    }
} catch (error) {
  if (error instanceof Error)
  {
   console.log(`issue with inserting ${error.message}`);
  }
  else{
    console.log(`error with ${error}`)
  }
  res.status(400).send(`Unable to delete user`);
}
function logMealDetails(meal: Meal): void {
  console.log(`Meal: ${meal.name}`);
  console.log(`Category: ${meal.category}`);
  console.log(`Ingredients: ${meal.ingredients.join(", ")}`);
  console.log(`Instructions: ${meal.instructions}`);
}
};

  // Fetch meals by first letter
export const getMealsByLetter = async (req: Request, res: Response) => {
  const { letter } = req.params;

  if(!letter || letter.length !==1 || !/^[a-zA-Z]$/.test(letter)) {
    res.status(400).json({error: "Please provide a single valid letter (a-z)."})
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


// Fetch random meal
export const getRandomMeal = async (_req: Request, res: Response) => {

  
  try {
    const response = await axios.get(`${BASE_URL}/random.php`);
    
    if(!response.data.meals || response.data.meals.length === 0){
      res.status(404).json({message: "No random meal found"});
      return;
    }
    
    const meal = response.data.meals[0];
    const mealId = meal.idMeal;

    res.status(200).json({ mealId, meal });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Log more specific error details if it's an Axios error
      console.error("Axios error fetching random meal:", error.response?.data || error.message);
      res.status(502).json({ error: "Error communicating with TheMealDB API." });
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

// Fetch meal categories
export const getMealCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`${BASE_URL}/categories.php`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching meal categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
