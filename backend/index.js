import express from "express";
import { PORT, db_URI } from "./config.js";
import mongoose from "mongoose";
import variantRouter from "./routes/variants.js";
import cors from "cors";

const app = express();

app.use(cors());
// routes
app.use("/variants", variantRouter);

// app.get("/", (req, res) => {
//     console.log(req)
//     return res.status(234).send("welcome to mern stack")
// })

// connect app to mongoDB database
mongoose
    .connect(db_URI)
    .then(() => {
        console.log("App connected to database");
        app.listen(PORT, () => {
            console.log(`APP is listening to port: ${PORT}`)
        });
    })
    .catch((error) => {
        console.log(error);
    });

