import Pet from "../models/petModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error.js";


const addPet = async (req, res, next) => {
  let pet;
  try {
    pet = await Pet.create({
      ...req.body,
      image: req.file.path,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not add a pet.",
      500
    );
    return next(error);
  }
  if (!pet) {
    const error = new HttpError("Could not create a pet", 404);
    return next(error);
  }
  res.json({ petData: pet.toObject({ getters: true }) });
};

const updatePetByAdmin = async (req, res, next) => {
   const petId = req.params.pid;
  const pet  = await Pet.findById(petId);
try {
  if ("name" in req.body) pet.name = req.body.name;
  if ("type" in req.body) pet.type = req.body.type;
  if ("status" in req.body)
    pet.status = req.body.status;
  if ("color" in req.body) pet.color = req.body.color;
  if ("breed" in req.body) pet.breed = req.body.breed;
  if ("weight" in req.body) pet.weight = req.body.weight;
  if ("height" in req.body) pet.height = req.body.height;
  if ("hypoallergenic" in req.body)
    pet.hypoallergenic = req.body.hypoallergenic;
  if ("bio" in req.body) pet.bio = req.body.bio;
  if ("dietary" in req.body)
    pet.dietary = req.body.dietary;
  if (req.file) pet.image = req.file.path;
  await pet.save();
  res.status(200).json({
    status: "ok",
    message: "pet successfully updated",
  });
} catch (error) {
  res.status(500).json({ status: "error", message: error });
  }

};

const updatePetData = async (req, res, next) => {
  const petId = req.params.pid;

  /* const {
    name,
    type,
    status,
    height,
    weight,
    image,
    hypoallergenic,
    breed,
    dietary,
    color,
    bio,
  } = req.body;

    let updatedPet;
  try { */
  /*     updatedPet = await Pet.findById(petId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.1",
      500
    );
    return next(error);
  }

 
  updatedPet.name = name;
  updatedPet.type = type;
  updatedPet.status = status;
  updatedPet.height = height;
  updatedPet.weight = weight;
  updatedPet.image = image;
  updatedPet.hypoallergenic = hypoallergenic;
  updatedPet.breed = breed;
  updatedPet.dietary = dietary;
  updatedPet.color = color;
  updatedPet.bio = bio;
 */
  let updatedPet;
  try {
    updatedPet = await Pet.findByIdAndUpdate(
      req.params.pid,
      { ...req.body } /* updatedPet */,
      {
        new: true,
      }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update a pet.",
      500
    );
    return next(error);
  }
  if (!updatedPet) {
    const error = new HttpError("Could not update a pet", 404);
    return next(error);
  }
  res.status(200).json({
    pet: updatedPet.toObject({ getters: true }),
    message: "Pet has been updated",
  });
};

const savePet = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { _id } = req.body;

  const savedPet = new Pet({
    _id,
  });

  let user;
  let pet;
  try {
    user = await User.findById(req.params.uid);
    pet = await Pet.findById(savedPet._id);
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.1", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }
  if (!pet) {
    const error = new HttpError("Could not find pet for provided id", 404);
    return next(error);
  }
  try {
    user.pets.push(savedPet.id);
    await User.findByIdAndUpdate(req.params.uid, user, { new: true });
    /*     await Pet.findByIdAndUpdate(savedPet._id, pet, { new: true });
     */
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.2", 500);
    return next(error);
  }

  res.status(201).json({ pet: savedPet });
};

const ownAPet = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { _id } = req.body;
  

  const savedPet = new Pet({
    _id,
  });

  let user;
  let pet;
  try {
    user = await User.findById(req.params.uid);
    pet = await Pet.findById(savedPet._id);
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.1", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }
  if (!pet) {
    const error = new HttpError("Could not find pet for provided id", 404);
    return next(error);
  }
  try {
    pet.owned.push(req.params.uid);
/*     user.pets.push(savedPet.id);
 */    await User.findByIdAndUpdate(req.params.uid, user, { new: true });
    /*     await Pet.findByIdAndUpdate(savedPet._id, pet, { new: true });
     */
    await Pet.findByIdAndUpdate(savedPet.id, pet, { new: true });
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.2", 500);
    return next(error);
  }

  res.status(201).json({ pet: pet, user: user });
};






const getPetById = async (req, res, next) => {
  const petId = req.params.pid;
  let pet;
  try {
    pet = await Pet.findById(petId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a pet.",
      500
    );
    return next(error);
  }
  if (!pet) {
    const error = new HttpError(
      "Could not find a pet for the provided id.",
      404
    );
    return next(error);
  }
  res.json({ pet: pet.toObject({ getters: true }) });
};

const getPetsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPets;
  try {
    userWithPets = await User.findById(userId).populate("pets");
  } catch (err) {
    const error = new HttpError(
      "Fetching pets failed, please try again later",
      500
    );
    return next(error);
  }
  if (!userWithPets || userWithPets.pets.length === 0) {
    return next(
      new HttpError("Could not find any pet for the provided user id.", 404)
    );
  }
  res.json({
    pets: userWithPets.pets.map((pet) => pet.toObject({ getters: true })),
  });
};

const deleteSavedPet = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { _id } = req.body;

  const deletedPet = new Pet({
    _id,
  });

  let user;
  try {
    user = await User.findById(req.params.uid).populate("pets");
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.1", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }
  if (!deletedPet) {
    const error = new HttpError("Could not find pet for provided id", 404);
    return next(error);
  }
  try {
    user.pets.pull(deletedPet.id);
    await User.findByIdAndUpdate(req.params.uid, user, { new: true });
    /*     await Pet.findByIdAndUpdate(savedPet._id, pet, { new: true });
     */
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.2", 500);
    return next(error);
  }

  res.status(201).json({ deletedPet: deletedPet });
};

const returnPet = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { _id } = req.body;

  const deletedPet = new Pet({
    _id,
  });

  let user;
  let pet;
  try {
    user = await User.findById(req.params.uid).populate("pets");
    pet = await Pet.findById(deletedPet._id).populate("owned");
 
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.1", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }
  if (!deletedPet) {
    const error = new HttpError("Could not find pet for provided id", 404);
    return next(error);
  }
  try {
    user.pets.pull(deletedPet.id);
    pet.owned.pull(req.params.uid);
    await User.findByIdAndUpdate(req.params.uid, user, { new: true });
    await Pet.findByIdAndUpdate(deletedPet.id, pet, { new: true });
    /*     await Pet.findByIdAndUpdate(savedPet._id, pet, { new: true });
     */
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.2", 500);
    return next(error);
  }

  res.status(201).json({ deletedPet: deletedPet, user: user, message: "Pet returned" });
};

const getPet = async (req, res, next) => {
  let pets;
  try {
    pets = await Pet.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching pets failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ pets: pets.map((pet) => pet.toObject({ getters: true })) });
};

const getPetByAttributes = async (req, res, next) => {
  const { type, name, status, height, weight } = req.query;

  let pets;
  try {
    for (let key in req.query) {
      if (req.query[key] === "") {
        delete req.query[key];
      }
    }
    pets = await Pet.find(req.query);

  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Fetching pets failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    pets: pets.map((pet) => pet.toObject({ getters: true })),
    count: pets.length,
  });
};

export default {
  addPet,
  getPetById,
  getPetsByUserId,
  deleteSavedPet,
  getPet,
  savePet,
  getPetByAttributes,
  updatePetData,
  ownAPet,
  returnPet,
  updatePetByAdmin
};
