import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function Library({ isTeacher = false, isAdmin = false }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'document',
    file: null
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get('/library/resources');
      console.log('API Response:', response.data); // Debug log
      // Ensure resources is always an array
      setResources(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error); // Debug log
      toast.error('Failed to fetch resources');
      setResources([]); // Set empty array on error
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setNewResource({ ...newResource, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newResource.title || !newResource.file) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', newResource.title);
    formData.append('description', newResource.description);
    formData.append('type', newResource.type);
    formData.append('file', newResource.file);

    try {
      await axios.post('/library/resources', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Resource added successfully');
      setNewResource({
        title: '',
        description: '',
        type: 'document',
        file: null
      });
      fetchResources();
    } catch (error) {
      toast.error('Failed to add resource');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      await axios.delete(`/api/library/resources/${id}`);
      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      toast.error('Failed to delete resource');
    }
  };

  const filteredResources = Array.isArray(resources) 
    ? resources.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Library Resources</h2>
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {(isTeacher || isAdmin) && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Add New Resource</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={newResource.type}
                onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="document">Document</option>
                <option value="video">Video</option>
                <option value="link">Link</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">File *</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Upload Resource
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">{resource.title}</h3>
              <p className="text-gray-600 mt-2">{resource.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">{resource.type}</span>
                <div className="space-x-2">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </a>
                  {(isTeacher || isAdmin) && (
                    <button
                      onClick={() => handleDelete(resource._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Library; 