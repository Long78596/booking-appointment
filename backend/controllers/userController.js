import validator from "validator"
import bcrypt from "bcrypt"
import userModel from "../models/userModel.js"
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary"
import razorpay from "razorpay"
import Razorpay from "razorpay"
//API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong password" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const uesrData = {
            name,
            email,
            password: hashedPassword

        }
        const newUser = new userModel(uesrData)
        const user = await newUser.save();
        // _id
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "user  does not exists" })

        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: true, message: " Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}
//Api to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const userData = await userModel.findById(userId).select("-password");


        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // console.log(userData);
        return res.json({ success: true, userData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file
        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data missing" })
        }
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
        if (imageFile) {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId, { image: imageUrl })

        }
        res.json({ success: true, message: "Profile Upload" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
//API  to book appoinement
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select("-password")
        if (!docData.available) {
            return res.json({ success: false, message: "Doctor not available" })
        }
        let slots_booked = docData.slots_booked
        //checking for slot availablity
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot not avaliable" })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")
        delete docData.slots_booked
        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()

        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()
        //save new slots data in docData

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: "Appointment book" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to get user appointments for frontend my-appoinemnts page
const listAppointment = async(req,res)=>{
    try{
        const {userId}=req.body
        const appointments = await appointmentModel.find({userId})
        console.log(appointments)
        res.json({success:true,appointments})

    }catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}
 //API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        // appointmentData.cancelled = true; // Chuyển trạng thái thành true
        // await appointmentData.save(); 
        // console.log(appointmentData.save())

        res.json({ success: true, message: "Appointment cancelled" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



//API for doctor login
const loginDoctor = async (req, res) => {

    try {
        const { email, password } = req.body
        // console.log(email,password)
        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials" })
        }
        console.log(!doctor)
        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
//API to get doctor appointments for doctor panel
const appointmentsDoctor= async(req,res)=>{
    try{
        const {docId}=req.body
        const appointments=  await appointmentModel.find({docId})
        //  console.log(appointments)
        res.json({success:true,appointments})
      
    }catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//API to mark  appoitments completed for doctor panel
const appointmentComplete=async(req,res)=>{
    try{
        const {docId,appointmentId}=req.body
        // console.log(docId,appointmentId)
        const appointmentData=await  appointmentModel.findById(appointmentId)
        //  console.log(appointmentData)
        // console.log(appointmentData && appointmentData.docId === docId)

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted:true})
            return res.json({ success: true, message: "Appointment Completed" })
     
        }else{
            return res.json({ success: false, message: "Mark falied" })
        }
    }catch(error){
     console.log(error)
    }
}
//API to cancel   appoitments  doctor panel
const appointmentCancel = async (req,res) => {
    try {
        const { docId, appointmentId } = req.body
        const appointmentData = appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: "Appointment Cancelled" })

        } else {
            return res.json({ success: false, message: "Cancelled falied" })
        }
    } catch (error) {
        console.log(error)
    }
}

//API to get dashboard data for doctor panel 
const doctorDashboard= async(req,res)=>{
    try{
        const {docId}=req.body
        const appointments=await appointmentModel.find({docId})
        let earnings=0
        appointments.map((item)=>{
            if(item.isCompleted || item.payment ){
                earnings +=item.amount
            }

        })
        let patients= []

        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }

        })
        const dashData={
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointment:appointments.reverse().slice(0,5)

        }
        res.json({success:true,dashData})


    }catch(error){
        console.log(error)

    }
}
const doctorfrofile=async(req,res)=>{
    try{
        const {docId}=req.body
        const profileData = await doctorModel.findById(docId).select("-password")
        res.json({success:true,profileData})

    }catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }

}

//API  to update doctor profilr data from Doctor Panel
const updateDoctorProfile =async(req,res)=>{
    try{
        const {docId,fees,address,available}=req.body
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({ success: true, message: "Profile update" })
    }catch(error){
        console.log(error)

    }
}




export { registerUser, loginUser, getProfile, updateProfile,bookAppointment,listAppointment,cancelAppointment,loginDoctor,appointmentsDoctor,appointmentCancel,appointmentComplete,doctorDashboard,doctorfrofile,updateDoctorProfile }