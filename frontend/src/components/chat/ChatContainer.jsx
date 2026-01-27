import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext.jsx';
import { sendMessage, fetchChatMessages, uploadFile } from '../../services/messageService.js';
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
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);

  const previewUrlRef = useRef(null);

  // reusable function to revoke preview URL
  const revokePreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

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
      revokePreviewUrl();
      setShowPreview(false);
      setPreviewFile(null);
      setPreviewType(null);
    }
  }, [selectedChat]);

  // cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      revokePreviewUrl();
    };
  }, []);

  // send a new text message
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

  // handle file selection with preview
  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500000) {
      showToast('File size must not exceed 500KB', 'error');
      e.target.value = '';
      return;
    }

    // revoke previous preview URL if exists
    revokePreviewUrl();

    // create new preview URL
    const newPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = newPreviewUrl;

    setPreviewFile(file);
    setPreviewType(type);
    setShowPreview(true);

    e.target.value = '';
  };

  // cancel file preview
  const handleCancelPreview = () => {
    revokePreviewUrl();
    setShowPreview(false);
    setPreviewFile(null);
    setPreviewType(null);
  };

  // send file after preview confirmation
  const handleSendFile = async () => {
    if (!previewFile) return;

    try {
      setFileUploading(true);
      setShowPreview(false);

      const fileUrl = await uploadFile(previewFile);

      const data = await sendMessage(
        '',
        selectedChat._id,
        previewType,
        fileUrl,
        previewFile.name,
        previewFile.size
      );

      setMessages((prev) => [...prev, data]);
      showToast('File sent successfully!', 'success');
    } catch (error) {
      console.error(error);
      showToast(error, 'error');
    } finally {
      setFileUploading(false);
      revokePreviewUrl();
      setPreviewFile(null);
      setPreviewType(null);
    }
  };

  return (
    <div className="chat-container px-3">
      {selectedChat ? (
        <>
          <ChatHeader />
          <ChatMessages loading={loading} messages={messages} fileUploading={fileUploading} />
          <ChatInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleKeyPress={handleKeyPress}
            handleSendMessage={handleSendMessage}
            handleFileSelect={handleFileSelect}
          />
          {showPreview && previewFile && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg glass-bg">
                  <div className="modal-header border-secondary p-0 px-4 pt-2 pb-1">
                    <h5 className="modal-title text-white">Preview File</h5>
                    <button
                      type="button"
                      className="btn-close close-btn-hover mt-1 mb-2"
                      onClick={handleCancelPreview}
                    />
                  </div>

                  <div className="modal-body text-center">
                    {previewType === 'image' ? (
                      <img className="msg-img-preview" src={previewUrlRef.current} alt="Preview" />
                    ) : (
                      <div className="text-white">
                        <i className="fa-solid fa-file fs-1 mb-3"></i>
                        <p className="mb-0">{previewFile.name}</p>
                        <small>{(previewFile.size / 1024).toFixed(2)} KB</small>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer border-0">
                    <button className="btn btn-secondary" onClick={handleCancelPreview}>
                      Cancel
                    </button>
                    <button
                      className="btn text-dark"
                      style={{ backgroundColor: '#38B2AC' }}
                      onClick={handleSendFile}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
