import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

// Simple Modal Component
const DeleteModal = ({ isOpen, onClose, onConfirm, selectedCount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete {selectedCount} selected {selectedCount === 1 ? 'item' : 'items'}?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [formDetails, setFormDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      if (!token) return;

      const response = await apiClient.get('https://coderhouse-x1yv.onrender.com/Form/', {
        headers: { Authorization: `${token}` },
      });

      const sortedData = response.data.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setFormDetails(sortedData);
      setFilteredDetails(sortedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = formDetails;

    if (roleFilter !== 'All') {
      result = result.filter(form => form.role === roleFilter);
    }

    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredDetails(result);
  }, [roleFilter, sortOrder, formDetails]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      // Delete multiple records
      await Promise.all(
        selectedRows.map(id =>
          apiClient.delete(`/Form/${id}`, {
            headers: { Authorization: `${token}` },
          })
        )
      );
      setFormDetails(formDetails.filter(form => !selectedRows.includes(form._id)));
      setSelectedRows([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(filteredDetails.map(form => form._id));
    } else {
      setSelectedRows([]);
    }
  };

  const getRoles = () => {
    const roles = ['All', ...new Set(formDetails.map(form => form.role))];
    return roles;
  };

  const exportToCSV = () => {
    const headers = ['S.No', 'Name', 'Email', 'Phone', 'Role', 'Query', 'LinkedIn'];
    const rows = filteredDetails.map((form, index) => [
      index + 1,
      form.name,
      form.email,
      form.phone,
      form.role,
      form.query || 'N/A',
      form.linkedin_url || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'table_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Filter, Sort Controls and Delete Button */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex-1">
          <label className="mr-2">Role Filter:</label>
          {getRoles().map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1 mr-2 rounded ${roleFilter === role
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
                }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div>
          <label className="mr-2">Sort Order:</label>
          <button
            onClick={() => setSortOrder('newest')}
            className={`px-3 py-1 mr-2 rounded ${sortOrder === 'newest'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
              }`}
          >
            Oldest First
          </button>
          <button
            onClick={() => setSortOrder('oldest')}
            className={`px-3 py-1 rounded ${sortOrder === 'oldest'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
              }`}
          >
            Newest First
          </button>
        </div>

        {selectedRows.length > 0 && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Selected ({selectedRows.length})
          </button>
        )}

        <button
          onClick={exportToCSV}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Export to CSV
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === filteredDetails.length && filteredDetails.length > 0}
                />
              </th>
              <th className="px-4 py-2 text-left">S.No</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Query</th>
              <th className="px-4 py-2 text-left">LinkedIn</th>
            </tr>
          </thead>
          <tbody>
            {filteredDetails.length > 0 ? (
              filteredDetails.map((form, index) => (
                <tr key={form._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(form._id)}
                      onChange={() => handleRowSelect(form._id)}
                    />
                  </td>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{form.name}</td>
                  <td className="px-4 py-2">{form.email}</td>
                  <td className="px-4 py-2">{form.phone}</td>
                  <td className="px-4 py-2">{form.role}</td>
                  <td className="px-4 py-2"><div className="query-cell">{form.query || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-2">
                    {form.linkedin_url ? (
                      <a
                        href={form.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Profile
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        selectedCount={selectedRows.length}
      />

      {/* Add CSS for the Query cell */}
      <style>
        {`
          .query-cell {
            max-width: 300px; 
            overflow-x: auto;
            white-space: nowrap;
          }

          /* Thin scrollbar for WebKit browsers (Chrome, Safari) */
          .query-cell::-webkit-scrollbar {
            width: 1px; /* Adjust the width to make it thinner */
            height: 1px; /* Adjust the height for horizontal scrollbar */
          }

          .query-cell::-webkit-scrollbar-thumb {
            background-color: #888; /* Color of the scrollbar thumb */
            border-radius: 1px; /* Rounded corners for the thumb */
          }

          .query-cell::-webkit-scrollbar-track {
            background-color: #f1f1f1; /* Color of the scrollbar track */
          }

          /* Thin scrollbar for Firefox */
          .query-cell {
            scrollbar-width: thin; /* Makes the scrollbar thinner */
            scrollbar-color: #888 #f1f1f1; /* Thumb and track color */
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;