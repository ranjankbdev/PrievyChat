import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import ProfileModal from '../user/ProfileModal.jsx';
import Avatar from '../user/Avatar.jsx';
import UserSearchDrawer from '../user/UserSearchDrawer.jsx';
import './NavigationBar.css';

function NavigationBar() {
  const { currentUser, handleLogout } = useAuth();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // current user name
  const displayName =
    currentUser?.name?.length > 10
      ? currentUser.name.slice(0, 7) + '…'
      : currentUser?.name || 'Guest';

  return (
    <>
      <div className="d-flex justify-content-between p-2 position-relative">
        {/* left section search user */}
        <div
          onClick={() => setShowSearch(true)}
          className="d-flex align-items-center cursor-pointer rounded px-1 py-1 search-nav  ms-2"
        >
          <i className="mx-2 fa-solid fa-magnifying-glass"></i>
          <span className="mx-3 me-4">Start a new chat</span>
        </div>

        {/* header */}
        <div className="text-center mx-2">
          <h3>Prievy-Chat</h3>
        </div>

        {/* right section */}
        <div className="d-flex align-items-center justify-content-end mx-2 position-relative">
          {/* notification */}
          <span className="cursor-pointer notification-bell p-1 px-2 me-2">
            <i className="fa-solid fa-bell fs-6"></i>
          </span>
          {/* User avatar / dropdown toggle */}
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="cursor-pointer px-2 py-1 avatar-hover pe-3"
          >
            <Avatar src={currentUser?.picture} size={40} />
            <span className="fw-semibold ms-2">{displayName}</span>
          </div>
          {showUserMenu && (
            <>
              {/* User Menu */}
              <div className="shadow-lg px-2 py-2 mt-3 nav-profile me-3">
                <button
                  onClick={() => {
                    setShowProfile(true);
                    setShowUserMenu(false);
                  }}
                  className="dropdown-item px-2 py-1 rounded nav-profile-item"
                >
                  <i className="fa-solid fa-user me-2"></i>My Profile
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="dropdown-item px-2 py-1 rounded nav-profile-item"
                >
                  <i className="fa-solid fa-right-from-bracket me-2"></i>
                  Logout
                </button>
              </div>

              {/* Click-away overlay */}
              <div
                onClick={() => setShowUserMenu(false)}
                className="click-away-overlay"
                style={{ zIndex: '1000' }}
              />
            </>
          )}

          {showProfile && <ProfileModal show={showProfile} setShow={setShowProfile} />}

          {showSearch && <UserSearchDrawer showSearch={showSearch} setShowSearch={setShowSearch} />}
        </div>
      </div>
    </>
  );
}

export default NavigationBar;
