const { get, default: mongoose } = require("mongoose");
const app = require("../app");
const Sauce = require("../models/sauceModel");
const db = mongoose.connection;

exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Crée une nouvelle sauce avec l'id de l'utilisateur, les informations qu'il saisit sur la page d'envoi, le chemin d'accès à l'image reçue, et initialise le nombre de likes/dislikes à 0. Array d'utilisateurs ayant liké/disliké est donc de facto vide aussi.
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({});
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.updateSauce = (req, res) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({}))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.likeSauce = (req, res) => {
  Sauce.findOne({
    _id: req.params.id
  })
  .then ((sauce) => {
    if (req.body.like === 1) {
  return Sauce.updateOne({_id: req.params.id}, {
    $push: { usersLiked: req.body.userId },
    $inc: { likes: 1 },
  })
    } else if (req.body.like === -1) {
      return Sauce.updateOne({_id: req.params.id}, {
        $push: { usersDisliked: req.body.userId },
        $inc: { dislikes: 1 },
      })
    } else if (req.body.like === 0) {
      if (sauce.usersLiked.includes(req.body.userId)) {
        return Sauce.updateOne({_id: req.params.id}, {
          $pull: { usersLiked: req.body.userId },
          $inc: { likes: -1 },
        })
      } else if (sauce.usersDisliked.includes(req.body.userId)) {
        return Sauce.updateOne({_id: req.params.id}, {
          $pull: { usersDisliked: req.body.userId },
          $inc: { dislikes: -1 },
        })
      }
    }
  })
    .then(() => {
      res.status(200).json({});
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};