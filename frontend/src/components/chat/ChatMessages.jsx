import { FadeLoader } from 'react-spinners';
import MessageScrollView from './MessageScrollView.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import './ChatMessages.css';

function ChatMessages({ loading, messages, fileUploading, isTyping }) {
  return (
    <div className="chatmessage-background">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <FadeLoader color="#38B2AC" size={150} />
        </div>
      ) : (
        <div className="custom-scrollbar thin-scrollbar flex-grow-1 d-flex flex-column">
          <div className="flex-grow-1 px-1">
            <MessageScrollView messages={messages} fileUploading={fileUploading} />
          </div>
          {isTyping && <TypingIndicator />}
        </div>
      )}
    </div>
  );
}

export default ChatMessages;
