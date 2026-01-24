function ChatInput({ newMessage, setNewMessage, handleSendMessage, handleKeyPress }) {
  return (
    <div className="input-group mb-1">
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
