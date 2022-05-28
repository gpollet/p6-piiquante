const express = require("express");
const rateLimiter = require('../middleware/rateLimiter')
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", rateLimiter, authController.signup);
router.post("/login", rateLimiter, authController.login);

module.exports = router;