import { useState, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext.jsx';
import { sendMessage, fetchChatMessages } from '../../services/messageService.js';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages.jsx';
import ChatInput from './ChatInput';
import showToast from '../../utils/toastHelper.js';
import './ChatContainer.css';

function ChatContainer() {
  const { selectedChat } = useChat();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // fetch messages when chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      try {
        setLoading(true);
        const data = await fetchChatMessages(selectedChat._id);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        showToast(error, 'error');
      } finally {
        setLoading(false);
      }
    };

    if (selectedChat) {
      fetchMessages();
      setNewMessage('');
    }
  }, [selectedChat]);

  // send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat?._id) return;

    try {
      const data = await sendMessage(newMessage.trim(), selectedChat._id);
      setMessages((prev) => [...prev, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      showToast(error, 'error');
    }
  };

  // handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && newMessage.trim()) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container px-3">
      {selectedChat ? (
        <>
          <ChatHeader />
          <ChatMessages loading={loading} messages={messages} />
          <ChatInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleKeyPress={handleKeyPress}
            handleSendMessage={handleSendMessage}
          />
        </>
      ) : (
        <div className="text-center">
          <h3>Hi! Welcome to Prievy-Chat App.</h3>
          <p>Click / Search a user/group to start chatting</p>
        </div>
      )}
    </div>
  );
}

export default ChatContainer;
