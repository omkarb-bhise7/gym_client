import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Member API calls
export const getMembers = async () => {
  try {
    const response = await axios.get(`${API_URL}/members`);
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

export const getMemberById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/members/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching member with id ${id}:`, error);
    throw error;
  }
};

export const createMember = async (memberData) => {
  try {
    const response = await axios.post(`${API_URL}/members`, memberData);
    return response.data;
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
};

export const updateMember = async (id, memberData) => {
  try {
    const response = await axios.put(`${API_URL}/members/${id}`, memberData);
    return response.data;
  } catch (error) {
    console.error(`Error updating member with id ${id}:`, error);
    throw error;
  }
};

export const deleteMember = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/members/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting member with id ${id}:`, error);
    throw error;
  }
};
