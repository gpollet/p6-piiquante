const jwt = require("jsonwebtoken");

const userToken = process.env.USER_TOKEN;

// Récupère le token envoyé avec la requête et le déchiffre pour vérifier qu'il correspond bien à celui qui a été attribué à l'utilisateur. S'il ne correspond pas, seules les requêtes GET de l'utilisateur seront traitées.
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, userToken);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error });
  }
};
