import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const NotFoundPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 style={{ fontSize: '6rem' }} className="mb-3 text-light-gray">
        404
      </h1>
      <h2 className="mb-2 text-light-gray">Page Not Found</h2>
      <p className="mb-5 text-light-gray">The page you are looking for does not exist.</p>
      <button className="btn btn-primary" onClick={() => navigate(currentUser ? '/chats' : '/')}>
        Go Home
      </button>
    </div>
  );
};

export default NotFoundPage;
