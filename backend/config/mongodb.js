import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/test`);
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Thoát ứng dụng nếu không thể kết nối
    }
};

export default connectDB;
