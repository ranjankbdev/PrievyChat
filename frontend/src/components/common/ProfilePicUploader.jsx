import './ProfilePicUploader.css';

function ProfilePicUploader({
  preview,
  onImageChange,
  disabled = false,
  size = 150,
  className = '',
  showLabel = false,
}) {
  const imageSrc = preview || '/avatar.jpg';

  return (
    <div className={`${className}`}>
      <div
        className="profile-pic-wrapper profile-pic-hover position-relative"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img
          src={imageSrc}
          onError={(e) => {
            e.currentTarget.src = '/avatar.jpg';
          }}
          alt="Profile"
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => onImageChange(e.target.files[0])}
          className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          disabled={disabled}
        />

        {/* show text only if admin */}
        {!disabled && (
          <div className="overlay">
            <span className="text-white">+</span>
          </div>
        )}
      </div>

      {showLabel && <p className="text-white d-block text-center my-2">Click to Select</p>}
    </div>
  );
}

export default ProfilePicUploader;
