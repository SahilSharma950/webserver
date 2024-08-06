// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin:{
    type: Boolean,
    default: false,
    required: true,
  },
  resetPasswordToken:{
    type: String,
    default: null,
  },
  resetPasswordExpires:{
    type: Date,
    default: null,
  }
}, { timestamps: true });




const User = mongoose.model('User', userSchema);

module.exports = User;
