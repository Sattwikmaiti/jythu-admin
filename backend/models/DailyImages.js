const mongoose = require("mongoose");

const dailyImageSchema = new mongoose.Schema({
  url: String,
  filename: String,
  time: { type: Date, default: Date.now },
  id:String
});


const DailyImages = mongoose.model("DailyImages", dailyImageSchema);


module.exports = DailyImages;


