'use strict'
import mongoose from "mongoose";

import app from "./app";
const PORT: number = process.env.RPPORT as unknown as number || 8080;
const HOST: string = process.env.RPHOST || "0.0.0.0";

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI!)
        .then(() => {
        	console.log("Conexión a la base de datos establecida satisfactoriamente...");

        app.listen(PORT, HOST, () => {
            console.log(`Server up n' running on port ${HOST}:${PORT}`)
        });

        })
        .catch(err => console.log(err));
