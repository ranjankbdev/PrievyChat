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

  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [search, setSearch] = useState('');
  const [pictureLoading, setPictureLoading] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [previewPicture, setPreviewPicture] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleImageChange = useImagePicker(setSelectedPicture, setPreviewPicture);

  const isAdmin = selectedChat?.groupAdmin?._id === currentUser._id;
  // select which picture to show
  const displayPicture = previewPicture || selectedChat?.picture || '';

  // reset state when modal closes
  const handleClose = useCallback(() => {
    setShow(false);
    setSearch('');
    setSearchResult([]);
    setHasSearched(false);
    setGroupChatName('');
    setSelectedPicture(null);
    setPreviewPicture('');
  }, [setShow]);

  useClickOutside(containerRef, handleClose, show);

  // don't render if modal hidden
  if (!show) return null;

  // rename group chat name
  const handleRename = async () => {
    if (!groupChatName) {
      showToast('Group name cannot be empty!', 'warn');
      return;
    }
    try {
      setRenameLoading(true);
      const data = await renameGroup(selectedChat._id, groupChatName);
      setSelectedChat(data);
      setChats((prevChats) => prevChats.map((c) => (c._id === data._id ? data : c)));
      setFetchAgain((prev) => !prev);
      showToast('Group name updated!', 'success');
      setGroupChatName('');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setRenameLoading(false);
    }
  };

  // remove user from group
  const handleRemove = async (removeUser) => {
    if (selectedChat?.groupAdmin?._id !== currentUser._id && removeUser._id !== currentUser._id) {
      showToast('Only admins can remove users!', 'error');
      return;
    }

    try {
      setLoading(true);
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
      setLoading(false);
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
      setLoading(true);
      const data = await addUserToGroup(selectedChat._id, addUser._id);
      setSelectedChat(data);
      setChats((prevChats) => prevChats.map((c) => (c._id === data._id ? data : c)));
      setFetchAgain((prev) => !prev);
      showToast('User added successfully!', 'success');
      setSearchResult([]);
      setSearch('');
      setHasSearched(false);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
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
      setLoading(true);
      const users = await searchUsers(query);
      setSearchResult(users);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  // update picture
  const handlePictureUpload = async () => {
    if (!selectedPicture) {
      showToast('Please select a picture first!', 'warn');
      return;
    }

    try {
      setPictureLoading(true);
      const uploadedImageUrl = await uploadProfileImage(selectedPicture);
      const data = await updateGroupPicture(selectedChat._id, uploadedImageUrl);
      setSelectedChat(data);
      setChats((prevChats) => prevChats.map((c) => (c._id === data._id ? data : c)));
      setFetchAgain((prev) => !prev);
      setSelectedPicture(null);
      setPreviewPicture('');
      showToast('Group picture updated!', 'success');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setPictureLoading(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="position-fixed top-50 start-50 translate-middle grp-modal px-md-4"
        style={{ zIndex: 1055, minWidth: '570px' }}
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
                onImageChange={(file) => handleImageChange(file)}
                disabled={pictureLoading || !isAdmin}
                size={130}
                showLabel={isAdmin}
                className="m-1"
              />

              {isAdmin && selectedPicture && (
                <button
                  onClick={handlePictureUpload}
                  className="btn-primary-custom w-100 mb-2 position-relative"
                  disabled={pictureLoading || !isAdmin}
                >
                  <span style={{ visibility: pictureLoading ? 'hidden' : 'visible' }}>Upload</span>
                  {pictureLoading && <Spinner size="sm" text="Uploading..." />}
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
              disabled={renameLoading || !isAdmin}
              onClick={handleRename}
            >
              <span style={{ visibility: renameLoading ? 'hidden' : 'visible' }}>Update</span>
              {renameLoading && <Spinner size="sm" text="Renaming..." />}
            </button>
          </div>

          <input
            disabled={!isAdmin}
            value={search}
            className="form-control mb-3"
            placeholder="Add User to group"
            onChange={(e) => handleSearch(e.target.value)}
          />

          <div className={`border-bottom mb-2 border-secondary ${loading && 'mt-5 pb-4'}`}>
            <div className="list-group mb-2 position-relative">
              {loading ? (
                <Spinner textPosition="left" text="Searching users..." />
              ) : (
                <ul
                  className="list-group px-4 custom-scrollbar thin-scrollbar"
                  style={{ maxHeight: '100px', minHeight: '50px' }}
                >
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
              {!loading && hasSearched && searchResult.length === 0 && search.trim() && (
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
