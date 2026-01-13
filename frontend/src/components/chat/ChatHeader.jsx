import { useState } from 'react';
import { useChat } from '../../contexts/ChatContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getSenderData } from '../../utils/chatHelper.js';
import Avatar from '../../components/user/Avatar.jsx';
import GroupSettingsModal from './GroupSettingsModal.jsx';
import ProfileModal from '../user/ProfileModal.jsx';
import './ChatHeader.css';

function ChatHeader() {
  const { selectedChat } = useChat();
  const { currentUser } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);

  if (!selectedChat) return null;

  // get chat display name and user data
  const { name, user } = getSenderData(
    currentUser,
    selectedChat.users,
    selectedChat.isGroupChat,
    selectedChat.chatName
  );

  // get profile picture
  const profilePic = selectedChat.isGroupChat
    ? selectedChat.picture || '/avatar.jpg'
    : user?.picture || '/avatar.jpg';

  const isGroup = selectedChat.isGroupChat;

  return (
    <>
      <div className="d-flex align-items-center m-1 me-auto">
        {/* Back arrow (mobile) */}
        <span className="p-2 px-3 rounded cursor-pointer back-arrow-hover">
          <i className="fa-solid fa-arrow-left"></i>
        </span>

        {/* chat header */}
        <div
          onClick={() => (isGroup ? setShowGroupSettings(true) : setShowProfile(true))}
          className="d-flex align-items-center cursor-pointer avatar-hover p-1 pe-3"
        >
          <Avatar src={profilePic} size={40} className="me-2 ms-2" />
          <div className="d-flex flex-column">
            <span className="fw-semibold text-white">{name}</span>
            <span className="small text-white-50">Status</span>
          </div>
        </div>
      </div>
      {/* Single Chat Profile */}
      {!isGroup && showProfile && (
        <ProfileModal show={showProfile} setShow={setShowProfile} user={user} />
      )}

      {/* Group Chat Settings */}
      {isGroup && showGroupSettings && (
        <GroupSettingsModal
          show={showGroupSettings}
          setShow={setShowGroupSettings}
          groupChat={selectedChat}
        />
      )}
    </>
  );
}

export default ChatHeader;
