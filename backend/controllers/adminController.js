import validator from "validator";

import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js";

import jwt from "jsonwebtoken"

// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file; 

        
        //checking for all data to add doctor
       
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address ){
            return res.json({ success: false, message: "Missing Details " })
        }
        // validating email format
        // console.log("Email received:", email);
        if(!validator.isEmail(email)){
            return res.json({ success: false, message: "Please enter a valid email" })

        }
        //validating strong password
        if(password.length<8){
            return res.json({ success: false, message: "Please enter a strong password" })

        }
       //hasing doctor password 
       const salt = await bcrypt.genSalt(10)
       const hashedPassword= await bcrypt.hash(password,salt)
       
       //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl=imageUpload.secure_url
        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()

        }

        const newDoctor= new doctorModel(doctorData)
        //console.log(newDoctor);
        await newDoctor.save()
   

        res.json({ success: true, message: "Successfully" })



        
      
        
    } catch (error) {
        console.error("Error while adding doctor:", error);
        res.status(500).json({ success: false, message: "Not authorian login again" });
    }
};

const loginAdmin= async (req,res)=>{
     
    try {
        const { email, password } = req.body;
        //console.log(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD);
        // console.log("Env password:", process.env.ADMIN_PASSWORD);
       
       
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET);
            // console.log(token);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}
const allDoctors= async(req,res)=>{
    try{
        const doctors = await doctorModel.find({}).select("-password")
        //console.log(doctors);
        res.json({success:true,doctors})

    }catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }

};
const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;

       
        if (!docId) {
            return res.status(400).json({ success: false, message: "Missing doctor ID." });
        }

        const docData = await doctorModel.findById(docId);
        if (!docData) {
            return res.status(404).json({ success: false, message: "Doctor not found." });
        }

        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });

        res.json({ success: true, message: "Availability updated successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(["-password", "-email"]);
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to retrieve doctors." });
    }
};
export { addDoctor,loginAdmin,allDoctors,changeAvailability,doctorList };
