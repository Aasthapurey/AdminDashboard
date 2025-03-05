import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => (
  <div className="bg-white shadow-md mb-6">
    <div className="container mx-auto px-4 py-3">
      <div className="flex space-x-4">
        <Link
          to="/admin"
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Admin Dashboard
        </Link>
        <Link
          to="/appointments"
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Appointment Submission
        </Link>
        <Link
          to="/imagesection"
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Home Page Images
        </Link>
      </div>
    </div>
  </div>
);

export default Navigation;