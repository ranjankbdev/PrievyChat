import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from '../../utils/toastHelper.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { signupUser } from '../../services/authService.js';

function ProfileSetup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const { authenticateUser } = useAuth();

  const navigate = useNavigate();

  // useeffect for restoring the email and password
  useEffect(() => {
    const temp = JSON.parse(localStorage.getItem('tempSignupData'));
    if (!temp) {
      return;
    }
    setEmail(temp.email);
    setPassword(temp.password);
  }, []);

  // save the user details / signup
  const handleSave = async () => {
    const trimmedName = username.trim();

    if (trimmedName.length < 4) {
      showToast('Username must be at least 4 characters!', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await signupUser({ name: trimmedName, email, password });
      showToast('Account created successfully!', 'success');
      localStorage.removeItem('tempSignupData');
      authenticateUser(data.token);

      // Clear state
      setEmail('');
      setPassword('');
      setUsername('');
      navigate('/chats');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    localStorage.removeItem('tempSignupData');
    navigate('/', { replace: true });
  };

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 p-3">
          <div className="d-flex align-items-center mb-3 position-relative border-bottom border-secondary pb-3">
            {/* back button */}
            <button
              className="btn px-2 py-1 position-absolute pt-2 profile-back-hover"
              style={{ color: '#cbc6c6ff' }}
              onClick={handleBack}
            >
              <i className="fa-solid fa-arrow-left fs-4"></i>
            </button>

            {/* center title */}
            <h5 className="w-100 text-center text-white m-0">Set Up Your Profile</h5>
          </div>

          <div className="d-flex">
            {/* profile image container */}

            <div></div>

            {/* input Fields */}
            <div className="d-flex flex-column justify-content-center mt-3">
              <input value={email} type="text" disabled className="form-control mb-3 w-100" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.trimStart())}
                type="text"
                placeholder="Enter your name"
                className="form-control w-100"
              />
            </div>
          </div>

          {/* save the user button */}
          <button disabled={loading} onClick={handleSave} className="btn mt-5 btn-primary w-100">
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
