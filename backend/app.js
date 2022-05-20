const authRouter = require("./routes/authRoutes");
const saucesRouter = require("./routes/saucesRoutes");
const express = require("express");
const morgan = require("morgan");

const app = express();
// Middlewares :
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  next();
});

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Serveur OK");
});

// Routes :
app.use("/api/auth", authRouter);
app.use("/api/sauces", saucesRouter);

// Server :
module.exports = app;