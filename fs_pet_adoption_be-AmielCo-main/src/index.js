import express from "express";
import "dotenv/config";
import logRoute from "./middlewares/logRoute.js";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import bodyParser from "body-parser";
import petsRoutes from "./routes/petsRoutes.js";
import HttpError from "./models/http-error.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(logRoute);
app.use(
  `/${process.env.UPLOAD_FOLDER}`,
  express.static(process.env.UPLOAD_FOLDER)
);
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT"
  );
  next();
});

app.use("/auth", authRoutes);
app.use("/pet", petsRoutes);
app.use("/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});



mongoose
  .connect(
    "mongodb+srv://amiel123:amiel123456789.@pet-app.qnx19.mongodb.net/PetAdoption?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(process.env.PORT, () => {});
    console.log(`Pet Adoption server is working on ${process.env.PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });
