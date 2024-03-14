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

    // Log the route to a file
    const logFilePath = ( 'logs/routes.log');
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to routes.log:', err);
        }
    });

    // Move to the next middleware
    next();
}

export default routeLogger;
