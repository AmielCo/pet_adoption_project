import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";

const getUserById = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.uid);
    res.status(200).json({
      status: "ok",
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Couldn't get user",
    });
    return next(error);
  }
};

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { firstname, lastname, email, bio, phonenumber, password } = req.body;
  const userId = req.params.uid;

  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.1",
      500
    );
    return next(error);
  }

  if (userId !== req.userData.userId) {
    const error = new HttpError(
      "You are not allow to update these settings.",
      401
    );
    return next(error);
  }

  let hashedPassword;
  if (user.password !== password) {
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
    }
  } else {
    user.password = password;
  }

  user.firstname = firstname;
  user.lastname = lastname;
  user.email = email;
  user.bio = bio;
  user.phonenumber = phonenumber;
  user.password = hashedPassword ? hashedPassword : password;

  try {
    await User.findByIdAndUpdate(req.params.uid, user, { new: true });


     /*  await user.save(); */
     
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    user: user.toObject({ getters: true }),
    message: "User has been updated",
  });

};

export default { getUsers, getUserById, updateUser };
