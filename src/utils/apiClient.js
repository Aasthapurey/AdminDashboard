import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://coderhouse-448820.el.r.appspot.com/',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  },
});

export default apiClient;
