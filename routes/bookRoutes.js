const bookRouter = require("express").Router();
const bookController = require("../controllers/bookings");

bookRouter.get("/:username", bookController.showbike);

module.exports = bookRouter;
