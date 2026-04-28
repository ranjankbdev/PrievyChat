import axiosInstance from '../config/axiosInstance.js';

// Signup
const signupUser = async ({ name, email, password, picture }) => {
  const { data } = await axiosInstance.post('/auth/signup', { name, email, password, picture });
  return data;
};

// Login
const loginUser = async (email, password) => {
  const { data } = await axiosInstance.post('/auth/login', { email, password });
  return data;
};

// Logout
const logoutUser = async () => {
  const { data } = await axiosInstance.post('/auth/logout');
  return data;
};

export { signupUser, loginUser, logoutUser };
