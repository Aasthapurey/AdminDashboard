import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

// Delete Modal Component
const DeleteModal = ({ isOpen, onClose, onConfirm, selectedCount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete {selectedCount} selected {selectedCount === 1 ? 'program' : 'programs'}?
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

// Edit/Add Modal Component
const ProgramModal = ({ isOpen, onClose, onSave, program, isEditing }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    cost: '',
    type: 'technical',
    image: '/images/default.png',
    link: '',
    batches: {
      morning: { date: '', time: '' },
      evening: { date: '', time: '' }
    }
  });

  useEffect(() => {
    if (program && isEditing) {
      setFormData({
        name: program.name || '',
        description: program.description || '',
        duration: program.duration || '',
        cost: program.cost || '',
        type: program.type || 'technical',
        image: program.image || '/images/default.png',
        link: program.link || '',
        batches: {
          morning: {
            date: program.batches?.morning?.date || '',
            time: program.batches?.morning?.time || '',
          },
          evening: {
            date: program.batches?.evening?.date || '',
            time: program.batches?.evening?.time || '',
          }
        }
      });
    } else {
      // Reset form for new program
      setFormData({
        name: '',
        description: '',
        duration: '',
        cost: '',
        type: 'technical',
        image: '/images/default.png',
        link: '',
        batches: {
          morning: { date: '', time: '' },
          evening: { date: '', time: '' }
        }
      });
    }
  }, [program, isEditing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBatchChange = (session, field, value) => {
    setFormData(prev => ({
      ...prev,
      batches: {
        ...prev.batches,
        [session]: {
          ...prev.batches[session],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? 'Edit Program' : 'Add New Program'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Program Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="technical">Technical</option>
                <option value="non-technical">Non-technical</option>
                <option value="management">Management</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost</label>
              <input
                type="text"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image Path</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Program Link</label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="border p-4 rounded">
              <h4 className="font-medium mb-2">Morning Batch</h4>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.batches.morning.date}
                  onChange={(e) => handleBatchChange('morning', 'date', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="text"
                  value={formData.batches.morning.time}
                  onChange={(e) => handleBatchChange('morning', 'time', e.target.value)}
                  placeholder="e.g. 09:00 AM - 11:00 AM"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="border p-4 rounded">
              <h4 className="font-medium mb-2">Evening Batch</h4>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.batches.evening.date}
                  onChange={(e) => handleBatchChange('evening', 'date', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="text"
                  value={formData.batches.evening.time}
                  onChange={(e) => handleBatchChange('evening', 'time', e.target.value)}
                  placeholder="e.g. 06:00 PM - 08:00 PM"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditing ? 'Update' : 'Add'} Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProgramDashboard = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('az');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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

      const response = await apiClient.get('https://coderhouse-448820.el.r.appspot.com/CampusProgramDescription/', {
        headers: { Authorization: `${token}` },
      });
      console.log(response.data);
      const sortedData = response.data.sort((a, b) => a.name.localeCompare(b.name));

      setPrograms(sortedData);
      setFilteredPrograms(sortedData);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...programs];

    if (typeFilter !== 'All') {
      result = result.filter(program => program.type === typeFilter.toLowerCase());
    }

    if (sortOrder === 'az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'za') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === 'costAsc') {
      result.sort((a, b) => {
        const costA = parseFloat(a.cost.replace(/[^\d.-]/g, '')) || 0;
        const costB = parseFloat(b.cost.replace(/[^\d.-]/g, '')) || 0;
        return costA - costB;
      });
    } else if (sortOrder === 'costDesc') {
      result.sort((a, b) => {
        const costA = parseFloat(a.cost.replace(/[^\d.-]/g, '')) || 0;
        const costB = parseFloat(b.cost.replace(/[^\d.-]/g, '')) || 0;
        return costB - costA;
      });
    }

    setFilteredPrograms(result);
  }, [typeFilter, sortOrder, programs]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await Promise.all(
        selectedRows.map(id =>
          apiClient.delete(`https://coderhouse-448820.el.r.appspot.com/CampusProgramDescription/${id}`, {
            headers: { Authorization: `${token}` },
          })
        )
      );
      setPrograms(programs.filter(program => !selectedRows.includes(program._id)));
      setSelectedRows([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting programs:', error);
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
      setSelectedRows(filteredPrograms.map(program => program._id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleAddProgram = () => {
    setCurrentProgram(null);
    setIsEditing(false);
    setShowProgramModal(true);
  };

  const handleEditProgram = (program) => {
    setCurrentProgram(program);
    setIsEditing(true);
    setShowProgramModal(true);
  };

  const handleSaveProgram = async (programData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (isEditing && currentProgram) {
        // Update existing program
        const response = await apiClient.put(
          `https://coderhouse-448820.el.r.appspot.com/CampusProgramDescription/${currentProgram._id}`,
          programData,
          { headers: { Authorization: `${token}` } }
        );
        setPrograms(programs.map(p => (p._id === currentProgram._id ? response.data : p)));
      } else {
        // Add new program
        const response = await apiClient.post(
          'https://coderhouse-448820.el.r.appspot.com/CampusProgramDescription/',
          programData,
          { headers: { Authorization: `${token}` } }
        );
        setPrograms([...programs, response.data]);
      }
      setShowProgramModal(false);
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  const getTypes = () => {
    const types = ['All', ...new Set(programs.map(program => program.type.charAt(0).toUpperCase() + program.type.slice(1)))];
    return types;
  };

  const exportToCSV = () => {
    const headers = ['S.No', 'Program Name', 'Type', 'Duration', 'Cost', 'Morning Batch Date', 'Morning Batch Time', 'Evening Batch Date', 'Evening Batch Time', 'Description'];
    const rows = filteredPrograms.map((program, index) => [
      index + 1,
      program.name,
      program.type,
      program.duration,
      program.cost,
      program.batches?.morning?.date || 'N/A',
      program.batches?.morning?.time || 'N/A',
      program.batches?.evening?.date || 'N/A',
      program.batches?.evening?.time || 'N/A',
      program.description
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'campus_programs_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Campus Programs Dashboard</h1>

      {/* Filter, Sort Controls and Action Buttons */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex-1">
          <label className="mr-2">Filter by Type:</label>
          {getTypes().map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 mr-2 rounded ${
                typeFilter === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div>
          <label className="mr-2">Sort By:</label>
          <button
            onClick={() => setSortOrder('az')}
            className={`px-3 py-1 mr-2 rounded ${
              sortOrder === 'az'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Name A-Z
          </button>
          <button
            onClick={() => setSortOrder('za')}
            className={`px-3 py-1 mr-2 rounded ${
              sortOrder === 'za'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Name Z-A
          </button>
          <button
            onClick={() => setSortOrder('costAsc')}
            className={`px-3 py-1 mr-2 rounded ${
              sortOrder === 'costAsc'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Cost ↑
          </button>
          <button
            onClick={() => setSortOrder('costDesc')}
            className={`px-3 py-1 rounded ${
              sortOrder === 'costDesc'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Cost ↓
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={handleAddProgram}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Program
        </button>

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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export to CSV
        </button>
      </div>

      {/* Programs Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === filteredPrograms.length && filteredPrograms.length > 0}
                />
              </th>
              <th className="px-4 py-2 text-left">S.No</th>
              <th className="px-4 py-2 text-left">Program Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Cost</th>
              <th className="px-4 py-2 text-left">Morning Batch</th>
              <th className="px-4 py-2 text-left">Evening Batch</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program, index) => (
                <tr key={program._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(program._id)}
                      onChange={() => handleRowSelect(program._id)}
                    />
                  </td>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{program.name}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      program.type === 'technical' ? 'bg-blue-100 text-blue-800' :
                      program.type === 'non-technical' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {program.type.charAt(0).toUpperCase() + program.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2">{program.duration}</td>
                  <td className="px-4 py-2">{program.cost}</td>
                  <td className="px-4 py-2">
                    {program.batches?.morning?.date ? (
                      <div>
                        <div>{new Date(program.batches.morning.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{program.batches.morning.time}</div>
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td className="px-4 py-2">
                    {program.batches?.evening?.date ? (
                      <div>
                        <div>{new Date(program.batches.evening.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{program.batches.evening.time}</div>
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditProgram(program)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No programs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Program Details Expandable View */}
      {filteredPrograms.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Program Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrograms.map((program) => (
              <div key={program._id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{program.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    program.type === 'technical' ? 'bg-blue-100 text-blue-800' :
                    program.type === 'non-technical' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {program.type.charAt(0).toUpperCase() + program.type.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{program.description}</p>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Duration:</span>
                  <span className="text-sm">{program.duration}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium">Cost:</span>
                  <span className="text-sm font-bold">{program.cost}</span>
                </div>
                
                <div className="border-t pt-2">
                  <h4 className="text-sm font-semibold mb-1">Batches:</h4>
                  <div className="flex flex-col gap-2">
                    {program.batches?.morning?.date && (
                      <div className="text-xs bg-gray-50 p-2 rounded">
                        <span className="font-medium">Morning:</span> {new Date(program.batches.morning.date).toLocaleDateString()} ({program.batches.morning.time})
                      </div>
                    )}
                    {program.batches?.evening?.date && (
                      <div className="text-xs bg-gray-50 p-2 rounded">
                        <span className="font-medium">Evening:</span> {new Date(program.batches.evening.date).toLocaleDateString()} ({program.batches.evening.time})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        selectedCount={selectedRows.length}
      />

      {/* Program Add/Edit Modal */}
      <ProgramModal
        isOpen={showProgramModal}
        onClose={() => setShowProgramModal(false)}
        onSave={handleSaveProgram}
        program={currentProgram}
        isEditing={isEditing}
      />
    </div>
  );
};

export default ProgramDashboard;