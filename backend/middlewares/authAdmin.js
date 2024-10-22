import jwt from "jsonwebtoken";

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;

        if (!atoken) {
            return res.json({ success: false, message: "Not authorized login again" });
        }
         
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        // console.log(!atoken)
        // console.log(token_decode.email.trim() !== process.env.ADMIN_EMAIL.trim())
        
        if (token_decode.email.trim() !== process.env.ADMIN_EMAIL.trim()) {
            return res.json({ success: false, message: "Not authorized login again" });
        }

        
        next();

    } catch (error) {
        console.log("Error in authAdmin middleware:", error); // Ghi log lỗi
        res.json({ success: false, message: error.message });
    }
};

export default authAdmin;
