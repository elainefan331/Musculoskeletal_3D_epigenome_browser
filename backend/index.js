import express from "express";
import { PORT, db_URI, NODE_ENV, FRONTEND_URL } from "./config.js";
import mongoose from "mongoose";
import variantRouter from "./routes/variants.js";
import diseaseRouter from "./routes/diseases.js";
import geneRouter from "./routes/genes.js";
import gwasLDRouter from "./routes/gwasLD.js";
import cors from "cors";
import Api_category from "./models/api_category.js";
import GwasLD from "./models/gwasLD.js";
import VariantModel from "./models/variant.js";
import geneModel from "./models/gene.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
// import https from 'https';
// import http from 'http';
// import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL, // frontend public IP
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use("/public", express.static(path.join(__dirname, "../frontend/public")));

// test the connection between frontend and backend
app.get("/health", (req, res) => {
  res.send("Backend is running.");
});

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
    useUnifiedTopology: true,
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
    // Ensure indexes are created
    return geneModel.init();
  })
  .then(() => {
    console.log("Indexes ensured");

    // Start the app
    app.listen(PORT, () => {
      console.log(`APP is listening to port: ${PORT}`);
    });
    //    const sslOptions = {
    //	key: fs.readFileSync('/home/techelainefan/ssl/hsl_wildcard.key'),
    //	cert: fs.readFileSync('/home/techelainefan/ssl/hsl_wildcard.crt')
    //    };

    //   https.createServer(sslOptions, app).listen(PORT, () => {
    //   	console.log(`🚀 HTTPS server is listening on port ${PORT}`);
    //   });
  })
  .catch((error) => {
    console.error(error);
  });
