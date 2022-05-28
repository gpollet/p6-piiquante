const authRouter = require("./routes/authRoutes");
const saucesRouter = require("./routes/saucesRoutes");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
// Middlewares :

dotenv.config({ path: "./.env" });

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(console.log("Connecté à MongoDB."))
  .catch((err) => {
    if (fs.existsSync("./.env") === false) {
      console.log(
        "Connexion à la base de donnée impossible : fichier .env manquant."
      );
    }
  });

// Supprime des caractères comme $, qui pourraient être utilisés pour faire une injection noSQL
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: "_",
  })
);

app.use(helmet({ crossOriginResourcePolicy: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Serveur OK");
});

// Routes :
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", authRouter);
app.use("/api/sauces", saucesRouter);

// Server :
module.exports = app;
