import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useChat } from '../../contexts/ChatContext.jsx';
import { markChatNotificationsAsRead } from '../../services/notificationService.js';
import { getSenderData } from '../../utils/chatHelper.js';
import { truncateText } from '../../utils/chatHelper.js';
import ProfileModal from '../user/ProfileModal.jsx';
import Avatar from '../user/Avatar.jsx';
import UserSearchDrawer from '../user/UserSearchDrawer.jsx';
import useClickOutside from '../../hooks/useClickOutside.js';
import './NavigationBar.css';

function NavigationBar() {
  const { currentUser, handleLogout } = useAuth();
  const { setSelectedChat, notification, setNotification } = useChat();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const closeNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  const closeUserMenu = useCallback(() => {
    setShowUserMenu(false);
  }, []);

  useClickOutside(notifRef, closeNotification, showNotification);
  useClickOutside(userMenuRef, closeUserMenu, showUserMenu);

  const groupNotifications = (notifications) => {
    const map = {};
    notifications.forEach((n) => {
      const key = n.chat._id;
      if (!map[key]) {
        map[key] = { chat: n.chat, sender: n.sender, count: 1 };
      } else {
        map[key].count += 1;
      }
    });
    return Object.values(map);
  };

  const handleNotificationClick = async (notif) => {
    try {
      await markChatNotificationsAsRead(notif.chat._id);
      setNotification((prev) => prev.filter((n) => n.chat?._id !== notif.chat._id));
      setSelectedChat(notif.chat);
      setShowNotification(false);
    } catch (error) {
      console.error('Error handling notification click:', error);
      setNotification((prev) => prev.filter((n) => n.chat?._id !== notif.chat._id));
      setSelectedChat(notif.chat);
      setShowNotification(false);
    }
  };

  const grouped = groupNotifications(notification);

  return (
    <>
      <div className="d-flex justify-content-between p-2 position-relative">
        <div
          onClick={() => setShowSearch(true)}
          className="d-flex align-items-center cursor-pointer rounded px-1 py-1 search-nav ms-2"
        >
          <i className="mx-2 fa-solid fa-magnifying-glass"></i>
          <span className="mx-3 me-4 d-none d-sm-inline">Start a new chat</span>
        </div>

        <div className="text-center mx-2 mt-2">
          <h3>Prievy-Chat</h3>
        </div>

        <div className="d-flex align-items-center justify-content-end mx-2 position-relative">
          <div>
            <button
              className="btn p-1 px-2 position-relative notification-bell d-none d-md-block"
              onClick={() => setShowNotification(!showNotification)}
            >
              {notification.length > 0 && (
                <span
                  className="position-absolute top-0 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '10px', padding: '3px 5px', marginTop: '5px' }}
                >
                  {notification.length}
                </span>
              )}
              <i className="fa-solid fa-bell fs-6 text-light"></i>
            </button>

            {showNotification && (
              <div
                ref={notifRef}
                className="shadow-lg px-1 pb-1 nav-notif custom-scrollbar thin-scrollbar mt-2"
              >
                {notification.length === 0 && (
                  <p className="text-center mt-1 mb-0 rounded">No New Messages</p>
                )}

                {grouped.map((g) => {
                  const { name } = getSenderData(currentUser, g.chat);

                  return (
                    <button
                      key={g.chat._id}
                      className="dropdown-item px-2 py-1 rounded mt-1 d-flex justify-content-between align-items-center nav-notif-item"
                      onClick={() => handleNotificationClick(g)}
                    >
                      <span>
                        {g.chat.isGroupChat ? `Message in ${name}` : `Message from ${name}`}
                      </span>

                      <span className="badge bg-danger" style={{ fontSize: '11px' }}>
                        {g.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="cursor-pointer px-2 py-1 avatar-hover pe-3"
          >
            <Avatar src={currentUser?.picture} size={40} />
            <span className="fw-semibold ms-2">
              {truncateText(currentUser?.name || 'Guest', 7)}
            </span>
          </div>

          {showUserMenu && (
            <div ref={userMenuRef} className="shadow-lg px-2 py-2 mt-3 nav-profile">
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
          )}

          {showProfile && <ProfileModal show={showProfile} setShow={setShowProfile} />}
          {showSearch && <UserSearchDrawer showSearch={showSearch} setShowSearch={setShowSearch} />}
        </div>
      </div>
    </>
  );
}

export default NavigationBar;
