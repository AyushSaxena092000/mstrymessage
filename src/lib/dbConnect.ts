import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    if (mongoose.connections.length > 0) {
      connection.isConnected = mongoose.connections[0].readyState;

      if (connection.isConnected === 1) {
        console.log("Using existing connection");
        return;
      }
      await mongoose.disconnect();
    }

    console.log("Connecting to database:", process.env.MONGODB_URI); // Log the URI for debugging
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Successfully to", db.connection.name); // Log the name of the database
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}

export default dbConnect;
