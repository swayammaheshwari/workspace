import client from "../config/redisConnect";

const connectToRedis = async (): Promise<void> => {
  try {
    client.on("connect", () => console.log("Connected to Redis"));

    await client.connect();

    client.on("error", (err: any) => console.log("Redis Client Error", err));
  } catch (error) {
    console.error("Error connecting to Redis", error);
  }
};

export default connectToRedis;
