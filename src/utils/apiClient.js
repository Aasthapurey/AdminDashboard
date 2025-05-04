import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://coderhouse-x1yv.onrender.com/',
  headers: {
    Authorization: `${localStorage.getItem('authToken')}`,
  },
});

export default apiClient;
