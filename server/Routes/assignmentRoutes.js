import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate } from '../middleware/auth.js';
import Assignment from '../models/assignment.js';
import AssignmentSubmission from '../models/assignmentsubmission.js';
import User from '../models/user.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/assignments/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Teacher uploads an assignment
router.post('/teacher/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.body.title || !req.body.description || !req.body.classes || !req.body.subject || !req.body.due_date) {
      return res.status(400).json({ error: 'Missing required fields', received: req.body });
    }

    const assignment = new Assignment({
      title: req.body.title,
      description: req.body.description,
      file_path: `/uploads/assignments/${req.file.filename}`,
      due_date: req.body.due_date,
      classes: req.body.classes.split(',').map(c => c.trim()),
      subject: req.body.subject,
      created_by: req.user._id
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error uploading assignment:', error);
    res.status(500).json({ error: 'Failed to upload assignment' });
  }
});

// Get all assignments for a teacher
router.get('/teacher/assignments', authenticate, async (req, res) => {
  try {
    const assignments = await Assignment.find({ created_by: req.user._id })
      .sort({ created_at: -1 });
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Get assignments for a student based on their class
router.get('/student/assignments', authenticate, async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    const assignments = await Assignment.find({
      classes: student.class
    }).sort({ due_date: 1 });
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Student submits an assignment
router.post('/student/submit', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const submission = new AssignmentSubmission({
      assignment_id: req.body.assignmentId,
      student_id: req.user._id,
      file_path: `/uploads/assignments/submissions/${req.file.filename}`,
      remarks: req.body.remarks
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
});

// Get submissions for a specific assignment
router.get('/teacher/assignments/:assignmentId/submissions', authenticate, async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({
      assignment_id: req.params.assignmentId
    }).populate('student_id', 'fname lname userNo');
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Grade a submission
router.post('/teacher/assignments/submissions/mark/:submissionId', authenticate, async (req, res) => {
  try {
    const submission = await AssignmentSubmission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    submission.grade = req.body.grade;
    submission.feedback = req.body.feedback;
    submission.graded_at = new Date();
    await submission.save();

    res.json(submission);
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ error: 'Failed to grade submission' });
  }
});

export default router;
