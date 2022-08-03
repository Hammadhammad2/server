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
      await City.create(city)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
      return;
    }

    async function checkCity(city) {
      //yahan promise lga lete hain ??

      const old = await City.findOne({
        placeId: city.placeId,
        userId: city.userId,
      });

      if (old) {
        return false;
      } else {
        return true;
      }
    }

    if (Array.isArray(req.body)) {
      var notAddedCities = [];
      var cities = req.body;
      await Promise.all(
        cities.map(async (city) => {
          await checkCity(city).then((resp) => {
            if (resp) {
              insertCity(city);
            } else {
              notAddedCities.push(city);
            }
          });
        })
      );

      if (notAddedCities.length > 0) {
        res
          .status(200)
          .json({ notAddedCities, message: "Some Cities not added" });
      } else {
        res.status(200).json({ message: "All cities added" });
      }
    } else {
      const city = req.body;
      checkCity(city).then((resp) => {
        if (resp) {
          insertCity(city)
            .then((ress) => {
              res.status(200).json({ message: "City Added Successfully" });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ message: WENT_WRONG });
            });
        } else {
          res.status(400).json({ message: CITY_ALREADY_EXISTS });
        }
      });
    }
  } catch (err) {
    console.log(err);
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
