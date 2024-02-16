import pool from "../config/pgConnect";

const connectToPostgreSQL = async (): Promise<void> => {
  try {
    await pool.connect();
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
  }
};

export default connectToPostgreSQL;
