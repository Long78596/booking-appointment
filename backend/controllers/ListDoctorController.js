import doctorModel from "../models/doctorModel"
import bcrypt from "bcrypt"
import jwr from "jsonwebtoken"
//API for doctor login
const loginDoctor = async (req, res) => {

    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials" })
        }
        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: json, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
export { loginDoctor }