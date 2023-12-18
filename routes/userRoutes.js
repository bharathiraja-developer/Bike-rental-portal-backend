const userRouter = require("express").Router();
const userController = require("../controllers/users");
const authMiddleware = require("../middleware/authmiddleware");

userRouter.post("/", userController.signup);
userRouter.get("/list", userController.getUserList);
userRouter.post("/signin", userController.signin);
userRouter.patch("/forget", userController.forget);
userRouter.patch("/reset", userController.reset);
userRouter.get(
  "/profile",
  authMiddleware.verifyToken,
  userController.getProfile
);
userRouter.put(
  "/profile",
  authMiddleware.verifyToken,
  userController.editProfile
);
userRouter.delete(
  "/profile",
  authMiddleware.verifyToken,
  userController.deleteProfile
);
userRouter.put("/bike", userController.bookBike);

module.exports = userRouter;
