import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    image: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    color: { type: String, required: true },
    bio: { type: String, required: true },
    hypoallergenic: { type: String, required: true },
    dietary: { type: String, required: true },
    breed: { type: String, required: true },
    owned: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
  },
  { collection: "pets" }
);

export default mongoose.model("Pet", petSchema);
