const express = require("express");
const router = express.Router();
const sauceController = require("./../controllers/sauceController");
const authSauce = require("../middleware/authSauce");
const multer = require("../middleware/multer-config");

router
  .route("/", authSauce)
  .get(sauceController.getAllSauces)
  .post(multer, sauceController.createSauce);

router
  .route("/:id", authSauce)
  .get(sauceController.getSauce)
  .put(multer, sauceController.updateSauce)
  .delete(sauceController.deleteSauce)
  .post(sauceController.likeSauce);

module.exports = router;
