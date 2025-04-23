import mongoose from 'mongoose';

const assignmentSubmissionSchema = new mongoose.Schema({
  assignment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  file_path: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    default: '',
  },
  grade: {
    type: Number,
    min: 0,
    max: 100,
  },
  feedback: {
    type: String,
    default: '',
  },
  submitted_at: {
    type: Date,
    default: Date.now,
  },
  graded_at: {
    type: Date,
  },
});

const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);

export default AssignmentSubmission; 