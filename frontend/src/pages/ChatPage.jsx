import NavigationBar from '../components/layout/NavigationBar.jsx';
import ChatList from '../components/chat/ChatList.jsx';
import ChatContainer from '../components/chat/ChatContainer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import './ChatPage.css';

function ChatPage() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  return (
    <div className="chat-page">
      {/* Top Navigation */}
      <header>
        <NavigationBar />
      </header>

      {/* Main Chat Area */}
      <main className="chat-page__main">
        {/* Sidebar: Chat List */}
        <aside className="chat-page__sidebar">
          <ChatList />
        </aside>

        {/* Chat Content */}
        <section className="chat-page__content">
          <ChatContainer />
        </section>
      </main>
    </div>
  );
}

export default ChatPage;
