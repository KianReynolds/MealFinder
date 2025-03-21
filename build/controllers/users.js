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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByFirebaseId = exports.createUser = void 0;
const database_1 = require("../src/database");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a new user and store user data (fname, lname, allergies, favorites)
    const { firebaseId, fname, lname, allergies, favorites } = req.body;
    // Basic validation (ensure required fields are provided)
    if (!firebaseId || !fname || !lname || !allergies || !favorites) {
        return res.status(400).send('Missing required fields');
    }
    const newUser = {
        firebaseId,
        fname,
        lname,
        allergies,
        favorites
    };
    try {
        // Insert the new user into the database
        const result = yield database_1.usersCollection.insertOne(newUser);
        if (result) {
            res.status(201)
                .location(`${result.insertedId}`)
                .json({ message: `Created a new user with id ${result.insertedId}` });
        }
        else {
            res.status(500).send('Failed to create a new user');
        }
    }
    catch (error) {
        console.error(`Error creating user: ${error}`);
        res.status(400).send('Unable to create user');
    }
});
exports.createUser = createUser;
const getUserByFirebaseId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.getUserByFirebaseId = getUserByFirebaseId;
