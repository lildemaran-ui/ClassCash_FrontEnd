import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api' // O /api que definido no backend
});

export default api;