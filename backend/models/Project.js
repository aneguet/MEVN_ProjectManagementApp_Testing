const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

let projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  description: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  stakeholder: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    autopopulate: {
      select: ['_id', 'first_name', 'last_name', 'email', 'avatar'],
    },
  },
  members: [
    {
      member_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        autopopulate: {
          select: ['_id', 'first_name', 'last_name', 'email', 'avatar'],
        },
      },
      project_roles: [
        {
          type: String,
          required: false,
          min: 2,
          max: 255,
          default: 'Timefly member',
        },
      ],
      assigned_hours: { type: Number, required: false, min: 0, default: 0 },
    },
  ],
  technologies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technology',
      required: true,
      autopopulate: true,
    },
  ],
  time_schedule: {
    start_date: { type: Date, required: true, default: Date.now },
    due_date: { type: Date, required: true, default: Date.now },
    end_date: { type: Date, required: true, default: Date.now },
    estimated_hours: { type: Number, required: true, min: 0, default: 0 },
    spent_hours: { type: Number, required: true, min: 0, default: 0 },
  },
});
projectSchema.plugin(autopopulate);
//Export
module.exports = mongoose.model('Project', projectSchema);
