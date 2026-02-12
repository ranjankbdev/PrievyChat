import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useChat } from '../../contexts/ChatContext.jsx';
import { searchUsers, uploadProfileImage } from '../../services/userService.js';
import {
  removeUserFromGroup,
  renameGroup,
  addUserToGroup,
  updateGroupPicture,
} from '../../services/chatService.js';
import useImagePicker from '../../hooks/useImagePicker.js';
import useClickOutside from '../../hooks/useClickOutside.js';
import UserChip from '../../components/user/UserChip.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ProfilePicUploader from '../common/ProfilePicUploader.jsx';
import Avatar from '../user/Avatar.jsx';
import Spinner from '../common/Spinner.jsx';
import showToast from '../../utils/toastHelper.js';

function GroupSettingsModal({ show, setShow, groupChat }) {
  const { currentUser } = useAuth();
  const { selectedChat, setSelectedChat, setChats, setFetchAgain } = useChat();

  const containerRef = useRef(null);

  const [loadingState, setLoadingState] = useState({
    search: false,
    addUser: false,
    removeUser: false,
    rename: false,
    picture: false,
  });

  const [groupChatName, setGroupChatName] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [previewPicture, setPreviewPicture] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const setLoading = useCallback((key, value) => {
    setLoadingState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const { handleImageSelection, clearImage } = useImagePicker(
    setSelectedPicture,
    setPreviewPicture
  );

  const isAdmin = selectedChat?.groupAdmin?._id === currentUser._id;
  const displayPicture = previewPicture || selectedChat?.picture || '';

  // reset state when modal closes
  const handleClose = useCallback(() => {
    setShow(false);
    setSearch('');
    setSearchResult([]);
    setHasSearched(false);
    setGroupChatName('');
    clearImage();
  }, [setShow, clearImage]);

  useClickOutside(containerRef, handleClose, show);

  // don't render if modal hidden
  if (!show) return null;

  const updateChatState = (data) => {
    setSelectedChat(data);
    setChats((prev) => prev.map((c) => (c._id === data._id ? data : c)));
    setFetchAgain((prev) => !prev);
  };

  // rename group chat name
  const handleRename = async () => {
    if (!groupChatName) {
      showToast('Group name cannot be empty!', 'warn');
      return;
    }

    try {
      setLoading('rename', true);
      const data = await renameGroup(selectedChat._id, groupChatName);
      updateChatState(data);
      showToast('Group name updated!', 'success');
      setGroupChatName('');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading('rename', false);
    }
  };

  // remove user from group
  const handleRemove = async (removeUser) => {
    if (selectedChat?.groupAdmin?._id !== currentUser._id && removeUser._id !== currentUser._id) {
      showToast('Only admins can remove users!', 'error');
      return;
    }

    try {
      setLoading('removeUser', true);
      const data = await removeUserFromGroup(selectedChat._id, removeUser._id);
      if (removeUser._id === currentUser._id) {
        // user left the group - close modal and clear selection
        setSelectedChat(null);
        handleClose();
        showToast('You left the group!', 'info');
      } else {
        setSelectedChat(data);
        setFetchAgain((prev) => !prev);
        showToast('User removed successfully!', 'success');
      }
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading('removeUser', false);
    }
  };

  // add user to group
  const handleAddUser = async (addUser) => {
    if (selectedChat?.users.find((u) => u._id === addUser._id)) {
      showToast('User already in group!', 'warn');
      return;
    }
    if (selectedChat?.groupAdmin?._id !== currentUser._id) {
      showToast('Only admins can add someone!', 'error');
      return;
    }
    try {
      setLoading('addUser', true);
      const data = await addUserToGroup(selectedChat._id, addUser._id);
      updateChatState(data);
      showToast('User added successfully!', 'success');
      setSearchResult([]);
      setSearch('');
      setHasSearched(false);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading('addUser', false);
    }
  };

  // search the user
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query.trim()) {
      setSearchResult([]);
      setHasSearched(false);
      return;
    }

    try {
      setHasSearched(true);
      setLoading('search', true);
      const users = await searchUsers(query);
      setSearchResult(users);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading('search', false);
    }
  };

  // update picture
  const handlePictureUpload = async () => {
    if (!selectedPicture) {
      showToast('Please select a picture first!', 'warn');
      return;
    }

    try {
      setLoading('picture', true);
      const uploadedImageUrl = await uploadProfileImage(selectedPicture);
      const data = await updateGroupPicture(selectedChat._id, uploadedImageUrl);
      updateChatState(data);
      clearImage();
      showToast('Group picture updated!', 'success');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading('picture', false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="position-fixed top-50 start-50 translate-middle px-md-4 w-100"
        style={{ zIndex: 1055, minWidth: '320px', maxWidth: '570px' }}
      >
        <div ref={containerRef} className="glass-bg rounded px-4 m-2 pt-3">
          {/* Header */}
          <div className="d-flex align-items-center border-bottom border-secondary pb-1">
            <h5 className="modal-title text-white mb-2">{groupChat?.chatName}</h5>
            <button
              type="button"
              className="btn-close ms-auto close-btn-hover mb-2 p-2"
              onClick={handleClose}
            />
          </div>

          <div className="d-flex mt-2">
            {/* LEFT SIDE - GROUP PICTURE */}
            <div className="me-2 d-flex flex-column align-items-center">
              <ProfilePicUploader
                preview={displayPicture}
                onImageChange={handleImageSelection}
                disabled={loadingState.picture || !isAdmin}
                size={130}
                showLabel={isAdmin}
                className="m-1"
              />

              {isAdmin && selectedPicture && (
                <button
                  onClick={handlePictureUpload}
                  className="btn-primary-custom w-100 mb-2 position-relative"
                  disabled={loadingState.picture || !isAdmin}
                >
                  <span style={{ visibility: loadingState.picture ? 'hidden' : 'visible' }}>
                    Upload
                  </span>
                  {loadingState.picture && <Spinner size="sm" text="Uploading..." />}
                </button>
              )}
            </div>

            {/* RIGHT SIDE - USERS LIST */}
            <div className="flex-grow-1">
              <div
                className="d-flex flex-wrap gap-1 my-2 custom-scrollbar thin-scrollbar"
                style={{ height: '135px', alignContent: 'flex-start' }}
              >
                {selectedChat?.users?.map((u) => (
                  <UserChip key={u._id} user={u} onRemove={handleRemove} className="text-dark" />
                ))}
              </div>
            </div>
          </div>
          {/* INPUTS */}
          <div className="d-flex gap-2 mb-3">
            <input
              disabled={!isAdmin}
              className="form-control"
              placeholder="Rename Chat"
              value={groupChatName || ''}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <button
              className="btn-success-custom w-50 position-relative"
              disabled={loadingState.rename || !isAdmin}
              onClick={handleRename}
            >
              <span style={{ visibility: loadingState.rename ? 'hidden' : 'visible' }}>Update</span>
              {loadingState.rename && <Spinner size="sm" text="Renaming..." />}
            </button>
          </div>

          <input
            disabled={!isAdmin}
            value={search}
            className="form-control mb-3"
            placeholder="Add User to group"
            onChange={(e) => handleSearch(e.target.value)}
          />

          <div
            className={`border-bottom mb-2 border-secondary ${loadingState.search && 'mt-5 pb-4'}`}
          >
            <div
              className="list-group mb-2 position-relative"
              style={{ maxHeight: '100px', minHeight: '50px' }}
            >
              {loadingState.search ? (
                <Spinner
                  text="Searching users..."
                  className="position-absolute start-50 translate-middle-x text-nowrap"
                />
              ) : (
                <ul className="list-group px-4 custom-scrollbar thin-scrollbar">
                  {searchResult.map((user) => (
                    <li key={user._id} className="list-group-item bg-transparent border-0 p-0 pt-1">
                      <div
                        onClick={() => handleAddUser(user)}
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
              {!loadingState.search &&
                hasSearched &&
                searchResult.length === 0 &&
                search.trim() && (
                  <EmptyState
                    variant="inline"
                    message="no users found"
                    icon="fa-solid fa-user-slash"
                  />
                )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="d-flex justify-content-end">
            <button className="btn-danger-custom mb-3" onClick={() => handleRemove(currentUser)}>
              Leave Group
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupSettingsModal;
