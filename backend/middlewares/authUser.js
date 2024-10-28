import jwt from "jsonwebtoken";

// user authentication middleware
const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        console.log("Received token:", token);
         console.log(!token)
        if (!token) {
            return res.json({ success: false, message: "Not authorized login again" });
        }
        //console.log(!atoken)
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
         req.body.userId=token_decode.id
        //console.log(req.body.userId = token_decode.id)


        next();

    } catch (error) {
        console.log("Error in authAdmin middleware:", error); 
        res.json({ success: false, message: error.message });
    }
};

export default authUser;
