import mongoose from "mongoose";

export const dbConnection = (app) => {
  mongoose
    .connect(
      "mongodb+srv://Hammad:Hammadhammad1@cluster0.wa042.mongodb.net/authentication?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
      }
    )
    .then(() =>
      app.listen(3001, () =>
        console.log("Database Connected, Server Running on Port: 3001")
      )
    )
    .catch((error) => console.log(`${error} did not connect`));
};
