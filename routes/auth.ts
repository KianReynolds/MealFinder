import express, { Request, Response } from "express";
import { usersCollection } from "../src/database"
import User from "../models/user";

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { fname, lname, email, password, allergies } = req.body;

        // validaiton on backend even though the fields are all required on frontend
        if (!fname || !lname || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;  
        }

        // seeing if user exists
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return; 
        }

        
        const newUser: User = {
            fname,
            lname,
            email,
            password,  // password is not encrypted/hashed need to return and fix this after inteirm
            allergies: allergies || [],  
        };

        // add user to db
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