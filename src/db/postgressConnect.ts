import { Pool } from "pg";
import pool from "../config/pgPool";


const connectToPostgreSQL = async (): Promise<void> => {

  try {
    await pool.connect();
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
  }
};

export default connectToPostgreSQL;
