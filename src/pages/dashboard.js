import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

const Dashboard = () => {
  const [formDetails, setFormDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await apiClient.get('https://coderhouse-448820.el.r.appspot.com/Form/', {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log("Fetched data:", response.data);
      setFormDetails(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await apiClient.delete(`/Form/${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setFormDetails(formDetails.filter(form => form._id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {formDetails.length > 0 ? (
          formDetails.map((form,index) => (
            <div
              key={form._id}
              className="p-4 bg-white rounded-lg shadow-md border border-gray-200 relative"
            >
              {/* Serial number badge */}
              <div className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                {index + 1}
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(form._id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>

              <div className="space-y-2 mt-8">
                <h2 className="text-lg font-bold">{form.name}</h2>
                <p><strong>Email:</strong> {form.email}</p>
                <p><strong>Phone:</strong> {form.phone}</p>
                <p><strong>Role:</strong> {form.role}</p>

                {/* Display Query based on role */}
                <p>
                  <strong>Query:</strong>{' '}
                  {form.query || "Not specified"}
                </p>

                {form.linkedin_url && (
                  <p>
                    <strong>LinkedIn:</strong>{' '}
                    <a
                      href={form.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Profile
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-8">No entries found. The database is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;