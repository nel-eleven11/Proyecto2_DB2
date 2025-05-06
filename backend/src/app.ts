import type { Express } from "express";
import express from "express";
import { json } from "express";
import helmet from 'helmet';
import cors from 'cors';
import router from "./routes/router";

const app: Express = express();


app.use(cors({
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
app.use(helmet());
app.use(json());

app.use('/api', router)

export default app;
