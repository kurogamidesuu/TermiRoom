const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// Force Google DNS — needed in some hosting environments where default DNS resolution fails for MongoDB Atlas SRV records.
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const utilRoutes = require("./routes/utilRoutes");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use("/api/user", userRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/util", utilRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the database.");

    app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to connect to DB: ${error.message}`);
    process.exit(1);
  }
}

start();
