import express from 'express';
import LibraryResource from '../models/LibraryResource.js';

const router = express.Router();

// Get all library resources
export const getLibraryResources = async (req, res) => {
  try {
    const resources = await LibraryResource.find();
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching library resources:', error);
    res.status(500).json({ error: 'Failed to fetch library resources' });
  }
};

// Add a new library resource
export const addLibraryResource = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const newResource = new LibraryResource({
      title,
      description,
      type,
      fileUrl: `/uploads/library/${file.filename}`,
      uploadedBy: req.user.userNo
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error adding library resource:', error);
    res.status(500).json({ error: 'Failed to add library resource' });
  }
};

// Delete a library resource
export const deleteLibraryResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await LibraryResource.findByIdAndDelete(id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting library resource:', error);
    res.status(500).json({ error: 'Failed to delete library resource' });
  }
}; 