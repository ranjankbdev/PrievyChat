import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages.jsx';
import ChatInput from './ChatInput';
import { useChat } from '../../contexts/ChatContext.jsx';
import './ChatContainer.css';

function ChatContainer() {
  const { selectedChat } = useChat();
  return (
    <>
      <div className="chat-container d-flex justify-content-center align-items-center flex-column flex-grow-1 px-3">
        {selectedChat ? (
          <>
            <ChatHeader />
            <ChatMessages />
            <ChatInput />
          </>
        ) : (
          <div>
            <h3>Hi ! Welcome to Prievy-Chat App.</h3>
            <p>Click / Search a user/group to start chatting</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ChatContainer;
