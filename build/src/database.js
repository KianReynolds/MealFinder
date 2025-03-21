"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collections = exports.mealsCollection = exports.usersCollection = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Use values from the .env file for connection string and database name
const connectionString = process.env.DB_CONN_STRING || "";
const dbName = process.env.DB_NAME || "300user"; // Default to "300user" if not set in the .env file
// Check if the connection string is valid
if (!connectionString) {
    throw new Error("DB_CONN_STRING is not defined in the environment variables.");
}
const client = new mongodb_1.MongoClient(connectionString);
let db;
exports.collections = {};
// Connect to MongoDB
client.connect().then(() => {
    db = client.db(dbName); // Use the database name from the .env file
    exports.usersCollection = db.collection('users');
    exports.collections.users = exports.usersCollection;
    exports.mealsCollection = db.collection('meals');
    console.log('Connected to database');
}).catch((error) => {
    if (error instanceof Error) {
        console.log(`Issue with DB connection: ${error.message}`);
    }
    else {
        console.log(`Error: ${error}`);
    }
});
