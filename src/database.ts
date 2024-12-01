import { MongoClient, Db, Collection}  from "mongodb";
import  dotenv from "dotenv";
import User from '../models/user';


  dotenv.config();
  const connectionString : string  = process.env.DB_PASSWORD || "wordpass";
  const dbName : string = process.env.DB_USERNAME || "recipe_user";
  const client = new MongoClient(connectionString);

let db : Db 
  export let usersCollection : Collection<User>

  export const collections: { users?: Collection<User> } = {};

client.connect().then
(()=>
  {
  db = client.db(dbName);
  usersCollection  = db.collection('users');
  collections.users = usersCollection;
  console.log('Connected to database');
}
)
.catch ((error) => 
{
    if (error instanceof Error)
    {
     console.log(`issue with db connection ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
  });
