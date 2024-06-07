import express from "express";
import { PORT, db_URI } from "./config.js";
import mongoose from "mongoose";
import variantRouter from "./routes/variants.js";
import diseaseRouter from "./routes/diseases.js";
import geneRouter from "./routes/genes.js";
import cors from "cors";
import Api_category from "./models/api_category.js";

const app = express();

app.use(cors());
app.use(express.json());
// routes
app.use("/variants", variantRouter);
app.use("/diseases", diseaseRouter);
app.use("/genes", geneRouter);

// app.get("/", (req, res) => {
//     console.log(req)
//     return res.status(234).send("welcome to mern stack")
// })

// connect app to mongoDB database
// mongoose
//     .connect(db_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true 
//     })
//     .then(() => {
//         console.log("App connected to database");
//         app.listen(PORT, () => {
//             console.log(`APP is listening to port: ${PORT}`)
//         });
//     })
//     .catch((error) => {
//         console.log(error);
//     });
mongoose
    .connect(db_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    })
    .then(() => {
        console.log("App connected to database");

        // Ensure indexes are created
        return Api_category.init();
    })
    .then(() => {
        console.log("Indexes ensured");

        // Start the app
        app.listen(PORT, () => {
            console.log(`APP is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(error);
    });

