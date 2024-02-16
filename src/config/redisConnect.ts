import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient();

// Handle connection errors
client.on("error", function (err: any) {
  console.error("Error connecting to Redis:", err);
});

// Export the client instance
export default client;
