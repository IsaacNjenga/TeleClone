import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./router/routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
