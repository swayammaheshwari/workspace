import { set, connect } from "mongoose";

const connectToMongoDB = async () => {
  try {
    await connect(process.env.MONGOLAB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectToMongoDB;
