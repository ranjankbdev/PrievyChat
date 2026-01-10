import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useChat } from '../../contexts/ChatContext.jsx';
import { fetchChatsService } from '../../services/chatService.js';
import { getSenderData } from '../../utils/chatHelper.js';
import showToast from '../../utils/toastHelper.js';
import EmptyState from '../common/EmptyState.jsx';
import Avatar from '../user/Avatar.jsx';
import './ChatList.css';

function ChatList() {
  const { currentUser } = useAuth();
  const { chats, setChats, selectedChat, setSelectedChat, fetchAgain } = useChat();

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
    <div className="chat-list-container h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center ms-4">
        <p className="fs-2">My Chats</p>
        <button className="btn-icon-custom d-flex justify-content-center mt-2 me-2">
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
          <div className="d-flex flex-column custom-scrollbar px-2 py-1 chat-list-height">
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
                  className={`rounded d-flex align-items-center flex-shrink-0 chat-list-item cursor-pointer mb-2 p-2 ps-3 ${
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
    </div>
  );
}

export default ChatList;
