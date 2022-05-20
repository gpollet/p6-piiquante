const User = require("../models/userModel");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config({ path: "../config.env" });
const userToken = process.env.USER_TOKEN;

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé" }))
        // Si utilisateur existe déjà : erreur 400
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Vérifie qu'utilisateur existe. Si existe, vérifie que mot de passe est correct. Si utilisateur existe ET mdp correct, renvoie un token associé à cet utilisateur.
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401);
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((correctPassword) => {
          if (!correctPassword) {
            return res.status(401);
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, `${userToken}`, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
