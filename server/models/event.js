import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  start: {
    type: Date,
    required: [true, 'Start date/time is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Start date must be in the future'
    }
  },
  end: {
    type: Date,
    required: [true, 'End date/time is required'],
    validate: {
      validator: function(value) {
        return value > this.start;
      },
      message: 'End date must be after start date'
    }
  },
  aiSummary: {
    type: String,
    trim: true,
    maxlength: [200, 'AI summary cannot exceed 200 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'User',
    required: true,
    default: 'system'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', null],
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
EventSchema.index({ start: 1 });
EventSchema.index({ end: 1 });
EventSchema.index({ createdBy: 1 });

// Pre-save hook to generate AI summary if not provided
EventSchema.pre('save', async function(next) {
  if (!this.aiSummary && (this.isModified('title') || this.isModified('description'))) {
    try {
      // Generate short summary from title + first 50 chars of description
      this.aiSummary = `${this.title}: ${this.description?.substring(0, 50) || ''}`;
    } catch (err) {
      console.error('Error generating event summary:', err);
    }
  }
  next();
});

export default mongoose.model('Event', EventSchema);