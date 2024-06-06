"use strict";

var mongoose = require("mongoose");

var NotificationSchema = new mongoose.Schema({
  id: String,
  starttime: {
    type: Date,
    required: true
  },
  endtime: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});
var Notifications = mongoose.model("Notifications", NotificationSchema);
module.exports = Notifications;