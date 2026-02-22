import { useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';
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
  const { chats, setChats, selectedChat, setSelectedChat, fetchAgain, groupedNotifications } =
    useChat();

  const [showGroupchat, setShowGroupchat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const data = await fetchChatsService();
        setChats(data);
      } catch (error) {
        showToast(error, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [currentUser, fetchAgain]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="chat-list-container">
      <div className="d-flex justify-content-between align-items-center ms-4">
        <p className="fs-3 fw-bold m-0 p-0">My Chats</p>
        <button
          onClick={() => setShowGroupchat(true)}
          className="btn-icon-custom d-flex justify-content-center me-3 mt-2 mb-2"
        >
          <span className="d-inline d-md-none d-xl-inline">New Group Chat</span>
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div className="m-2 mt-0">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '88vh' }}
          >
            <FadeLoader color="white" loading={true} size={150} />
          </div>
        ) : chats.length === 0 ? (
          <div style={{ height: '75vh' }}>
            <EmptyState
              variant="centered"
              message="Search a user to start the chat"
              icon="fa-solid fa-magnifying-glass"
            />
          </div>
        ) : (
          <div className="custom-scrollbar px-2 py-1 chat-list no-scrollbar">
            {chats.map((chat) => {
              if (!chat) return null;
              // get chat display name and user data, notification
              const { name, picture } = getSenderData(currentUser, chat);
              const profilePic = picture || '/avatar.jpg';
              const notifCount = groupedNotifications[chat._id]?.count || 0;

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
                  {notifCount > 0 && (
                    <span className="badge bg-danger rounded-pill d-md-none ms-auto">
                      {notifCount}
                    </span>
                  )}
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
