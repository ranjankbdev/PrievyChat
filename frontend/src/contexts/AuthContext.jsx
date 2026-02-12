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

  // fetch user data with token
  const fetchUser = useCallback(
    async (token) => {
      try {
        setIsUserLoading(true);
        const res = await axiosInstance.get('/users/me');
        setCurrentUser({ ...res.data, token });
      } catch (err) {
        console.error('Error fetching user data:', err);
        showToast('Session expired. Please login again.', 'error');
        localStorage.removeItem('token');
        setCurrentUser(null);
        navigate('/');
      } finally {
        setIsUserLoading(false);
      }
    },
    [navigate]
  );

  // run on mount to fetch user if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setIsUserLoading(false);
    }
  }, [fetchUser]);

  // store token and fetch user immediately
  const authenticateUser = useCallback(
    async (token) => {
      localStorage.setItem('token', token);
      await fetchUser(token);
    },
    [fetchUser]
  );

  // update user profile locally without refetching
  const updateUserProfile = useCallback((updatedData) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedData }));
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
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
