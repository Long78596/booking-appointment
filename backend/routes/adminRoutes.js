import express from "express";
import { addDoctor,adminDashboard,allDoctors,appointmentAdmin,appointmentCancel,changeAvailability,doctorList,loginAdmin } from "../controllers/adminController.js"; 
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRoutes = express.Router();

adminRoutes.post("/add-doctor",authAdmin, upload.single("image"), addDoctor);
adminRoutes.post("/login", loginAdmin);
adminRoutes.post("/all-doctors",authAdmin, allDoctors);
adminRoutes.post("/change-availability", authAdmin, changeAvailability)
adminRoutes.get("/list", doctorList)
adminRoutes.get("/appointments", authAdmin, appointmentAdmin)
adminRoutes.post("/cancel-appointments", authAdmin, appointmentCancel)
adminRoutes.get("/list-dash", authAdmin, adminDashboard)
export default adminRoutes;
