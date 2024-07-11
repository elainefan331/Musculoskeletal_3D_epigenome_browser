import express from "express";
import { PORT, db_URI } from "./config.js";
import mongoose from "mongoose";
import variantRouter from "./routes/variants.js";
import diseaseRouter from "./routes/diseases.js";
import geneRouter from "./routes/genes.js";
import gwasLDRouter from "./routes/gwasLD.js"
import cors from "cors";
import Api_category from "./models/api_category.js";
import GwasLD from "./models/gwasLD.js";
import VariantModel from "./models/variant.js";
// import path from "path"

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
// app.use('/public', express.static(path.join(__dirname, 'public')));


// routes
app.use("/variants", variantRouter);
app.use("/diseases", diseaseRouter);
app.use("/genes", geneRouter);
app.use("/gwasLD", gwasLDRouter);



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

        // Ensure indexes are created
        return VariantModel.init();
    })
    .then(() => {

        // Ensure indexes are created
        return GwasLD.init();
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

