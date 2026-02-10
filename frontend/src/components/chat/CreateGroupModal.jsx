import { useState, useRef } from 'react';
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

  const handleImageChange = useImagePicker(setSelectedPicture, setPreviewPicture);

  const modalRef = useRef(null);

  const handleClose = () => {
    setShowGroup(false);
  };

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
  const handleGroup = (userToAdd) => {
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
      setShowGroup(false);
      showToast('New Group Chat Created!', 'success');
      // reset all local states
      setGroupChatName('');
      setSelectedUsers([]);
      setSearch('');
      setSearchResult([]);
      if (previewPicture && previewPicture.startsWith('blob:')) {
        URL.revokeObjectURL(previewPicture);
      }
      setPreviewPicture('');
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
        ref={modalRef}
        className="position-fixed top-50 start-50 translate-middle grp-modal"
        style={{ zIndex: 1055, minWidth: '570px' }}
      >
        <div className="glass-bg rounded px-4 m-2 pt-3">
          {/* Header */}
          <div className="d-flex align-items-center border-bottom border-secondary pb-1 position-relative">
            <h4 className="modal-title text-white ms-2 mb-2">Create Group Chat</h4>
            <button
              type="button"
              className="btn-close ms-auto close-btn-hover mb-2 p-2"
              onClick={() => setShowGroup(false)}
            />
          </div>

          {/* Body */}
          <div className="d-flex px-1 mt-3">
            <ProfilePicUploader
              preview={previewPicture}
              onImageChange={(file) => handleImageChange(file)}
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
            className="list-group grp-search-results mb-1 mx-4"
            style={{
              height: searchResult.length > 0 ? '100px' : 'auto',
            }}
          >
            {loading ? (
              <Spinner text="Searching users..." className="mt-5 pt-3 ms-5" />
            ) : (
              <ul className="list-group px-4 custom-scrollbar thin-scrollbar">
                {searchResult.map((user) => (
                  <li key={user._id} className="list-group-item bg-transparent border-0 p-0 pt-1">
                    <div
                      onClick={() => handleGroup(user)}
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
