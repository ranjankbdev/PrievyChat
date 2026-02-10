import { useState, useRef, useEffect, useCallback } from 'react';
import { RotateLoader } from 'react-spinners';
import { useChat } from '../../contexts/ChatContext.jsx';
import { searchUsers, accessChatWithUser } from '../../services/userService.js';
import EmptyState from '../common/EmptyState.jsx';
import Spinner from '../common/Spinner.jsx';
import showToast from '../../utils/toastHelper.js';
import Avatar from './Avatar.jsx';
import useClickOutside from '../../hooks/useClickOutside.js';
import './UserSearchDrawer.css';

function UserSearchDrawer({ showSearch, setShowSearch }) {
  const { setChats, setSelectedChat, setFetchAgain } = useChat();

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const debounceRef = useRef(null);
  const drawerRef = useRef(null);

  const handleClose = useCallback(() => {
    setShowSearch(false);
  }, [setShowSearch]);

  useClickOutside(drawerRef, handleClose, showSearch);

  // reset search when drawer closes
  useEffect(() => {
    if (!showSearch) {
      setSearch('');
      setSearchResult([]);
      setHasSearched(false);
    }
  }, [showSearch]);

  // cleanup debounce
  useEffect(() => {
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, []);

  // search user
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResult([]);
      setHasSearched(false);
      return;
    }

    try {
      setHasSearched(true);
      setLoading(true);
      const users = await searchUsers(query);
      setSearchResult(users);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  // debounces user input
  const debounceSearch = (query) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(query), 300);
  };

  // access chat when user clicks a search result
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const chat = await accessChatWithUser(userId);

      if (chat) {
        setChats((prev) => {
          // check if chat already exists in current state
          if (!prev.find((c) => c._id === chat._id)) {
            return [chat, ...prev];
          }
          return prev;
        });
        setSelectedChat(chat);
        setFetchAgain((prev) => !prev);
      }
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoadingChat(false);
      setShowSearch(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div ref={drawerRef} className={`search-panel glass-bg h-100 ${showSearch ? 'open' : ''}`}>
        {loadingChat && (
          <div className="modal-overlay">
            <RotateLoader color="#0d6efd" loading={true} size={15} margin={5} />
          </div>
        )}

        {/* HEADER */}
        <div className="d-flex pt-4">
          <p className="ps-4 fs-5 fw-semibold">Search or start a new chat</p>
          <button
            onClick={() => setShowSearch(false)}
            type="button"
            aria-label="Close user search panel"
            className="btn-close close-btn-hover p-2 ms-2"
          ></button>
        </div>

        {/* SEARCH INPUT */}
        <div className="input-group px-4 mb-2">
          <input
            autoComplete="off"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debounceSearch(e.target.value);
            }}
            type="text"
            className="form-control"
            placeholder="Search by name or email"
            disabled={loadingChat}
          />
          <button
            disabled={loadingChat}
            onClick={() => handleSearch(search)}
            className="btn-primary-custom"
          >
            Go
          </button>
        </div>

        {/* Search results */}
        <>
          {loading ? (
            <Spinner size="md" text="Searching users..." textPosition="left" overlay={false} />
          ) : (
            <ul className="list-group px-4 nav-search-results custom-scrollbar thin-scrollbar">
              {searchResult.map((user) => (
                <li
                  key={user._id}
                  className="list-group-item bg-transparent d-flex align-items-center border border-light rounded mb-1 search-list cursor-pointer"
                  onClick={() => accessChat(user._id)}
                >
                  <Avatar src={user.picture} size={40} className="me-3" />
                  <div className="d-flex flex-column justify-content-center">
                    <span className="fw-semibold text-white">{user.name}</span>
                    <span className="small text-white-50">{user.email}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!loading && hasSearched && searchResult.length === 0 && search.trim() && (
            <EmptyState variant="inline" message="no users found" icon="fa-solid fa-user-slash" />
          )}
        </>
      </div>
    </>
  );
}

export default UserSearchDrawer;
