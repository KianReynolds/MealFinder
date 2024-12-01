import { Request, Response } from 'express';

export const getUsers = (req: Request, res: Response) => {
    //to do: get all users from the database
  res.json({"message": "getUsers received"})
};

export const getUserById = (req: Request, res: Response) => {
  // get a single  user by ID from the database
  let id:string = req.params.id;
  res.json({"message": `get a user ${id} received`})
};

export const createUser = (req: Request, res: Response) => {
  // create a new user in the database

  console.log(req.body); //for now just log the data

  res.json({"message": `create a new user with data from the post message`})
};

export const updateUser = (req: Request, res: Response) => {
  
  console.log(req.body); //for now just log the data

  res.json({"message": `update user ${req.params.id} with data from the post message`})
};

export const deleteUser = (req: Request, res: Response) => {
  // logic to delete user by ID from the database

  res.json({"message": `delete user ${req.params.id} from the database`})
};
