import { ObjectId } from "mongodb";

export interface Meal {
    id?: ObjectId;
    name: string;
    category: string;
    instructions: string;
    ingredients: string[];
  }
  