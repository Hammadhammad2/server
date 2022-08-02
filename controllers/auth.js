import bcrypt from "bcryptjs";
import {
  USER_ALREADY_EXISTS,
  INVALID_PASSWORD,
  WENT_WRONG,
  CITY_ALREADY_EXISTS,
} from "./constants.js";
import User from "../models/user.js";

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
    const oldUser = await User.findOne({ email });

    //console.log(oldUser);

    if (!oldUser) {
      return res.status(400).json({ message: CITY_ALREADY_EXISTS });
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: INVALID_PASSWORD });
    }
    res.status(200).json(oldUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: WENT_WRONG });
  }
};
