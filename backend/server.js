import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import adminRoutes from "./routes/adminRoutes.js"

//app config
const app=express()
const port =process.env.PORT || 4000
connectDB()
connectCloudinary()


//middleware
app.use(express.json())
app.use(cors())

//api endpoints

 app.use("/api/admin",adminRoutes)

app.get("/",(req,res)=>{
    res.send("API/WORKING")

})
app.listen(port, ()=>{
    console.log("Server started",port);
})