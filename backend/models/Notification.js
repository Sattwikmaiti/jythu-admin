const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  
  id:String,
  starttime: {
    type: Date,
    required: true,
  },
    endtime: {
        type: Date,
        required: true,
    },
   


}, { timestamps: true });


const Notifications = mongoose.model("Notifications", NotificationSchema);


module.exports = Notifications;


