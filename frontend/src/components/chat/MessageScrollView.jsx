import { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  isMessageFromDifferentSender,
  isFinalMessage,
  isPreviousMessageSameUser,
} from '../../utils/chatHelper.js';
import EmptyState from '../common/EmptyState.jsx';
import Avatar from '../user/Avatar.jsx';
import './MessageScrollView.css';

function MessageScrollView({ messages }) {
  const { currentUser } = useAuth();
  const scrollRef = useRef();

  // auto scroll to bottom when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  return (
    <div className="mx-2 h-100 d-flex flex-column">
      <div className="d-flex flex-column flex-grow-1 justify-content-end">
        {/* If no messages, show placeholder at bottom */}
        {(!messages || messages.length === 0) && (
          <div className="mt-auto d-flex justify-content-center">
            <EmptyState
              variant="centered"
              message="Send a message to start the conversation"
              icon="fa-regular fa-comment-dots"
            />
          </div>
        )}

        {/* Messages */}
        {messages.map((m, i) => {
          const isCurrentUser = m.sender._id === currentUser._id;
          const showAvatar = isMessageFromDifferentSender(messages, m, i, currentUser._id);
          const isLastInGroup = isFinalMessage(messages, i);

          return (
            <div
              key={m._id}
              className={`d-flex align-items-end mb-1 ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}
            >
              {/* Show avatar for other users' messages */}
              {!isCurrentUser && (
                <div className="msg-avt-container">
                  {showAvatar && (
                    <Avatar
                      size={30}
                      src={m.sender?.picture}
                      className="cursor-pointer msg-avatar"
                    />
                  )}
                </div>
              )}

              {/* Message bubble */}
              <span
                className="d-inline-block p-2 px-3 text-dark message-bubble"
                style={{
                  backgroundColor: isCurrentUser ? '#91cef1ff' : '#71f1a2ff',
                  maxWidth: '75%',
                  wordWrap: 'break-word',
                  marginTop: isPreviousMessageSameUser(messages, m, i) ? 0 : '3px',

                  // apply tail ONLY if last message from sender
                  borderRadius: isLastInGroup
                    ? isCurrentUser
                      ? '1.25rem 1.25rem 0 1.25rem' // right user tail
                      : '1.25rem 1.25rem 1.25rem 0' // left user tail
                    : '1.25rem',
                }}
              >
                {m.content}
              </span>
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={scrollRef}></div>
      </div>
    </div>
  );
}

export default MessageScrollView;
