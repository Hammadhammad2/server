import City from "../models/city.js";
import { WENT_WRONG, CITY_DELETED, CITY_ALREADY_EXISTS } from "./constants.js";

export const addCity = async (req, res) => {
  async function addCity(city) {
    console.log(city);
    try {
      const old = await City.findOne({
        placeId: city.placeId,
        userId: city.userId,
      });

      console.log(old);

      if (old) {
        return res.status(400).json({ message: CITY_ALREADY_EXISTS });
      }

      const result = await City.create(city);
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: WENT_WRONG });
    }
  }

  if (Array.isArray(req.body)) {
    for (var i = 0; i < req.body.length; i++) {
      addCity(req.body[i]);
    }
  } else {
    addCity(req.body);
  }
  // console.log(req.body.placeId);
};

export const showCity = async (req, res) => {
  try {
    const data = await City.find({ userId: req.query.userId });
    // console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: WENT_WRONG });
  }
};

export const deleteCity = async (req, res) => {
  try {
    await City.findByIdAndRemove(req.query.cityId);
    res.status(200).json({ message: CITY_DELETED });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: WENT_WRONG });
  }
};
