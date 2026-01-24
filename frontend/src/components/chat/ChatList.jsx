import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useChat } from '../../contexts/ChatContext.jsx';
import { fetchChatsService } from '../../services/chatService.js';
import { getSenderData } from '../../utils/chatHelper.js';
import showToast from '../../utils/toastHelper.js';
import EmptyState from '../common/EmptyState.jsx';
import Avatar from '../user/Avatar.jsx';
import CreateGroupModal from './CreateGroupModal.jsx';
import './ChatList.css';

function ChatList() {
  const { currentUser } = useAuth();
  const { chats, setChats, selectedChat, setSelectedChat, fetchAgain } = useChat();

  const [showGroupchat, setShowGroupchat] = useState(false);

  // handle chat selection
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await fetchChatsService();
        setChats(data);
      } catch (error) {
        showToast(error, 'error');
      }
    };
    fetchChats();
  }, [currentUser, fetchAgain]);

  return (
    <div className="chat-list-container">
      <div className="d-flex justify-content-between align-items-center ms-4">
        <p className="fs-2">My Chats</p>
        <button
          onClick={() => setShowGroupchat(true)}
          className="btn-icon-custom d-flex justify-content-center mt-2 me-2"
        >
          <span>New Group Chat</span>
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div className="m-2">
        {chats.length === 0 ? (
          <EmptyState
            variant="centered"
            message="Search a user to start the chat"
            icon="fa-solid fa-magnifying-glass"
          />
        ) : (
          <div className="custom-scrollbar px-2 py-1 chat-list">
            {chats.map((chat) => {
              if (!chat || !chat.users) return null;

              // get chat display name and user data
              const { name, user } = getSenderData(
                currentUser,
                chat.users,
                chat.isGroupChat,
                chat.chatName
              );

              // get profile picture
              const profilePic = chat.isGroupChat
                ? chat.picture || '/avatar.jpg'
                : user?.picture || '/avatar.jpg';

              return (
                <div
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  className={`rounded chat-list-item mb-2 p-2 ps-3 ${
                    selectedChat?._id === chat._id ? 'active-chat' : ''
                  }`}
                >
                  <Avatar src={profilePic} size={55} className={'my-1'} />
                  <span className="fw-semibold fs-5 ms-2">{name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showGroupchat && (
        <CreateGroupModal showGroup={showGroupchat} setShowGroup={setShowGroupchat} />
      )}
    </div>
  );
}

export default ChatList;
