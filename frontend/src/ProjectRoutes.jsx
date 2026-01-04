import { useRoutes } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage.jsx';

function ProjectRoutes() {
  const routes = useRoutes([
    // landing page
    { path: '/', element: <AuthPage /> },
  ]);
  return <div className="appContainer">{routes}</div>;
}

export default ProjectRoutes;
