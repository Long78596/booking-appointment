import express from "express";
import { addDoctor } from "../controllers/adminController.js"; 
import upload from "../middlewares/multer.js";

const adminRoutes = express.Router();

adminRoutes.post("/add-doctor", upload.single("image"), addDoctor);

export default adminRoutes;
