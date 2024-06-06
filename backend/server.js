const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/Auth");
const cookieParser = require('cookie-parser');
const cors=require("cors");
const adminRoute = require("./routes/Admin");
dotenv.config();
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
)
app.use(cookieParser())
mongoose
  .connect(process.env.MONGO_URL, {
 })
  
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

  app.use("/api/auth", authRoute);

  app.use("/api/admin", adminRoute);
  


  app.listen("5000", () => {
    console.log("Backend is running.");
  });