import express from "express";
import authController from "../controllers/authController.js";
import { check } from "express-validator";

const router = express.Router();
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").not().isEmpty(),
  ],
  authController.login
);
router.post(
  "/signup",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("firstname").not().isEmpty(),
    check("lastname").not().isEmpty(),
    check("phonenumber").isInt(true),
  ],
  authController.signup
);

export default router;
