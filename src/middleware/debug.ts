import { Request, Response, NextFunction } from "express";

function debugMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", req.headers.host);
  console.log("Query Params:", req.query);
  console.log("Body:", req.body);
  next();
}

export default debugMiddleware;
