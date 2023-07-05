const express = require("express");
const router = express.Router();

const userController = require("../controller/index");
const verifyToken = require("../middleware/VerifyToken");
const refreshToken = require("../controller/index");

router.get("/users", verifyToken, userController.Users.getUsers);
router.post("/register", userController.Users.Register);
router.post("/login", userController.Users.Login);
router.get("/token", refreshToken.RefreshToken.refreshToken);
router.delete("/logout", userController.Users.Logout);

module.exports = router;
