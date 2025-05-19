import axios from 'axios';

// Backend base URL
//const REACT_APP_BACKEND_URL = 'https://gym-server-k6k4.onrender.com';
const REACT_APP_BACKEND_URL = 'https://gym-server-k6k4.onrender.com/api';

// Member API calls
export const getMembers = async () => {
  try {
    const response = await axios.get(`${REACT_APP_BACKEND_URL}/members`);
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error.response?.data || error.message);
    throw error;
  }
};

export const getMemberById = async (id) => {
  try {
    const response = await axios.get(`${REACT_APP_BACKEND_URL}/members/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching member with id ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const createMember = async (memberData) => {
  try {
    const response = await axios.post(`${REACT_APP_BACKEND_URL}/members`, memberData);
    return response.data;
  } catch (error) {
    console.error('Error creating member:', error.response?.data || error.message);
    throw error;
  }
};

export const updateMember = async (id, memberData) => {
  try {
    const response = await axios.put(`${REACT_APP_BACKEND_URL}/members/${id}`, memberData);
    return response.data;
  } catch (error) {
    console.error(`Error updating member with id ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteMember = async (id) => {
  try {
    const response = await axios.delete(`${REACT_APP_BACKEND_URL}/members/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting member with id ${id}:`, error.response?.data || error.message);
    throw error;
  }
};
