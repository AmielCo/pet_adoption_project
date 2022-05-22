import express from "express";
import petsController from "../controllers/petsController.js";
import { check } from "express-validator";
import multer from "multer";
import checkAuth from "../middlewares/check-auth.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
/* const uploads = multer({ dest: process.env.UPLOAD_FOLDER + "/" });
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "Pet-Adoption",
      allowed_formats: ["jpeg", "png", "jpg"],
      public_id: uuidv4(),
      access_type: "token",
    };
  },
});
const parser = multer({ storage: storage });
const router = express.Router();

router.post(
  "/",
  parser.single("image"),
  [
    check("type").not().isEmpty(),
    check("name").not().isEmpty(),
    check("status").not().isEmpty(),
    check("image").not().isEmpty(),
    check("height").isInt(true),
    check("weight").isInt(true),
    check("color").not().isEmpty(),
    check("bio").not().isEmpty(),
    check("hypoallergenic").not().isEmpty(),
    check("breed").not().isEmpty(),
  ],
  petsController.addPet
);

router.get("/", petsController.getPet);
router.get("/search", petsController.getPetByAttributes);
router.get("/:pid", petsController.getPetById);
router.get("/user/:uid", petsController.getPetsByUserId);
router.post("/:uid/save", checkAuth, petsController.savePet);
router.post("/:uid/adopt", checkAuth, petsController.ownAPet);

router.delete("/:uid/return", checkAuth, petsController.returnPet);

router.delete("/:uid/save", checkAuth, petsController.deleteSavedPet);
router.put("/:pid/update", checkAuth, petsController.updatePetData);
router.post(
  "/update/:pid",
  checkAuth,
  parser.single("image"),
  petsController.updatePetByAdmin
);

export default router;
