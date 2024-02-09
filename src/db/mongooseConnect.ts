import { connect } from "mongoose";

const connectToMongoDB = async (): Promise<void> => {
  try {
    await connect(process.env.MONGOLAB_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectToMongoDB;
