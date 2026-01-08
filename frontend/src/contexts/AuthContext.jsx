import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import axiosInstance from '../config/axiosInstance.js';
import showToast from '../utils/toastHelper.js';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // current logged-in userInfo
  const [currentUser, setCurrentUser] = useState(null);

  // displays loading screen while checking login state
  const [userLoading, setUserLoading] = useState(true);

  const navigate = useNavigate();

  // fetch user data with token
  const fetchUser = async (token) => {
    try {
      setUserLoading(true);
      const res = await axiosInstance.get('/users/me');
      setCurrentUser({ ...res.data, token });
    } catch (err) {
      console.error('Error fetching user data:', err);
      showToast('Session expired. Please login again.', 'error');
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/');
    } finally {
      setUserLoading(false);
    }
  };

  // run on mount to fetch user if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUser(token);
    else setUserLoading(false);
  }, []);

  // store token and fetch user immediately
  const authenticateUser = async (token) => {
    localStorage.setItem('token', token);
    await fetchUser(token);
  };

  // update user profile locally without refetching
  const updateUserProfile = (updatedData) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedData }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
  };

  // memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ currentUser, userLoading, authenticateUser, updateUserProfile, handleLogout }),
    [currentUser, userLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {userLoading ? (
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
