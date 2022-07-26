import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  id: String,
  name: String,
  email: String,
  phoneno: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);
export default User;
