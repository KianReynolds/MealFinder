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
const express_1 = __importDefault(require("express"));
const database_1 = require("../src/database");
const router = express_1.default.Router();
// Route to fetch user by firebaseId
router.get('/:firebaseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firebaseId = req.params.firebaseId;
    try {
        const query = { firebaseId };
        const user = yield database_1.usersCollection.findOne(query);
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).send('User not found');
        }
    }
    catch (error) {
        console.error(`Error retrieving user: ${error}`);
        res.status(400).send('Unable to retrieve user');
    }
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fname, lname, allergies, firebaseId } = req.body;
        // Validation: check if required fields are provided
        if (!fname || !lname || !firebaseId) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        // Check if user with the same firebaseId already exists
        const existingUser = yield database_1.usersCollection.findOne({ firebaseId });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Create new user object for MongoDB
        const newUser = {
            firebaseId,
            fname,
            lname,
            allergies: allergies || {},
            favorites: [] // Empty array for favorites on sign-up
        };
        const result = yield database_1.usersCollection.insertOne(newUser);
        if (result.acknowledged) {
            res.status(201).json({ message: 'User registered successfully' });
        }
        else {
            res.status(500).json({ message: 'Failed to register user' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
