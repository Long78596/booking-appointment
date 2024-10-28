import express from "express"

import { appointmentCancel, appointmentComplete, appointmentsDoctor, bookAppointment, cancelAppointment, doctorDashboard, doctorfrofile, getProfile, listAppointment, loginDoctor, loginUser, registerUser, updateDoctorProfile, updateProfile } from "../controllers/userController.js"
import authUser from "../middlewares/authUser.js"
import upload from "../middlewares/multer.js"
import authDoctor from "../middlewares/authDoctor.js"
const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update", upload.single("image"), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/list-appointments", authUser, listAppointment)
userRouter.post("/cancel-appointments", authUser, cancelAppointment)


userRouter.post("/doctor-login", loginDoctor)
userRouter.get("/get", authDoctor, appointmentsDoctor)
userRouter.post("/complete-appointment", authDoctor,appointmentComplete)
userRouter.post("/cancel-appointment", authDoctor, appointmentCancel)
userRouter.get("/ds", authDoctor, doctorDashboard)
userRouter.get("/doctor-profile", authDoctor, doctorfrofile)
userRouter.post("/update-profile", authDoctor, updateDoctorProfile)





export default userRouter
