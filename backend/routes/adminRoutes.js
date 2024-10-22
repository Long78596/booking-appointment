import express from "express";
import { addDoctor,allDoctors,changeAvailability,doctorList,loginAdmin } from "../controllers/adminController.js"; 
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRoutes = express.Router();

adminRoutes.post("/add-doctor",authAdmin, upload.single("image"), addDoctor);
adminRoutes.post("/login", loginAdmin);
adminRoutes.post("/all-doctors",authAdmin, allDoctors);
adminRoutes.post("/change-availability", authAdmin, changeAvailability)
adminRoutes.get("/list", doctorList)
export default adminRoutes;
