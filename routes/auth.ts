import express, { Request, Response } from "express";
import { usersCollection } from "../src/database";
import User from "../models/user";

const router = express.Router();

// Route to fetch user by firebaseId
router.get('/:firebaseId', async (req: Request, res: Response): Promise<void> => {
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
});
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    try {
        const { fname, lname, allergies, firebaseId } = req.body;

        // Validation: check if required fields are provided
        if (!fname || !lname || !firebaseId) {
            res.status(400).json({ message: 'All fields are required' });
            return;  
        }

        // Check if user with the same firebaseId already exists
        const existingUser = await usersCollection.findOne({ firebaseId });

        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return; 
        }

        // Create new user object for MongoDB
        const newUser: User = {
            firebaseId,
            fname,
            lname,
            allergies: allergies || {},  
            favorites: []  // Empty array for favorites on sign-up
        };

        const result = await usersCollection.insertOne(newUser);

        if (result.acknowledged) {
            res.status(201).json({ message: 'User registered successfully' });
        } else {
            res.status(500).json({ message: 'Failed to register user' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



export default router;
