import express from "express";
import { signup, login } from "../controllers/auth.js";
import { addCity, showCity, deleteCity } from "../controllers/city.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/SignUp", signup);
router.post("/Login", login);
router.post("/addCity", auth, addCity);
router.get("/ShowCity", auth, showCity);
router.delete("/deleteCity", auth, deleteCity);

export default router;
