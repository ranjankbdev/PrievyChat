import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ProjectRoutes from './ProjectRoutes.jsx';
import GlobalToaster from './components/common/GlobalToaster.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ChatStateProvider } from './contexts/ChatContext.jsx';
import './styles/index.css';
import './styles/buttons.css';
import './styles/hover-effects.css';
import './styles/scrollbar.css';

createRoot(document.getElementById('root')).render(
  <>
    <GlobalToaster />
    <BrowserRouter>
      <AuthProvider>
        <ChatStateProvider>
          <ProjectRoutes />
        </ChatStateProvider>
      </AuthProvider>
    </BrowserRouter>
  </>
);
