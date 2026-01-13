import React from 'react';

function ChatInput() {
  return (
    <div className="input-group mb-1">
      <input
        style={{ height: '50px' }}
        type="text"
        className="form-control mt-1"
        placeholder="Enter your message…"
      />
      <button
        style={{ height: '50px', marginTop: '4px', width: '4rem' }}
        className="btn-primary-custom"
        type="button"
      >
        <i className="fa-regular fa-paper-plane"></i>
      </button>
    </div>
  );
}

export default ChatInput;
