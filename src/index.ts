import express, {Application, Request, Response} from "express" ;
import morgan from "morgan";
import userRoutes from '../routes/users';
import dotenv from "dotenv";
import cors from "cors";
import mealRoutes from '../routes/meals';

dotenv.config();

const PORT = process.env.PORT || 3001;

const app: Application = express();

app.use(morgan("tiny"));

app.use(express.json());

app.use(cors());

app.use('/api/v1/users', userRoutes)

app.use('/api/v1/meals', mealRoutes)


// app.post("/api/v1/meals/sample", (_req : Request, res: Response) => {
//     console.log("Request Body:", _req.body); // Log the incoming request body
//     if (!_req.body.name || !_req.body.category) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }
//     res.status(201).json({ message: "Meal created successfully", data: _req.body });
//   });
app.get("/ping", async (_req : Request, res: Response) => {
    res.send({
    message: "hello from Kian",
    });
});
// app.get('/bananas', async(_req : Request, res: Response) => {
//     res.send('hello world, this is bananas');
// });

 app.listen(PORT, () => {
    console.log("Server is running on port  --", PORT);
    });
