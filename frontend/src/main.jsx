import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ChatStateProvider } from './contexts/ChatContext.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import ProjectRoutes from './ProjectRoutes.jsx';
import GlobalToaster from './components/common/GlobalToaster.jsx';
import './styles/index.css';
import './styles/buttons.css';
import './styles/hover-effects.css';
import './styles/scrollbar.css';
import './styles/Responsive.css';

createRoot(document.getElementById('root')).render(
  <>
    <GlobalToaster />
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ChatStateProvider>
            <ProjectRoutes />
          </ChatStateProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </>
);
