const { Schema, model } = require("../db/connection");

const sauceSchema = new Schema({
  userId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  // usersLiked: {type: String, required: true}
  // usersDisliked: {type: String, required: true}
});

const sauceModel = model("Sauce", sauceSchema);

module.exports = sauceModel;
