import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from '../../utils/toastHelper.js';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // stricter email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignup = (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Define all validations
    const validations = [
      {
        condition: !email || !password || !confirmPassword,
        message: 'Please fill all required fields!',
      },
      {
        condition: !emailRegex.test(email),
        message: 'Please enter a valid email address!',
      },
      {
        condition: password !== confirmPassword,
        message: 'Passwords do not match!',
      },
      {
        condition: password.length < 6,
        message: 'Password must be at least 6 characters!',
      },
    ];

    // Run validations
    for (let v of validations) {
      if (v.condition) {
        showToast(v.message, 'error');
        return;
      }
    }

    setIsSubmitting(true);

    // store user data temporarily
    const tempUser = {
      email: email.trim(),
      password: password,
    };

    localStorage.setItem('tempSignupData', JSON.stringify(tempUser));
    showToast('Proceeding to profile setup…', 'success');
    navigate('/profile-setup');

    // Clear form state
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="d-flex flex-column align-items-center text-white">
      <form autoComplete="off" onSubmit={handleSignup} noValidate>
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
            onChange={(e) => setEmail(e.target.value.trimStart())}
          />
        </div>

        <div className="mb-3">
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
              style={{ width: '68px' }}
              className="btn border-start-0 show-password-hover"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="confirmPassword" className="form-label text-white">
            Confirm Password <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <input
              autoComplete="new-password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm your password"
              required
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ width: '68px' }}
              type="button"
              className="btn show-password-hover border-start-0"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="btn btn-primary-custom mb-1 text-center w-100"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Signup;
