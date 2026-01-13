import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { uploadProfileImage, updateUserProfileAPI } from '../../services/userService.js';
import Avatar from './Avatar.jsx';
import ProfilePicUploader from '../../components/common/ProfilePicUploader.jsx';
import useImagePicker from '../../hooks/useImagePicker.js';
import Spinner from '../../components/common/Spinner.jsx';
import showToast from '../../utils/toastHelper.js';
import './ProfileModal.css';

const ProfileModal = ({ show, setShow, user }) => {
  const { currentUser, updateUserProfile } = useAuth();

  // determine if viewing own profile or another user's profile
  const isOwnProfile = !user || user._id === currentUser._id;
  const profileUser = isOwnProfile ? currentUser : user;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profileUser?.name || '');
  const [preview, setPreview] = useState(profileUser?.picture || '');
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(false);

  // custom hook to handle image selection and preview
  const handleImageChange = useImagePicker(setPicture, setPreview);

  if (!show) return null; // do not render modal if hidden

  // save profile changes (name and/or picture)
  const handleUpdate = async () => {
    if (!name.trim()) {
      showToast('Name cannot be empty!', 'error');
      return;
    }

    const isNameChanged = name.trim() !== currentUser.name;
    const isPictureChanged = picture instanceof File;

    if (!isNameChanged && !isPictureChanged) {
      showToast('No changes made!', 'info');
      return;
    }

    try {
      setLoading(true);
      const payload = {};
      if (isNameChanged) payload.name = name.trim();
      if (isPictureChanged) payload.picture = await uploadProfileImage(picture);

      await updateUserProfileAPI(payload); // persist changes to backend
      updateUserProfile(payload); // update context/state
      if (payload.picture) setPreview(payload.picture);

      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
      setPicture(null);
      setName(name.trim());
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  // close modal and reset edit state
  const handleClose = () => {
    setShow(false);
    handleCancel();
  };

  // cancel edit and reset form to original values
  const handleCancel = () => {
    setIsEditing(false);
    setName(profileUser?.name || '');
    setPreview(profileUser?.picture || '');
    setPicture(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* Click-away overlay */}
      <div onClick={handleClose} className="click-away-overlay" style={{ zIndex: '1050' }} />
      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        style={{ zIndex: '1055' }}
        onClick={handleClose}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content glass-bg border-0 shadow-lg">
            {/* Header */}
            <div className="modal-header py-3">
              <h5 className="modal-title text-center ms-2 text-white">{profileUser?.name}</h5>
              <button
                onClick={handleClose}
                type="button"
                aria-label="Close profile modal"
                className="btn-close close-btn-hover"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body text-center">
              {isEditing && isOwnProfile ? (
                <>
                  {/* edit mode: profile picture uploader + name input */}
                  <ProfilePicUploader
                    className="d-flex flex-column align-items-center m-2"
                    preview={preview}
                    size={150}
                    onImageChange={(file) => handleImageChange(file)}
                  />

                  <input
                    type="text"
                    className="form-control mb-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <input value={currentUser?.email} type="text" disabled className="form-control" />
                </>
              ) : (
                <>
                  {/* view mode: avatar + user info */}
                  <Avatar src={profileUser?.picture} size={150} className={'mb-3'} />
                  <h4 className="fw-bold mb-1 text-white">{profileUser?.name}</h4>
                  <p className="text-white">{profileUser?.email}</p>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 d-flex justify-content-between">
              {/* view mode: edit profile / close */}
              {!isEditing && (
                <>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-secondary-custom px-4"
                    >
                      Edit Profile
                    </button>
                  )}

                  <button onClick={() => setShow(false)} className="ms-auto px-5 btn-ghost-custom">
                    Close
                  </button>
                </>
              )}

              {/* edit mode: cancel / save changes */}
              {isEditing && (
                <>
                  <button
                    disabled={loading}
                    onClick={handleUpdate}
                    className="btn-success-custom position-relative"
                  >
                    <span style={{ visibility: loading ? 'hidden' : 'visible' }}>Save Changes</span>
                    {loading && <Spinner size="sm" text="Saving..." />}
                  </button>
                  <button
                    disabled={loading}
                    onClick={handleCancel}
                    className="btn-ghost-custom px-5"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
