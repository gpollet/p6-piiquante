const express = require("express");
const sauceController = require("./../controllers/sauceController");
const router = express.Router();

router
  .route("/")
  .get(sauceController.getAllSauces)
  .post(sauceController.createSauce);

router
  .route("/:id")
  .get(sauceController.getSauce)
  .put(sauceController.updateSauce)
  .delete(sauceController.deleteSauce)
  .post(sauceController.likeSauce);

module.exports = router;
