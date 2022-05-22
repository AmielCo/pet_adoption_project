import HttpError from "../models/http-error.js";
import jwt from "jsonwebtoken";

export default function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 401);
    return next(error);
  }
}
