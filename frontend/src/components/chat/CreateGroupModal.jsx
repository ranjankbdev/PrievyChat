import { useState, useRef, useCallback } from 'react';
import { useChat } from '../../contexts/ChatContext.jsx';
import { searchUsers } from '../../services/userService.js';
import { createGroupChat } from '../../services/chatService.js';
import { uploadProfileImage } from '../../services/userService.js';
import useImagePicker from '../../hooks/useImagePicker.js';
import useClickOutside from '../../hooks/useClickOutside.js';
import ProfilePicUploader from '../../components/common/ProfilePicUploader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import UserChip from '../../components/user/UserChip.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import showToast from '../../utils/toastHelper.js';
import Avatar from '../user/Avatar.jsx';

function CreateGroupModal({ showGroup, setShowGroup }) {
  // don't render if modal hidden
  if (!showGroup) return null;

  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [previewPicture, setPreviewPicture] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { setChats, setSelectedChat } = useChat();

  const { handleImageSelection, clearImage } = useImagePicker(
    setSelectedPicture,
    setPreviewPicture
  );

  const modalRef = useRef(null);

  const resetModal = () => {
    setGroupChatName('');
    setSelectedUsers([]);
    setSearch('');
    setSearchResult([]);
    setHasSearched(false);
    setSubmitLoading(false);
    setShowGroup(false);
    clearImage();
  };

  const handleClose = useCallback(() => {
    resetModal();
  }, [setShowGroup, clearImage]);

  useClickOutside(modalRef, handleClose, showGroup);

  // search user
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResult([]);
      setHasSearched(false);
      return;
    }

    try {
      setHasSearched(true);
      setLoading(true);
      const users = await searchUsers(query);
      setSearchResult(users);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  // add user to group
  const handleAdd = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      showToast('User already selected!', 'warn');
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    setSearch('');
    setSearchResult([]);
    setHasSearched(false);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== delUser._id));
  };

  // submit for creating a new group chat
  const handleSubmit = async () => {
    if (!groupChatName.trim() || selectedUsers.length === 0) {
      showToast('All fields are required!', 'warn');
      return;
    }

    try {
      setSubmitLoading(true);
      let groupPictureUrl = '';
      if (selectedPicture) {
        groupPictureUrl = await uploadProfileImage(selectedPicture);
      }

      const payload = {
        name: groupChatName.trim(),
        users: selectedUsers.map((u) => u._id),
        picture: groupPictureUrl,
      };
      const newChat = await createGroupChat(payload);
      setChats((prev) => [newChat, ...prev]);
      setSelectedChat(newChat);
      showToast('New Group Chat Created!', 'success');
      resetModal();
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="w-100 position-fixed top-50 start-50 translate-middle m-0 p-0 ms-md-5"
        style={{ zIndex: 1055 }}
      >
        <div
          ref={modalRef}
          style={{ maxWidth: '28vw', minWidth: '350px' }}
          className="mx-auto modal-content glass-bg border-0 shadow-lg rounded px-4 pt-3 "
        >
          {/* Header */}
          <div className="d-flex align-items-center border-bottom border-secondary pb-1 position-relative">
            <h4 className="modal-title text-white ms-2 mb-2">Create Group Chat</h4>
            <button
              type="button"
              className="btn-close ms-auto close-btn-hover mb-2 p-2"
              onClick={handleClose}
            />
          </div>

          {/* Body */}
          <div className="d-flex px-1 mt-3">
            <ProfilePicUploader
              preview={previewPicture}
              onImageChange={handleImageSelection}
              className="m-2"
            />

            <div className="flex-grow-1 mt-5 ms-3">
              <input
                className="form-control mb-3"
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <input
                className="form-control"
                placeholder="Add Users"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Selected users */}
          <div
            className="d-flex flex-wrap gap-1 mb-4 custom-scrollbar thin-scrollbar mx-4"
            style={{ height: '75px', alignContent: 'flex-start' }}
          >
            {selectedUsers.map((u) => (
              <UserChip key={u._id} user={u} onRemove={handleDelete} className="text-dark" />
            ))}
          </div>

          {/* Results */}
          <div
            className="list-group grp-search-results mb-1 mx-4 position-relative"
            style={{
              height: searchResult.length > 0 ? '100px' : '50px',
            }}
          >
            {loading ? (
              <Spinner text="Searching users..." className=" ms-5" />
            ) : (
              <ul className="list-group px-4 custom-scrollbar thin-scrollbar">
                {searchResult.map((user) => (
                  <li key={user._id} className="list-group-item bg-transparent border-0 p-0 pt-1">
                    <div
                      onClick={() => handleAdd(user)}
                      className="d-flex align-items-center border border-light rounded-3 p-2 search-list cursor-pointer"
                    >
                      <Avatar src={user.picture} size={40} className="me-3" />
                      <div className="d-flex flex-column">
                        <span className="fw-semibold text-white">{user.name}</span>
                        <span className="small text-white-50">{user.email}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {!loading && hasSearched && !searchResult.length && (
              <EmptyState message="No users found" icon="fa-solid fa-user-slash" />
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer border-top border-secondary p-0">
            <button
              className="btn-primary-custom w-100 position-relative my-3"
              onClick={handleSubmit}
              disabled={submitLoading}
            >
              <span style={{ visibility: submitLoading ? 'hidden' : 'visible' }}>Create Chat</span>
              {submitLoading && <Spinner size="sm" text="Creating..." />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateGroupModal;
