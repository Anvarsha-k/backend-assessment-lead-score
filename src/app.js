import express from "express";
import cors from "cors";
import * as offerController from "./controllers/offerController.js";
import * as leadController from "./controllers/leadController.js";

//essential initialisation

const app = express();
app.use(cors());
app.use(express.json());

//Routes fof the API
app.post("/offer", offerController.createOffer);
app.post("/leads/upload", leadController.uploadMiddleware, leadController.uploadLeads);
app.post("/score", leadController.scoreLeads);
app.get("/results", leadController.getResults);
app.get("/results/export", leadController.exportResultsToCSV);


export default app;
