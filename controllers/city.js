import City from "../models/city.js";
import {
  WENT_WRONG,
  CITY_DELETED,
  CITY_ALREADY_EXISTS,
  CITY_CREATED,
} from "./constants.js";

export const addCity = (req, res) => {
  return new Promise(async (resolve, reject) => {
    if (!req.authenticationId) {
      return res.json({
        message: "Your are not authorized to perform this action",
      });
    }
    const { placeId, _id } = req.body;
    console.log(req.body);

    try {
      const old = await City.findOne({
        placeId: placeId,
        userId: _id,
      });

      if (old) {
        return reject(res.status(500).json({ message: CITY_ALREADY_EXISTS }));
      } else {
        const result = await City.create(req.body);
        return resolve(res.status(200).json({ message: CITY_CREATED }));
      }
    } catch (error) {
      console.log(error);
      return reject(res.status(500).json({ message: WENT_WRONG }));
    }
  });
};

export const showCity = (req, res) => {
  return new Promise(async (resolve, reject) => {
    if (!req.authenticationId) {
      return reject(
        res.json({
          message: "Your are not authorized to perform this action",
        })
      );
    }

    try {
      const data = await City.find({ userId: req.query.userId });
      // console.log(data);
      return resolve(res.status(200).json(data));
    } catch (error) {
      console.log(error);
      return reject(res.status(500).json({ message: WENT_WRONG }));
    }
  });
};

export const deleteCity = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    if (!req.authenticationId) {
      return reject(
        res.json({
          message: "Your are not authorized to perform this action",
        })
      );
    }

    await City.findByIdAndRemove(req.query.cityId);
    try {
      return resolve(res.status(200).json({ message: CITY_DELETED }));
    } catch (error) {
      console.log(error);
      return reject(res.status(500).json({ message: WENT_WRONG }));
    }
  });
};
