"strict mode";

const fs = require("fs");
const Sauce = require("../models/sauceModel");

// Demande à la DB de renvoyer tous les documents de la collection Sauce.
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

// Demande à la DB de renvoyer le document de la collection Sauce qui a un _id identique à l'id de l'URI
exports.getSauce = (req, res) => {
  Sauce.findById(req.params.id)
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

// Vérifie si un fichier est joint. Si oui, convertit le corps de la requête pour y insérer l'url de l'image, si non met à jour les champs avec les nouvelles informations fournies par l'utilisateur.
exports.updateSauce = (req, res) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.findByIdAndUpdate(req.params.id, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({}))
    .catch((error) => res.status(400).json({ error }));
};

// Trouve la sauce ayant un _id correspondant à l'id de la requête, et la supprime.
exports.deleteSauce = (req, res) => {
  Sauce.findByIdAndDelete(req.params.id)
    .then((sauce) => {
      const imgPath = sauce.imageUrl.replace("http://localhost:3000", ".");
      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Image supprimée");
        }
      });
    })
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Trouve la sauce correspondant à l'id de la page, puis analyse le corps de la requête pour savoir si l'utilisation a liké, disliké ou annulé un like/dislike. Si l'utilisateur like/dislike, son id est enregistré dans un array et le compteur associé augmente de 1. S'il s'agit d'une annulation de like/dislike, supprime l'ID de l'utilisateur de l'array et diminue le nombre de like/dislike en question de 1.
exports.likeSauce = (req, res) => {
  Sauce.findById(req.params.id)
    .then((sauce) => {
      if (req.body.like === 1) {
        return sauce.update({
          $push: { usersLiked: req.body.userId },
          $inc: { likes: 1 },
        });
      } else if (req.body.like === -1) {
        return sauce.update({
          $push: { usersDisliked: req.body.userId },
          $inc: { dislikes: 1 },
        });
      } else if (req.body.like === 0) {
        if (sauce.usersLiked.includes(req.body.userId)) {
          return sauce.update({
            $pull: { usersLiked: req.body.userId },
            $inc: { likes: -1 },
          });
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          return sauce.update({
            $pull: { usersDisliked: req.body.userId },
            $inc: { dislikes: -1 },
          });
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
