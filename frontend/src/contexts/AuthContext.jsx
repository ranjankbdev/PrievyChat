import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import axiosInstance from '../config/axiosInstance.js';
import showToast from '../utils/toastHelper.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // current logged-in userInfo
  const [currentUser, setCurrentUser] = useState(null);

  // displays loading screen while checking login state
  const [isUserLoading, setIsUserLoading] = useState(true);

  const navigate = useNavigate();

  // fetch user data
  const fetchUser = useCallback(async () => {
    try {
      setIsUserLoading(true);
      const res = await axiosInstance.get('/users/me');
      setCurrentUser({ ...res.data });
    } catch (err) {
      setCurrentUser(null);
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  // fetch user
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // store token and fetch user immediately
  const authenticateUser = useCallback((userData) => {
    const { token, ...user } = userData;
    localStorage.setItem('token', token);
    setCurrentUser(user);
  }, []);

  // update user profile locally without refetching
  const updateUserProfile = useCallback((updatedData) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedData }));
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      localStorage.removeItem('token');
      setCurrentUser(null);
      showToast('User logged out successfully!', 'success');
      navigate('/');
    } catch (err) {
      showToast('Logout failed!', 'error');
    }
  }, [navigate]);

  const value = { currentUser, authenticateUser, updateUserProfile, handleLogout };

  return (
    <AuthContext.Provider value={value}>
      {isUserLoading ? (
        <div
          style={{ backgroundColor: 'rgba(14, 115, 138, 0.95)' }}
          className="d-flex justify-content-center align-items-center min-vh-100"
        >
          <FadeLoader color="#06343dff" loading={true} size={150} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
