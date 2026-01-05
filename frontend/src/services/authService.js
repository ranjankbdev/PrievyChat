import axiosInstance from '../config/axiosInstance.js';

// Signup
const signupUser = async ({ name, email, password }) => {
  const { data } = await axiosInstance.post('/auth/signup', { name, email, password });
  return data;
};

// Login
const loginUser = async (email, password) => {
  const { data } = await axiosInstance.post('/auth/login', { email, password });
  return data;
};

export { signupUser, loginUser };
