import type { Express } from "express";
import express from "express";
import { json } from "express";
import helmet from 'helmet';
import cors from 'cors';
import { authMiddleware } from "./middleware/authMiddleware";
import connectDB from "./model/mongo";
import router from "./routes/router";

const PORT: number = process.env.RPPORT as unknown as number || 8080;
const HOST: string = process.env.RPHOST || "0.0.0.0";

const app: Express = express();


app.use(cors({
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
app.use(helmet());
app.use(json());

connectDB();

app.use('/api', router)

app.listen(PORT, HOST, () => {
    console.log(`Server up n' running on port ${HOST}:${PORT}`)
});

