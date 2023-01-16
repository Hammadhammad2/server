import express from "express";
import cors from "cors";
import appRoutes from "./routes/routes.js";
import bodyParser from "body-parser";

import { dbConnection } from "./config/dbConnection.js";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/", appRoutes);


