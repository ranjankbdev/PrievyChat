function Avatar({ src, size, className }) {
  return (
    <img
      src={src || '/avatar.jpg'}
      alt="User avatar"
      onError={(e) => {
        e.currentTarget.src = '/avatar.jpg';
      }}
      className={`rounded-circle ${className}`}
      style={{ width: size, height: size, objectFit: 'cover' }}
    />
  );
}

export default Avatar;
