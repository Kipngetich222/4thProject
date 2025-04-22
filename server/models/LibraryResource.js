import mongoose from 'mongoose';

const libraryResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['document', 'video', 'link'],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const LibraryResource = mongoose.model('LibraryResource', libraryResourceSchema);

export default LibraryResource; 