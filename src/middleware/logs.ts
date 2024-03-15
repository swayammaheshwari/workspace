import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Middleware function to log routes
function routeLogger(req: Request, res: Response, next: NextFunction) {
    // Get current timestamp
    const timestamp = new Date().toISOString();

    // Extract route information
    const { method, url } = req;
    const logMessage = `${timestamp} - ${method} ${url}\n`;

    // Define the log file path
    const logFolderPath = path.join(process.cwd(), 'logs');
    const logFilePath = path.join(logFolderPath, 'routes.log');

    // Check if the logs folder exists, if not, create it
    if (!fs.existsSync(logFolderPath)) {
        fs.mkdirSync(logFolderPath);
    }

    // Log the route to a file
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to routes.log:', err);
        }
    });

    // Move to the next middleware
    next();
}

export default routeLogger;
