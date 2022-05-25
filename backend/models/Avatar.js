const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let avatarSchema = new Schema({
  img_link: { type: String, required: true, min: 2, max: 255 },
});

//Export
module.exports = mongoose.model('Avatar', avatarSchema);
