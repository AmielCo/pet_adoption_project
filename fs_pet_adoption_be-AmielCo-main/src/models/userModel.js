import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
    isAdmin: { type: Boolean, default: false, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phonenumber: { type: Number, required: true },
    bio: { type: String, required: false },
    pets: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Pet",
      },
    ],
  },
  {
    collection: "users",
  }
);

userSchema.plugin(uniqueValidator);

/* UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
 */

export default mongoose.model("User", userSchema);
