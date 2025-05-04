import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

// Delete Modal Component (same as your existing one)
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

const AppointmentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [mentorFilter, setMentorFilter] = useState('All');
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

      const response1 = await apiClient.get('https://coderhouse-x1yv.onrender.com/Appointment/', {
        headers: { Authorization: `${token}` },
      });
      console.log(response1.data);
      const sortedData = response1.data.sort((a, b) =>
        new Date(b.appointment_date) - new Date(a.appointment_date)
      );

      setAppointments(sortedData);
      setFilteredAppointments(sortedData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = appointments;

    if (mentorFilter !== 'All') {
      result = result.filter(appointment => appointment.mentor_domain === mentorFilter);
    }

    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
    } else {
      result.sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));
    }

    setFilteredAppointments(result);
  }, [mentorFilter, sortOrder, appointments]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await Promise.all(
        selectedRows.map(id =>
          apiClient.delete(`https://coderhouse-x1yv.onrender.com/Appointment/${id}`, {
            headers: { Authorization: `${token}` },
          })
        )
      );
      setAppointments(appointments.filter(appointment => !selectedRows.includes(appointment._id)));
      setSelectedRows([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting appointments:', error);
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
      setSelectedRows(filteredAppointments.map(appointment => appointment._id));
    } else {
      setSelectedRows([]);
    }
  };

  const getMentorDomains = () => {
    const domains = ['All', ...new Set(appointments.map(appointment => appointment.mentor_domain))];
    return domains;
  };

  const exportToCSV = () => {
    const headers = ['S.No', 'Full Name', 'Email', 'Phone', 'Course/Branch', 'Year of Study', 'Mentor Domain', 'Appointment Date', 'Query'];
    const rows = filteredAppointments.map((appointment, index) => [
      index + 1,
      appointment.name,
      appointment.email,
      appointment.phone,
      appointment.branch_course,
      appointment.study_year,
      appointment.mentor_domain,
      new Date(appointment.appointment_date).toLocaleString(),
      appointment.query || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'appointments_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Appointment Dashboard</h1>

      {/* Filter, Sort Controls and Delete Button */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex-1">
          <label className="mr-2">Mentor Domain Filter:</label>
          {getMentorDomains().map(domain => (
            <button
              key={domain}
              onClick={() => setMentorFilter(domain)}
              className={`px-3 py-1 mr-2 rounded ${
                mentorFilter === domain
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        <div>
          <label className="mr-2">Sort Order:</label>
          <button
            onClick={() => setSortOrder('newest')}
            className={`px-3 py-1 mr-2 rounded ${
              sortOrder === 'newest'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Newest First
          </button>
          <button
            onClick={() => setSortOrder('oldest')}
            className={`px-3 py-1 rounded ${
              sortOrder === 'oldest'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Oldest First
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

      {/* Appointments Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === filteredAppointments.length && filteredAppointments.length > 0}
                />
              </th>
              <th className="px-4 py-2 text-left">S.No</th>
              <th className="px-4 py-2 text-left">Full Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Course/Branch</th>
              <th className="px-4 py-2 text-left">Year of Study</th>
              <th className="px-4 py-2 text-left">Mentor Domain</th>
              <th className="px-4 py-2 text-left">Appointment Date</th>
              <th className="px-4 py-2 text-left">Query</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment, index) => (
                <tr key={appointment._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(appointment._id)}
                      onChange={() => handleRowSelect(appointment._id)}
                    />
                  </td>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{appointment.name}</td>
                  <td className="px-4 py-2">{appointment.email}</td>
                  <td className="px-4 py-2">{appointment.phone}</td>
                  <td className="px-4 py-2">{appointment.branch_course}</td>
                  <td className="px-4 py-2">{appointment.study_year}</td>
                  <td className="px-4 py-2">{appointment.mentor_domain}</td>
                  <td className="px-4 py-2">
                    {new Date(appointment.appointment_date).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <div className="query-cell">{appointment.query || 'N/A'}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        selectedCount={selectedRows.length}
      />

      {/* Styles for query cell */}
      <style>
        {`
          .query-cell {
            max-width: 300px;
            overflow-x: auto;
            white-space: nowrap;
          }
          .query-cell::-webkit-scrollbar {
            width: 1px;
            height: 1px;
          }
          .query-cell::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 1px;
          }
          .query-cell::-webkit-scrollbar-track {
            background-color: #f1f1f1;
          }
          .query-cell {
            scrollbar-width: thin;
            scrollbar-color: #888 #f1f1f1;
          }
        `}
      </style>
    </div>
  );
};

export default AppointmentDashboard;