import { ObjectId } from "mongodb";

export default interface User {
    _id?: ObjectId;            
    firebaseId: string;            
    fname: string;                
    lname: string;                             
    allergies: { [key: string]: boolean };  
    favorites: string[];           
}