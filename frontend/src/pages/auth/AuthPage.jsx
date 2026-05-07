import { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import './Auth.css';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center mx-2">
      <div className="auth-tab rounded shadow-lg">
        <div className='d-flex gap-4'>
          <img className="ms-4" src="/prievychat_logo.png" style={{ width: 40, height: 40 }}></img>
          <h2 className="small-screen text-white text-center mb-4">Welcome to Prievy-Chat</h2>
        </div>
        <ul
          className="nav mb-3 rounded-pill d-flex justify-content-center align-items-center gap-2 w-100"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              id="login-tab"
              className={`nav-link text-white rounded-pill auth-btn-padding ${
                activeTab === 'login' ? 'active-tab fw-semibold' : 'text-dark auth-tab-hover'
              }`}
              role="tab"
              aria-selected={activeTab === 'login'}
              aria-controls="login-panel"
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              id="signup-tab"
              className={`nav-link text-white rounded-pill auth-btn-padding ${
                activeTab === 'signup' ? 'active-tab fw-semibold' : 'text-dark auth-tab-hover'
              }`}
              role="tab"
              aria-selected={activeTab === 'signup'}
              aria-controls="signup-panel"
              onClick={() => setActiveTab('signup')}
            >
              Signup
            </button>
          </li>
        </ul>

        {/* Tab content */}
        <div className="tab-content text-dark">
          <div
            id="login-panel"
            className={`tab-pane fade ${activeTab === 'login' ? 'show active' : ''}`}
            role="tabpanel"
            aria-labelledby="login-tab"
          >
            <Login switchTab={setActiveTab} />
          </div>
          <div
            id="signup-panel"
            className={`tab-pane fade ${activeTab === 'signup' ? 'show active' : ''}`}
            role="tabpanel"
            aria-labelledby="signup-tab"
          >
            <Signup switchTab={setActiveTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
