import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // The base URL of our NestJS backend
});

// We will add an interceptor here later to automatically add the JWT to requests.

export default api;
