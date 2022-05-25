const { get } = require("mongoose");
const app = require("../app");
const Sauce = require("../models/sauceModel");

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
  // const getLikes = db.sauces.find({_id: req.params.id})
  let arrayToUpdate;
  let likesToUpdate
  let likeValue = 0;
  if (req.body.like === 1) {
    arrayToUpdate = "usersLiked";
    likesToUpdate = "likes"
    likeValue = 1;
  } else if (req.body.like === -1) {
    arrayToUpdate = "usersDisliked";
    likesToUpdate = "dislikes"
    likeValue = 1;
  } else if (req.body.like === 0) {
    likeValue = -1;
  }
  const filter = { _id: req.params.id };
  Sauce.findOneAndUpdate(filter, {
    $push: { [arrayToUpdate]: req.body.userId },
    $inc: { [likesToUpdate]: likeValue },
  })
    .then(() => {
      res.status(201).json({});
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
