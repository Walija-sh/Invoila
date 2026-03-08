import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB connected successfully");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      process.exit(1);
    });

  } catch (error) {
    console.error("Error connecting DB:", error.message);
    process.exit(1);
  }
};

export default connectDb;