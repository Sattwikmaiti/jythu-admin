// Admin.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the Admin model
const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
     
  },
  email: {
    type: String,
    required: true,
    unique: true,
    
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create the Admin model using the schema
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
