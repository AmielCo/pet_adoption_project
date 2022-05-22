import User from "../models/userModel.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import HttpError from "../models/http-error.js";

/* const maxAge = 60 * 60 * 24;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAge,
  });
}; */
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { email, password, firstname, lastname, phonenumber } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    firstname,
    lastname,
    email,
    phonenumber,
    image:
      "https://www.istockphoto.com/photo/businessman-silhouette-as-avatar-or-default-profile-picture-gm476085198-64396363?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Favatar&utm_term=avatar%3A%3Asearch-explore-top-affiliate-outside-feed-x-v2%3Ab",
    password: hashedPassword,
    pets: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

async function login(req, res, next) {
  const { email, password } = req.body;

  let existingUser;
  
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
      );
      return next(error);
    }
    
    if (!existingUser) {
      const error = new HttpError("Invalid credentials, could not log in.1", 401);
      return next(error);
    }
    
    
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials, could not log in.2", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again.", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    isAdmin: existingUser.isAdmin,
  });
}

/* const adminLogin = async (req, res, next) => {
  const { password } = req.body;
  let admin;
  try {
    admin = await User.findOne({ isAdmin: true });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!admin) {
    const error = new HttpError(
      "Invalid credentials, could not log in.",
      401
    );
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, admin.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }
  let token;
  if (isValidPassword) {
    try {
      token = jwt.sign(
        { userId: admin.id, email: admin.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new HttpError("Logging in failed, please try again.", 500);
      return next(error);
    }
  } else {
    const error = new HttpError("Invalid credentials, could not log in.", 401);
    return next(error);
  }
  res.json({
    adminId: admin.id,
    email: admin.email,
    token: token,
  });
}; */

export default { signup, login };
