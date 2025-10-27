import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/'; // Replace with your Django API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = (userData: any) => api.post('register/', userData);
export const loginUser = (userData: any) => api.post('login/', userData);
export const logoutUser = () => api.post('logout/');
export const getCandidates = () => api.get('candidates/');
export const castVote = (candidateId: number) => api.post('vote/', { candidate: candidateId });
export const getResults = () => api.get('results/');

export default api;
