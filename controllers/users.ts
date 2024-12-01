import { Request, Response } from 'express';
import { usersCollection } from "../src/database";
import User from '../models/user'
import { ObjectId} from 'mongodb';
//import { ValidateUser } from '../models/user';
import Joi from 'joi';



export const getUsers =async  (req: Request, res: Response) => {
   
  try {
   const users = (await usersCollection.find({}).toArray()) as User[];
   res.status(200).json(users);

 } catch (error) {
  if (error instanceof Error)
  {
   console.log(`issue with inserting ${error.message}`);
  }
  else{
    console.log(`error with ${error}`)
  }
  res.status(400).send(`Unable to get user`);
}

};


export const getUserById = async (req: Request, res: Response) => {
  //get a single  user by ID from the database
  
  let id:string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const user = (await usersCollection.findOne(query)) as User;

    if (user) {
        res.status(200).send(user);
    }
} catch (error) {
  if (error instanceof Error)
  {
   console.log(`issue with inserting ${error.message}`);
  }
  else{
    console.log(`error with ${error}`)
  }
  res.status(400).send(`Unable to get user id`);
}

};


export const createUser = async (req: Request, res: Response) => {
  //create a new user in the database
  try {
    const newUser = req.body as User;

    const result = await usersCollection.insertOne(newUser)

    if (result) {
      res.status(201)
      .location(`${result.insertedId}`)
      .json({message : 
        `Created a new user with id ${result.insertedId}`
      })} else {
        res.status(500).send("Failed to create a new user");
      }
    }
    catch (error) {
      if (error instanceof Error)
      {
        console.log(`issue with inserting ${error.message}`);
      }
      else{
        console.log(`error with ${error}`)
      }
      res.status(400).send(`Unable to create new user`);
    }
};


export const updateUser = async (req: Request, res: Response) => {
  let id:string = req.params.id;
  try{
    const newData = req.body;

    const {name, email, phonenumber} = req.body;

    if(!ObjectId.isValid(id)) {
      return res.status(400).send({error: 'Invalid user ID format.' });
    }

    const query = { _id: new ObjectId(id) };

    const result = await usersCollection.updateOne(query, {$set : newData});

    if(result.matchedCount === 0){
      return res.status(404).send({error: 'User not found'});
    }

    return res.status(200).send({message: 'User updated successfully'});

  }catch (error) {
    if (error instanceof Error)
    {
     console.log(`issue with inserting ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to update user`);
}

 
};

export const deleteUser = async (req: Request, res: Response) => { 
  
  let id:string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);

    if (result && result.deletedCount) {
        res.status(202).json({message :`Successfully removed user with id ${id}`});
    } else if (!result) {
        res.status(400).json({message: `Failed to remove user with id ${id}`});
    } else if (!result.deletedCount) {
        res.status(404).json({message: `no user fround with id ${id}`});
    }
} catch (error) {
  if (error instanceof Error)
  {
   console.log(`issue with inserting ${error.message}`);
  }
  else{
    console.log(`error with ${error}`)
  }
  res.status(400).send(`Unable to delete user`);
}

// let validateResult : Joi.ValidationResult = ValidateUser(req.body)

//  if (validateResult.error) {
//    res.status(400).json(validateResult.error);
//    return;
//  }


};