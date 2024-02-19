import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

// Middleware function to verify JWT token
function verifyToken(req: Request, res: Response, next: NextFunction) {
  // Get the JWT token from the request headers
  const token = req.headers["authorization"];

  // Check if token is provided
  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }
  
  console.log(token);
  console.log(process.env.JWT_SECRET_KEY);

  // Verify the token
  jwt.verify(
    token as string,
    process.env.JWT_SECRET_KEY as Secret,
    (err: any, decoded: any) => {
      if (err) {
        // console.log(err)
        return res
          .status(401)
          .json({ message: "Failed to authenticate token." });
      }

      // If token is valid, save the decoded token to the request object
      (req as any).decoded = decoded;
      next();
    }
  );
}

export default verifyToken;
