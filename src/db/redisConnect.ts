// redisConfig.ts

// import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const connectToRedis = async (): Promise<void> => {
    try {
        console.log("Connected to Redis");
      } catch (error) {
        console.error("Error connecting to Redis", error);
      }
};

export default connectToRedis;
