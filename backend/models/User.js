const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

// USER
let userSchema = new Schema({
  role: {
    type: String,
    required: false,
    enum: ['admin', 'user'], // Only accepts 'admin' or 'user'
    // default: 'user',
  },
  first_name: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  last_name: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  email: { type: String, required: true, min: 3, max: 255 },
  password: { type: String, required: true, min: 5, max: 30 },
  phone: { type: String, required: false, min: 7, max: 15 }, //default: '123456'
  avatar: {
    type: String,
    required: false,
    default: 'https://i.imgur.com/e5YmXMB.png',
  },
  registration_date: { type: Date, required: false, default: Date.now },
  weekly_hours: { type: Number, required: false, min: 0, default: 35 }, // Number type includes decimals
});

userSchema.plugin(autopopulate);
//Export
module.exports = mongoose.model('User', userSchema);
