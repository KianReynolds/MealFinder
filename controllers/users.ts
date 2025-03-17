import { Request, Response } from 'express';
import { usersCollection } from "../src/database";
import { ObjectId } from 'mongodb';
import User from '../models/user'

export const createUser = async (req: Request, res: Response) => {
  // Create a new user and store user data (fname, lname, allergies, favorites)
  const { firebaseId, fname, lname, allergies, favorites } = req.body;

  // Basic validation (ensure required fields are provided)
  if (!firebaseId || !fname || !lname || !allergies || !favorites) {
    return res.status(400).send('Missing required fields');
  }

  const newUser: User = {
    firebaseId,
    fname,
    lname,
    allergies,
    favorites
  };

  try {
    // Insert the new user into the database
    const result = await usersCollection.insertOne(newUser);

    if (result) {
      res.status(201)
        .location(`${result.insertedId}`)
        .json({ message: `Created a new user with id ${result.insertedId}` });
    } else {
      res.status(500).send('Failed to create a new user');
    }
  } catch (error) {
    console.error(`Error creating user: ${error}`);
    res.status(400).send('Unable to create user');
  }
};
export const getUserByFirebaseId = async (req: Request, res: Response) => {
  
  const firebaseId = req.params.firebaseId;

  try {
    const query = { firebaseId }; 
    const user = await usersCollection.findOne(query);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(`Error retrieving user: ${error}`);
    res.status(400).send('Unable to retrieve user');
  }
};
