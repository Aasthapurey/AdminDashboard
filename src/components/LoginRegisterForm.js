import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginRegisterForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Set the endpoint based on whether it's a login or register request
      const endpoint = isLogin
        ? 'https://coderhouse-448820.el.r.appspot.com/Admin/login'
        : 'https://coderhouse-448820.el.r.appspot.com/Admin/register';

      // Send a POST request with username and password
      const response = await axios.post(endpoint, { username, password });

      if (isLogin) {
        // Save the token to localStorage after successful login
        localStorage.setItem('authToken', response.data.token);

        // Navigate to the dashboard page after successful login
        navigate('/dashboard');
      } else {
        alert('Account created successfully! Please log in.');
        setIsLogin(true); // Switch to login form after registration
      }
    } catch (error) {
      console.error(error);
      // Set error message based on the response from the backend
      setErrorMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  const toggleForm = () => {
    setIsLogin((prevState) => !prevState); // Toggle between login and register form
    setErrorMessage(''); // Clear any existing error messages
  };

  return (
    <div className="bg-blue-500 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded-md px-4 py-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-md px-4 py-2 w-full"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
            <button
              type="button"
              onClick={toggleForm}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              {isLogin ? 'Create an account' : 'Already have an account?'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegisterForm;
