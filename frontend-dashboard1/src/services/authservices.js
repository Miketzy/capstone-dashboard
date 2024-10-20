// src/service1/authservices.js
import axios from 'axios';

export const register = async (userData) => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error registering user');
  }
};
