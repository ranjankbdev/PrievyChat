import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from '../../utils/toastHelper.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { signupUser } from '../../services/authService.js';
import { uploadProfileImage } from '../../services/userService.js';
import useImagePicker from '../../hooks/useImagePicker.js';
import ProfilePicUploader from '../../components/common/ProfilePicUploader.jsx';
import Spinner from '../../components/common/Spinner.jsx';

function ProfileSetup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState('');

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

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // handle image selection
  const handleImageChange = useImagePicker(setPicture, setPreview);

  // save the user details / signup
  const handleSave = async () => {
    if (!email || !password) {
      showToast('Please complete signup before setting up your profile.', 'error');
      return;
    }

    const trimmedName = username.trim();
    if (trimmedName.length < 4) {
      showToast('Username must be at least 4 characters!', 'error');
      return;
    }

    try {
      setLoading(true);
      let uploadedImageUrl = '';

      // upload image ONLY if file selected
      if (picture instanceof File) {
        uploadedImageUrl = await uploadProfileImage(picture);
        console.log(uploadedImageUrl);
      }
      const data = await signupUser({
        name: trimmedName,
        email,
        password,
        picture: uploadedImageUrl,
      });
      showToast('Account created successfully!', 'success');
      localStorage.removeItem('tempSignupData');
      authenticateUser(data.token);

      // Clear state
      setEmail('');
      setPassword('');
      setUsername('');
      setPicture(null);
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      navigate('/chats');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
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
              className="btn px-2 py-1 position-absolute pt-2 profile-back-hover text-light-gray"
              onClick={handleBack}
            >
              <i className="fa-solid fa-arrow-left fs-4"></i>
            </button>

            {/* center title */}
            <h5 className="w-100 text-center text-white m-0">Set Up Your Profile</h5>
          </div>

          <div className="d-flex">
            {/* profile image container */}

            <ProfilePicUploader
              preview={preview}
              onImageChange={(file) => handleImageChange(file, preview)}
              className="m-2"
            />

            {/* input Fields */}
            <div className="d-flex flex-column justify-content-center mt-3">
              <input value={email} type="text" disabled className="form-control mb-3 w-100" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Enter your name"
                className="form-control w-100"
              />
            </div>
          </div>

          {/* save the user button */}
          <button
            disabled={loading}
            onClick={handleSave}
            className="mt-5 btn-primary-custom w-100 position-relative"
          >
            <span style={{ visibility: loading ? 'hidden' : 'visible' }}>Save Changes</span>
            {loading && <Spinner size="sm" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
