import { useRoutes } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ProfileSetup from './pages/auth/ProfileSetup.jsx';

function ProjectRoutes() {
  const routes = useRoutes([
    // landing page
    { path: '/', element: <AuthPage /> },

    { path: '/profile-setup', element: <ProfileSetup /> },
    { path: '/chats', element: <ChatPage /> },
  ]);
  return <div className="appContainer">{routes}</div>;
}

export default ProjectRoutes;
