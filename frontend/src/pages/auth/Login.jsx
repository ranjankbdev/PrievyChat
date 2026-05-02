import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from '../../utils/toastHelper.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { loginUser } from '../../services/authService.js';
import Spinner from '../../components/common/Spinner.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { authenticateUser } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // basic validation
    if (!email.trim() || !password.trim()) {
      showToast('All fields are required!', 'warn');
      return;
    }
    if (!email.includes('@')) {
      showToast('Please enter a valid email address!', 'warn');
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password);
      showToast('Login successful!', 'success');
      await authenticateUser();
      navigate('/chats');
      setEmail('');
      setPassword('');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center w-100">
      <form autoComplete="off" onSubmit={handleLogin} noValidate className="w-100">
        <div className="mb-3">
          <label htmlFor="email" className="form-label text-white">
            Email address <span className="text-danger">*</span>
          </label>
          <input
            autoComplete="off"
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="password" className="form-label text-white">
            Password <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <input
              autoComplete="new-password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="btn show-password-hover border-start-0 text-white"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="text-end mb-4">
          <span onClick={() => navigate('/forgot-password')} className="text-white-50 small forgot-password-btn cursor-pointer">
            Forgot Password ?
          </span>
        </div>

        <button disabled={loading} className="btn-primary-custom mb-4 w-100 position-relative">
          <span style={{ visibility: loading ? 'hidden' : 'visible' }}>Login</span>
          {loading && <Spinner size="sm" />}
        </button>
      </form>

      <button
        onClick={() => {
          setEmail('ripu@gmail.com');
          setPassword('123456');
        }}
        type="button"
        className="btn-guest-custom mb-4 w-100 text-center"
      >
        Get Guest User Credentials
      </button>
    </div>
  );
};
export default Login;
