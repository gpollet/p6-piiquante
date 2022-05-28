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
  .put(multer, sauceController.updateSauce)
  .delete(sauceController.deleteSauce);

router.route("/:id").get(sauceController.getSauce)

router.route("/:id/like", authSauce).post(sauceController.likeSauce);

module.exports = router;
