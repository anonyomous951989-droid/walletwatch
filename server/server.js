const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const passport = require("./controllers/auth.googleAuth");
const GoogleAuthRoutes = require("./routes/googleAuthRoutes");

dotenv.config();

const app = express();

// Trust proxy (important for deployment)
app.set("trust proxy", 1);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Routes
app.use(passport.initialize());
app.use("/auth", GoogleAuthRoutes);
app.use("/api/v1/users", require("./routes/userRoute"));
app.use("/api/v1/transactions", require("./routes/transectionRoutes"));
app.use("/api/v1/user-information", require("./routes/userInfoRoutes"));

app.get("/", (req, res) => {
  res.send("Expense Management System Backend Running");
});

// RUN SERVER ONLY WHEN NOT IN TEST MODE
if (process.env.NODE_ENV !== "test") {
  const connectDb = require("./config/connectDb");

  connectDb().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

module.exports = app;
