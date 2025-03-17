import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";
import User from '../models/user';
import { Meal } from "../models/meal";

// Load environment variables from .env file
dotenv.config();

// Use values from the .env file for connection string and database name
const connectionString: string = process.env.DB_CONN_STRING || "";
const dbName: string = process.env.DB_NAME || "300user";  // Default to "300user" if not set in the .env file

// Check if the connection string is valid
if (!connectionString) {
  throw new Error("DB_CONN_STRING is not defined in the environment variables.");
}

const client = new MongoClient(connectionString);

let db: Db;
export let usersCollection: Collection<User>;
export let mealsCollection: Collection<Meal>;

export const collections: { users?: Collection<User> } = {};

// Connect to MongoDB
client.connect().then(() => {
  db = client.db(dbName);  // Use the database name from the .env file
  usersCollection = db.collection('users');
  collections.users = usersCollection;

  mealsCollection = db.collection('meals');
  console.log('Connected to database');
}).catch((error) => {
  if (error instanceof Error) {
    console.log(`Issue with DB connection: ${error.message}`);
  } else {
    console.log(`Error: ${error}`);
  }
});

