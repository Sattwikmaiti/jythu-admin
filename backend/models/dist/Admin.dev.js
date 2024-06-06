"use strict";

// Admin.js
var mongoose = require('mongoose');

var Schema = mongoose.Schema; // Define the schema for the Admin model

var adminSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
}); // Create the Admin model using the schema

var Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;