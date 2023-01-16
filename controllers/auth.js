import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  USER_ALREADY_EXISTS,
  INVALID_PASSWORD,
  WENT_WRONG,
  USER_NOT_EXISTS,
} from "./constants.js";
import User from "../models/user.js";

const secret = "test";

export const signup = (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(req.body);
      const { name, email, phoneno, password, confirmpassword } = req.body;
      console.log(password);

      const oldUser = await User.findOne({ email: email });
      console.log(oldUser);
      if (oldUser) {
        return reject(res.status(400).json({ message: USER_ALREADY_EXISTS }));
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      console.log(hashedPassword);

      const result = await User.create({
        name,
        email,
        phoneno,
        password: hashedPassword,
      });

      console.log(result);
      return resolve(res.status(200).json(result));
    } catch (error) {
      console.log(error);
      return reject(res.status(500).json({ message: WENT_WRONG }));
    }
  });
};

export const login = (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = req.body;
      console.log(email);
      const user = await User.findOne({ email });
      console.log(user);

      if (!user) {
        return reject(res.status(400).json({ message: USER_NOT_EXISTS }));
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return reject(res.status(400).json({ message: INVALID_PASSWORD }));
      }
      const token = jwt.sign({ email: user.email, id: user._id }, secret, {
        expiresIn: "2h",
      });

      return resolve(res.status(200).json({ user, token }));
    } catch (error) {
      console.log(error);
      return reject(res.status(500).json({ message: WENT_WRONG }));
    }
  });
};
