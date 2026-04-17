const mongoose = require("mongoose");

const connectDb = async () => {
  if (process.env.NODE_ENV === "test") {
    return; // ⛔ NEVER connect real DB in test
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB Error:", error);
  }
};

module.exports = connectDb;
