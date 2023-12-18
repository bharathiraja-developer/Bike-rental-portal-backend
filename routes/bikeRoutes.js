const bikeRouter = require("express").Router();
const bikeController = require("../controllers/bikes");

bikeRouter.get("/", bikeController.showBikes);

module.exports = bikeRouter;
