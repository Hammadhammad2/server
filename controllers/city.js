import City from "../models/city.js";
import { WENT_WRONG, CITY_DELETED, CITY_ALREADY_EXISTS } from "./constants.js";

export const addCity = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }

  try {
    async function insertCity(city) {
      const result = await City.create(city)
        .then((res) => {
          return true;
        })
        .catch((err) => {
          return false;
        });
    }

    async function checkCity(city) {
      console.log(city);
      return new Promise((resolve, reject) => {
        const old = City.findOne({
          placeId: city.placeId,
          userId: city.userId,
        });
        if (old) {
          //console.log(old);
          resolve(false);
        } else {
          reject(true);
        }
      });
    }

    if (Array.isArray(req.body)) {
      const cities = req.body;
      var notAddedCities = [];
      for (var i = 0; i < cities.length; i++) {
        checkCity(cities[i]).then((res) => {
          console.log(res);
          if (res) {
            insertCity(cities[i]);
          } else {
            notAddedCities.push(cities[i]);
          }
        });
      }
      console.log(notAddedCities);
      if (cities.length > 0) {
        res.status(200).json(notAddedCities);
      } else {
        res.status(200).json({ message: "All cities added" });
      }
    } else {
      if (insertCity(req.body)) {
        res.status(200).json({ message: "City Added" });
      } else {
        console.log(error);
        res.status(500).json({ message: WENT_WRONG });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: WENT_WRONG });
  }
};

export const showCity = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
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
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  try {
    await City.findByIdAndRemove(req.query.cityId);
    res.status(200).json({ message: CITY_DELETED });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: WENT_WRONG });
  }
};
