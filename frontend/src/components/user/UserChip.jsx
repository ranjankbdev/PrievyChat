import './UserChip.css';

function UserChip({ user, onRemove, maxNameLength = 7, className = '' }) {
  const displayName =
    user.name.length > maxNameLength ? user.name.slice(0, maxNameLength) + '…' : user.name;

  return (
    <span className={`d-flex gap-1 align-items-center m-1 user-chip px-2 py-1 ${className}`}>
      <span className="ps-1">{displayName}</span>
      {onRemove && (
        <button
          onClick={() => onRemove(user)}
          style={{ fontSize: '0.7rem' }}
          type="button"
          className="btn-close badge-close"
          aria-label="Remove user"
        ></button>
      )}
    </span>
  );
}

export default UserChip;
