import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  file_path: {
    type: String,
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  classes: [{
    type: String,
    required: true,
  }],
  subject: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
