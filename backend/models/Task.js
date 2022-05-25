const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

let taskSchema = new Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  name: { type: String, required: true, min: 3, max: 255 },
  description: { type: String, required: true, min: 3, max: 255 },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  hours_allocated: { type: Number, required: true, min: 0, default: 0 },
  hours_used: { type: Number, required: false, min: 0, default: 0 },
  task_status: {
    type: String,
    required: false,
    enum: ['Todo', 'Doing', 'Done'], // Only accepts 'admin' or 'user'
    // default: 'Todo',
  },
});
taskSchema.plugin(autopopulate);

//Export
module.exports = mongoose.model('Task', taskSchema);
