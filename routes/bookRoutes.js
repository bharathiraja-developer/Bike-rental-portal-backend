const bookRouter = require("express").Router();
const bookController = require("../controllers/bookings");

bookRouter.get("/:email", bookController.showbike);

module.exports = bookRouter;
