const config = require("./utils/config");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bikeRouter = require("./routes/bikeRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
mongoose.set("strictQuery", false);

console.log("connecting to mongoDB.....");
mongoose
  .connect(config.URI)
  .then(() => {
    console.log("Connected to mongoDB...");
  })
  .catch((error) => {
    console.log("Error connecting to mongoDB", error.message);
  });

app.use(cors());
app.use(express.json());
app.use("/api/bikes", bikeRouter);
app.use("/api/users", userRouter);

app.listen(config.PORT, () => {
  console.log("Server running successfully");
});
