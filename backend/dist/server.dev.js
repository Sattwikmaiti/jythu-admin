"use strict";

var express = require("express");

var app = express();

var dotenv = require("dotenv");

var mongoose = require("mongoose");

var authRoute = require("./routes/Auth");

var cookieParser = require('cookie-parser');

var cors = require("cors");

var adminRoute = require("./routes/Admin");

dotenv.config();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
mongoose.connect(process.env.MONGO_URL, {}).then(console.log("Connected to MongoDB"))["catch"](function (err) {
  return console.log(err);
});
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.listen("5000", function () {
  console.log("Backend is running.");
});