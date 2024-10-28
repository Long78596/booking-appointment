import jwt from "jsonwebtoken";

// user authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        const { dtoken } = req.headers;
        console.log("Received token:", dtoken);
        console.log(!dtoken)
        if (!dtoken) {
            return res.json({ success: false, message: "Not authorized login again" });
        }
        //console.log(!atoken)
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

        req.body.docId = token_decode.id
        //console.log(req.body.userId = token_decode.id)


        next();

    } catch (error) {
        console.log("Error in authAdmin middleware:", error);
        res.json({ success: false, message: error.message });
    }
};

export default authDoctor;
