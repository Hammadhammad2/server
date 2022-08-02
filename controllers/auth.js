import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  USER_ALREADY_EXISTS,
  INVALID_PASSWORD,
  WENT_WRONG,
  CITY_ALREADY_EXISTS,
} from "./constants.js";
import User from "../models/user.js";

const secret = "test";

export const signup = (req, res) => {
  return new Promise((resolve, reject) => {
    const { name, email, phoneno, password, confirmpassword } = req.body;
    try {
      const oldUser = User.findOne({ email });

      if (oldUser) {
        resolve(res.status(400).json({ message: USER_ALREADY_EXISTS }));
      }

      if (password !== confirmpassword) {
        resolve(res.status(400).json({ message: INVALID_PASSWORD }));
      }

      const hashedPassword = bcrypt.hash(password, 12);

      const result = User.create({
        name,
        email,
        phoneno,
        password: hashedPassword,
      });

      console.log(result);
      resolve(res.status(201).json(result));
    } catch (error) {
      console.log(error);
      reject(res.status(500).json({ message: WENT_WRONG }));
    }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    //console.log(oldUser);

    if (!user) {
      return res.status(400).json({ message: CITY_ALREADY_EXISTS });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: INVALID_PASSWORD });
    }
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "2h",
    });

    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: WENT_WRONG });
  }
};
