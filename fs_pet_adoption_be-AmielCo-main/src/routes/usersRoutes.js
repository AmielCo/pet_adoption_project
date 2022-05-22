import express from "express";
import usersController from "../controllers/usersController.js";
import { check } from "express-validator";
import checkAuth from "../middlewares/check-auth.js";

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:uid", usersController.getUserById);
router.put("/:uid", checkAuth, usersController.updateUser);

export default router;
