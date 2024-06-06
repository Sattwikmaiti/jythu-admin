"use strict";

var mongoose = require("mongoose");

var dailyWorkingSchema = new mongoose.Schema({
  filename: String,
  fileDetails: String,
  starttime: Date,
  endtime: Date
});
var AttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  attendence: {
    type: String,
    "enum": ["Present", "Absent"],
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    "default": 0
  }
});
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dailyworking: {
    type: [dailyWorkingSchema],
    "default": []
  },
  attendance_rating: {
    type: [AttendanceSchema],
    "default": []
  },
  phone: {
    type: String,
    "default": ""
  },
  address: {
    type: String,
    "default": ""
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("User", UserSchema);