import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

// Middleware function to verify JWT token
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  // Get the JWT token from the request headers
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

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

export function generateToken(req: any, res: Response, next: NextFunction) {
  const { name, email } = req.body;

  // Check if name and email are provided
  if (!name || !email) {
    return res.status(400).json({
      message: "Both name and email are required to generate a token.",
    });
  }

  try {
    // Create the token with name and email
    const token = jwt.sign(
      { name, email },
      process.env.JWT_SECRET_KEY as Secret,
      { expiresIn: "1h" }
    );

    // Attach the generated token to the request object
    req.generatedToken = token;

    // Move to the next middleware/route handler
    next();
  } catch (error) {
    // Handle any errors that occur during token generation
    console.error("Error generating token:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
