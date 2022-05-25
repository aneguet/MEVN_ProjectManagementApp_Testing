const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let technologySchema = new Schema({
  tech_name: { type: String, required: true, min: 2, max: 255 },
});

//Export
module.exports = mongoose.model('Technology', technologySchema);
