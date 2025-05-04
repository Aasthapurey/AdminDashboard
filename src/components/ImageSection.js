import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

const DeleteModal = ({ isOpen, onClose, onConfirm, selectedCount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">Are you sure you want to delete {selectedCount} selected image(s)? This action cannot be undone.</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
};

const GalleryDashboard = () => {
  const [images, setImages] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newImage, setNewImage] = useState({ image: '', description: '', order: 0 });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editImage, setEditImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) navigate('/');
  }, [navigate]);

  const fetchData = async () => {
    try {
      const response = await apiClient.get('https://coderhouse-x1yv.onrender.com/HomeBanner/');
      const sortedData = response.data.HomeBanner.sort((a, b) => (a.order || 0) - (b.order || 0));
      setImages(sortedData);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Custom image upload function
  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://api.imgbb.com/1/upload?key=d58014ecee09b06053eeaba88f4278f1', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      return data.data.url; // Returns the direct URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      // Reset progress
      setUploadProgress(0);

      // Simulate upload progress (optional)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      // Upload image to ImgBB
      const uploadedImageUrl = await uploadImageToImgBB(selectedFile);

      if (uploadedImageUrl) {
        // Update new image state with uploaded URL
        setNewImage(prev => ({
          ...prev,
          image: uploadedImageUrl
        }));

        // Clear progress
        clearInterval(progressInterval);
        setUploadProgress(100);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map(id => apiClient.delete(`https://coderhouse-x1yv.onrender.com/HomeBanner/${id}`))
      );
      setImages(images.filter(image => !selectedRows.includes(image._id)));
      setSelectedRows([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting images:', error);
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows(prev => (prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]));
  };

  const handleAddImage = async () => {
    try {
      await apiClient.post('https://coderhouse-x1yv.onrender.com/HomeBanner/', newImage);
      fetchData();
      setNewImage({ image: '', description: '', order: 0 });
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  const handleEditImage = (image) => {
    setEditImage(image);
  };

  const handleUpdateImage = async () => {
    try {
      await apiClient.put(`https://coderhouse-x1yv.onrender.com/HomeBanner/${editImage._id}`, editImage);
      fetchData();
      setEditImage(null);
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gallery Dashboard</h1>
      
      <div className="mb-4 flex gap-2 items-center">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileSelect} 
          className="hidden" 
          id="fileUpload"
        />
        <label 
          htmlFor="fileUpload" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Choose Image
        </label>
        <span>{selectedFile ? selectedFile.name : 'No file selected'}</span>
        <button 
          onClick={handleFileUpload} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate Link
        </button>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <input 
          type="text" 
          placeholder="Image URL" 
          value={newImage.image} 
          onChange={(e) => setNewImage({ ...newImage, image: e.target.value })} 
          className="border p-2 rounded w-1/3" 
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={newImage.description} 
          onChange={(e) => setNewImage({ ...newImage, description: e.target.value })} 
          className="border p-2 rounded w-1/3" 
        />
        <input 
          type="number" 
          placeholder="Order" 
          value={newImage.order} 
          onChange={(e) => setNewImage({ ...newImage, order: Number(e.target.value) })} 
          className="border p-2 rounded w-1/6" 
        />
        <button 
          onClick={handleAddImage} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Image
        </button>
      </div>
      
      {selectedRows.length > 0 && (
        <button 
          onClick={() => setShowDeleteModal(true)} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-4"
        >
          Delete Selected ({selectedRows.length})
        </button>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image._id} className="relative border p-2 rounded-lg shadow-md">
              <input 
                type="checkbox" 
                className="absolute top-2 left-2" 
                checked={selectedRows.includes(image._id)} 
                onChange={() => handleRowSelect(image._id)} 
              />
              <img 
                src={image.image} 
                alt={image.description} 
                className="w-full h-40 object-cover rounded" 
              />
              <p className="text-center mt-2">{image.description}</p>
              <p className="text-center text-gray-500">Order: {image.order}</p>
              <button 
                onClick={() => handleEditImage(image)} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
              >
                Edit
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-4 text-center">No images found.</p>
        )}
      </div>

      {editImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Image</h3>
            <input 
              type="text" 
              placeholder="Image URL" 
              value={editImage.image} 
              onChange={(e) => setEditImage({ ...editImage, image: e.target.value })} 
              className="border p-2 rounded w-full mb-2" 
            />
            <input 
              type="text" 
              placeholder="Description" 
              value={editImage.description} 
              onChange={(e) => setEditImage({ ...editImage, description: e.target.value })} 
              className="border p-2 rounded w-full mb-2" 
            />
            <input 
              type="number" 
              placeholder="Order" 
              value={editImage.order} 
              onChange={(e) => setEditImage({ ...editImage, order: Number(e.target.value) })} 
              className="border p-2 rounded w-full mb-2" 
            />
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setEditImage(null)} 
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateImage} 
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={handleDelete} 
        selectedCount={selectedRows.length} 
      />
    </div>
  );
};

export default GalleryDashboard;