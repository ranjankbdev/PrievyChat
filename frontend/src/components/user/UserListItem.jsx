import './UserListItem.css';
import Avatar from '../user/Avatar.jsx';

function UserListItem({ user, onClick, className = '' }) {
  return (
    <div
      className={`list-group-item bg-transparent d-flex align-items-center border border-light rounded mb-1 search-list-hover ${className}`}
      onClick={() => onClick && onClick(user)}
      style={{ cursor: onClick ? 'pointer' : 'default', minHeight: '60px' }}
    >
      <Avatar src={user.picture} size={40} className="me-3" />

      <div>
        <div className="fw-semibold text-white">{user.name}</div>
        <div className="small text-white">{user.email}</div>
      </div>
    </div>
  );
}

export default UserListItem;
