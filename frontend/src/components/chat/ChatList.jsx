import './ChatList.css';

function ChatList() {
  return (
    <div className="chat-list-container h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center ms-4">
        <p className="fs-2">My Chats</p>
        <button
          style={{ height: '45px' }}
          className="btn-icon-custom d-flex justify-content-center mt-2 me-2"
        >
          <span>New Group Chat</span>
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <i className="fa-solid fa-magnifying-glass"></i>
        <p>Search a user to start the chat</p>
      </div>
    </div>
  );
}

export default ChatList;
