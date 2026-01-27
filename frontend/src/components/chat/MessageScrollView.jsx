import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  isMessageFromDifferentSender,
  isFinalMessage,
  isPreviousMessageSameUser,
} from '../../utils/chatHelper.js';
import EmptyState from '../common/EmptyState.jsx';
import Avatar from '../user/Avatar.jsx';
import showToast from '../../utils/toastHelper.js';
import './MessageScrollView.css';

/* bubble colors */
const CURRENT_USER_BG = '#91cef1ff';
const OTHER_USER_BG = '#71f1a2ff';

/* shared bubble base style */
const BASE_BUBBLE_STYLE = {
  maxWidth: '75%',
  wordWrap: 'break-word',
  borderRadius: '1.25rem',
};

/* safe filename helper */
const getSafeFileName = (name, fallback) => name || fallback;

/* reusable image */
function ChatImage({ src, alt, className, onClick, onLoad, onError }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
    />
  );
}

function MessageScrollView({ messages, fileUploading }) {
  const { currentUser } = useAuth();
  const scrollRef = useRef(null);
  const [viewImage, setViewImage] = useState(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const handleImageError = (e) => {
    e.currentTarget.style.display = 'none';
    showToast('Failed to load image', 'error');
  };

  const closeImageModal = () => setViewImage(null);

  useEffect(() => {
    if (messages?.length > 0) scrollToBottom();
  }, [messages?.length]);

  useEffect(() => {
    if (fileUploading) scrollToBottom();
  }, [fileUploading]);

  const handleDownload = async (fileUrl, fileName) => {
    if (!fileUrl) {
      showToast('File URL is missing', 'error');
      return;
    }

    try {
      showToast('Starting download...', 'info');
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = getSafeFileName(fileName, 'download');
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);

      showToast('Download completed!', 'success');
    } catch {
      showToast('Download failed. Opening in new tab...', 'warn');
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const renderMessageContent = (message) => {
    const { messageType, fileUrl, fileName, content } = message;

    if (messageType === 'image') {
      return (
        <>
          <ChatImage
            src={fileUrl}
            alt={getSafeFileName(fileName, 'Image')}
            className="message-image cursor-pointer"
            onClick={() => setViewImage(message)}
            onLoad={scrollToBottom}
            onError={handleImageError}
          />
          {content && <div className="mt-2 text-start">{content}</div>}
        </>
      );
    }

    if (messageType === 'document') {
      return (
        <>
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div
              className="d-flex align-items-center gap-2 text-truncate"
              style={{ maxWidth: 200 }}
            >
              <i className="fa-solid fa-file" />
              <span title={fileName}>{getSafeFileName(fileName, 'Document')}</span>
            </div>
            <button
              className="btn btn-sm btn-link p-0"
              onClick={() => handleDownload(fileUrl, fileName)}
            >
              <i className="fa-solid fa-download" />
            </button>
          </div>
          {content && <div className="mt-2 text-start">{content}</div>}
        </>
      );
    }

    return content;
  };

  const renderMessage = (message, index) => {
    const isCurrentUser = message.sender._id === currentUser._id;
    const showAvatar = isMessageFromDifferentSender(messages, message, index, currentUser._id);
    const isLastInGroup = isFinalMessage(messages, index);
    const marginTop = isPreviousMessageSameUser(messages, message, index) ? 0 : '3px';

    const bubbleStyles = {
      ...BASE_BUBBLE_STYLE,
      marginTop,
      backgroundColor: isCurrentUser ? CURRENT_USER_BG : OTHER_USER_BG,
      borderRadius: isLastInGroup
        ? isCurrentUser
          ? '1.25rem 1.25rem 0 1.25rem'
          : '1.25rem 1.25rem 1.25rem 0'
        : '1.25rem',
    };

    return (
      <div
        key={message._id}
        className={`d-flex align-items-end mb-1 ${
          isCurrentUser ? 'justify-content-end' : 'justify-content-start'
        }`}
      >
        {!isCurrentUser && (
          <div className="msg-avt-container">
            {showAvatar && (
              <Avatar size={30} src={message.sender?.picture} title={message.sender?.name} />
            )}
          </div>
        )}
        <span className="d-inline-block p-2 px-3 text-dark message-bubble" style={bubbleStyles}>
          {renderMessageContent(message)}
        </span>
      </div>
    );
  };

  return (
    <div className="mx-2 h-100 d-flex flex-column">
      <div className="flex-grow-1 d-flex flex-column justify-content-end">
        {!messages?.length && (
          <EmptyState
            variant="centered"
            message="Send a message to start the conversation"
            icon="fa-regular fa-comment-dots"
          />
        )}

        {messages?.map(renderMessage)}

        {fileUploading && (
          <span
            className="d-inline-block p-2 px-3 text-dark align-self-end"
            style={{ ...BASE_BUBBLE_STYLE, backgroundColor: CURRENT_USER_BG }}
          >
            <i className="fa-solid fa-spinner fa-spin me-2" />
            Uploading file...
          </span>
        )}

        <div ref={scrollRef} />
      </div>

      {viewImage && (
        <>
          <div className="modal-backdrop fade show" onClick={closeImageModal} />
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered m-0 p-0">
              <div className="modal-content border-0 shadow-lg glass-bg">
                <div className="modal-header border-secondary">
                  <h5 className="modal-title text-white">
                    {getSafeFileName(viewImage.fileName, 'Image Preview')}
                  </h5>
                  <button
                    className="btn-close close-btn-hover"
                    onClick={closeImageModal}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body text-center p-3">
                  <ChatImage
                    src={viewImage.fileUrl}
                    alt={getSafeFileName(viewImage.fileName, 'Image')}
                    className="msg-img-preview"
                    onError={handleImageError}
                  />
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-secondary" onClick={closeImageModal}>
                    Close
                  </button>
                  <button
                    className="btn text-dark"
                    style={{ backgroundColor: '#38B2AC' }}
                    onClick={() => handleDownload(viewImage.fileUrl, viewImage.fileName)}
                  >
                    <i className="fa-solid fa-download me-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MessageScrollView;
