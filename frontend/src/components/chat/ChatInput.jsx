import { useState, useRef, useCallback } from 'react';
import useClickOutside from '../../hooks/useClickOutside.js';
import './ChatInput.css';

function ChatInput({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleKeyPress,
  handleFileSelect,
}) {
  const [showFileMenu, setShowFileMenu] = useState(false);
  const menuRef = useRef(null);
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const handleCloseMenu = useCallback(() => {
    setShowFileMenu(false);
  }, []);

  useClickOutside(menuRef, handleCloseMenu, showFileMenu);

  return (
    <div className="input-group mb-1">
      <input
        type="file"
        ref={imageInputRef}
        className="d-none"
        accept="image/*"
        onChange={(e) => handleFileSelect(e, 'image')}
      />
      <input
        type="file"
        ref={documentInputRef}
        className="d-none"
        accept=".pdf,.doc,.docx,.txt,.jsx,.js,.css,.html,.json,.xml,.csv"
        onChange={(e) => handleFileSelect(e, 'document')}
      />
      <div ref={menuRef}>
        <button
          onClick={() => setShowFileMenu(!showFileMenu)}
          type="button"
          className="btn-input-custom mt-1 px-3 "
        >
          <i className="fa-solid fa-plus"></i>
        </button>

        {showFileMenu && (
          <div className="input-attachment-menu p-1 text-dark rounded">
            <button
              onClick={() => {
                imageInputRef.current?.click();
                setShowFileMenu(false);
              }}
              className="btn btn-sm mb-2 img-input"
            >
              <i className="fa-solid fa-image me-2"></i>
              Image
            </button>
            <button
              onClick={() => {
                documentInputRef.current?.click();
                setShowFileMenu(false);
              }}
              className="btn btn-sm doc-input"
            >
              <i className="fa-solid fa-file me-2"></i>
              Document
            </button>
          </div>
        )}
      </div>
      <input
        style={{ height: '50px' }}
        type="text"
        className="form-control mt-1"
        placeholder="Enter your message…"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button
        style={{ height: '50px', marginTop: '4px', width: '4rem' }}
        className="btn-primary-custom"
        type="button"
        onClick={handleSendMessage}
        disabled={!newMessage.trim()}
      >
        <i className="fa-regular fa-paper-plane"></i>
      </button>
    </div>
  );
}

export default ChatInput;
