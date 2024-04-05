const bookRouter = require("express").Router();
const bookController = require("../controllers/bookings");

bookRouter.get("/", bookController.showbike);

module.exports = bookRouter;
