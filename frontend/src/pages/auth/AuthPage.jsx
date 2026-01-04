import { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import './Auth.css';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center mx-2">
      {/* tab */}
      <div className="auth-tab rounded shadow-lg">
        <h2 className="small-screen text-white text-center mb-4">Welcome to Prievy-Chat</h2>

        <ul
          className="nav mb-3 rounded-pill d-flex justify-content-center align-items-center gap-2 w-100"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link text-white rounded-pill auth-btn-padding ${
                activeTab === 'login' ? 'active-tab fw-semibold' : 'text-dark auth-tab-hover'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link text-white rounded-pill auth-btn-padding ${
                activeTab === 'signup' ? 'active-tab fw-semibold' : 'text-dark auth-tab-hover'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Signup
            </button>
          </li>
        </ul>

        {/* Tab content */}
        <div className="tab-content text-dark">
          <div className={`tab-pane fade ${activeTab === 'login' ? 'show active' : ''}`}>
            <Login switchTab={setActiveTab} />
          </div>
          <div className={`tab-pane fade ${activeTab === 'signup' ? 'show active' : ''}`}>
            <Signup switchTab={setActiveTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
