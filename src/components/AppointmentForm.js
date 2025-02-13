// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import apiClient from '../utils/apiClient';

// const AppointmentForm = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         fullName: '',
//         email: '',
//         phone: '',
//         courseBranch: '',
//         yearOfStudy: '',
//         mentorDomain: '',
//         appointmentDate: '',
//         query: ''
//     });

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             const token = localStorage.getItem('authToken');
//             if (!token) {
//                 navigate('/');
//                 return;
//             }

//             await apiClient.post('https://coderhouse-448820.el.r.appspot.com/Appointment/', formData, {
//                 headers: { Authorization: `${token}` }
//             });

//             setSuccess(true);
//             setFormData({
//                 fullName: '',
//                 email: '',
//                 phone: '',
//                 courseBranch: '',
//                 yearOfStudy: '',
//                 mentorDomain: '',
//                 appointmentDate: '',
//                 query: ''
//             });

//             // Redirect to dashboard after 2 seconds
//             setTimeout(() => {
//                 navigate('/appointments');
//             }, 2000);

//         } catch (error) {
//             setError(error.response?.data?.message || 'An error occurred while booking the appointment');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     return (
//         <div className="max-w-2xl mx-auto p-6">
//             <h1 className="text-2xl font-bold mb-6">Book Your Mentorship Session</h1>

//             {success && (
//                 <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//                     Appointment booked successfully! Redirecting to dashboard...
//                 </div>
//             )}

//             {error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                     {error}
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label className="block mb-1">Full Name</label>
//                     <input
//                         type="text"
//                         name="fullName"
//                         value={formData.fullName}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border rounded"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1">Email Address</label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border rounded"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1">Phone Number</label>
//                     <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border rounded"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1">Course / Branch</label>
//                     <input
//                         type="text"
//                         name="courseBranch"
//                         value={formData.courseBranch}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border rounded"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1">Year of Study</label>
//                     <select
//                         name="yearOfStudy"
//                         value={formData.yearOfStudy}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border rounded"
//                         required
//                     >
//                         <option value="">Select Year</option>
//                         <option value="1">1st Year</option>
//                         <option value="2">2nd Year</option>
//                         <option value="3">3rd Year</option>
//                         <option value="4">4th Year</option>
//                     </select>
//                 </div>

//                 <div>
//                     <label className="block mb-1">Mentor Domain</label>
//                     <select
//                         name="mentorDomain"
//                         value={formData.mentorDomain}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border rounded"
//                         required
//                     >
//                         <option value="">Select Domain</option>
//                         <option value="Web Development">Web Development</option>
//                         <option value="Mobile Development">Mobile Development</option>
//                         <option value="Data Science">Data Science</option>
//                         <option value="Machine Learning">Machine Learning</option>
//                         <option value="Cloud Computing">Cloud Computing</option>
//                     </select>
//                 </div>

//                 <div>
//                     <label className="block mb-1">Appointment Date & Time</label>
//                     <input
//                         type="datetime-local"
//                         name="appointmentDate"
//                         value={formData.appointmentDate}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border rounded"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1">Brief Query / What do you need help with?</label>
//                     <textarea
//                         name="query"
//                         value={formData.query}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border rounded h-32 resize-none"
//                         required
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className={`w-full py-2 px-4 rounded transition-colors ${loading
//                             ? 'bg-gray-400 cursor-not-allowed'
//                             : 'bg-green-500 hover:bg-green-600 text-white'
//                         }`}
//                 >
//                     {loading ? 'Booking...' : 'Book Mentorship Session'}
//                 </button>
//             </form>

//             {/* Close button if form submitted successfully */}
//             {success && (
//                 <button
//                     onClick={() => navigate('/appointments')}
//                     className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
//                 >
//                     Go to Dashboard
//                 </button>
//             )}
//         </div>
//     );
// };

// export default AppointmentForm;