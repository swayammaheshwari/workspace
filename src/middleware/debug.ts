import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// Middleware function to log routes
export default function debugMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Get current timestamp
  const timestamp = new Date().toISOString();

  // Extract route information
  const { method, url, headers, query, body } = req;
  const logMessage = `${timestamp}
     Method: ${method},
     URL: ${url},
     Headers: ${JSON.stringify(headers)},
     Query Params: ${JSON.stringify(query)},
     Body: ${JSON.stringify(body)}
     \n`;

  // Define the log file path
  const logFolderPath = path.join(process.cwd(), "logs");
  const logFilePath = path.join(logFolderPath, "route.data.log");

  // Check if the logs folder exists, if not, create it
  if (!fs.existsSync(logFolderPath)) {
    fs.mkdirSync(logFolderPath);
  }

  // Log the route data to a file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to route.data.log:", err);
    }
  });

  // Move to the next middleware
  next();
}
