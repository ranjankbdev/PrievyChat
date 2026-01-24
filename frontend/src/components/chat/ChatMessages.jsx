import { FadeLoader } from 'react-spinners';
import MessageScrollView from './MessageScrollView.jsx';
import './ChatMessages.css';

function ChatMessages({ loading, messages }) {
  return (
    <div className="chatmessage-background">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <FadeLoader color="#38B2AC" size={150} />
        </div>
      ) : (
        <div className="custom-scrollbar flex-grow-1 d-flex flex-column">
          <MessageScrollView messages={messages} />
        </div>
      )}
    </div>
  );
}

export default ChatMessages;
