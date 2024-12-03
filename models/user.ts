import { ObjectId } from "mongodb";

export default interface User {
    id?: ObjectId;           
    fname: string;            
    lname: string;            
    email: string;           
    password: string;         
    allergies: string[];      
}