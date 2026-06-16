import mongoose from "mongoose";
import dns from "dns";

dns.setServers(['8.8.8.8', '8.8.4.4']);

const DB_NAME = "resume-builder";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });

    let mongodbURI = process.env.MONGODB_URI;

    if (!mongodbURI) {
      throw new Error("MONGODB URI environment is ot set");
    }

    mongodbURI = mongodbURI.trim().replace(/^"|"$/g, "");

    const parsedURI = new URL(mongodbURI);
    parsedURI.pathname = "";

    if (!parsedURI.searchParams.has("retryWrites")) {
      parsedURI.searchParams.set("retryWrites", "true");
    }
    if (!parsedURI.searchParams.has("w")) {
      parsedURI.searchParams.set("w", "majority");
    }

    await mongoose.connect(parsedURI.toString(), { dbName: DB_NAME });
  } catch (error) {
    console.log("Error connecting to MONGODB:", error);
  }
};

export default connectDB;
