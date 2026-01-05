// some ancestor must be position: relative function

function Spinner({
  size = 'md',
  text = 'Please wait...',
  textPosition = 'right',
  overlay = true,
  className = '',
}) {
  const sizeClasses = {
    sm: { spinner: 'spinner-border-sm', text: 'small' },
    md: { spinner: '', text: '' },
    lg: { spinner: '', text: 'fs-5' },
  };

  const spinnerSizeClass = sizeClasses[size]?.spinner || '';
  const textSizeClass = sizeClasses[size]?.text || '';
  const colorClass = 'text-white';

  const wrapperClasses = () => {
    return 'd-flex align-items-center justify-content-center';
  };

  const Text = (
    <span className={`${colorClass} ${textSizeClass} ${textPosition === 'left' ? 'me-2' : 'ms-2'}`}>
      {text}
    </span>
  );

  const SpinnerIcon = (
    <div
      className={`spinner-border ${spinnerSizeClass} ${colorClass}`}
      role="status"
      aria-hidden="true"
    />
  );

  return (
    <div
      className={`${wrapperClasses()} ${className}`}
      style={overlay ? { position: 'absolute', inset: 0, pointerEvents: 'none' } : undefined}
    >
      {textPosition === 'left' ? (
        <>
          {Text}
          {SpinnerIcon}
        </>
      ) : (
        <>
          {SpinnerIcon}
          {Text}
        </>
      )}
    </div>
  );
}

export default Spinner;
