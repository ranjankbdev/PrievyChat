function EmptyState({ message, icon = null, variant = 'inline', className = '' }) {
  // inline variant: simple text with optional icon (for search results, lists)
  if (variant === 'inline') {
    return (
      <p className={className || 'text-center mt-2 text-white'}>
        {icon && <i className={`${icon} me-2`}></i>}
        {message}
      </p>
    );
  }

  // centered variant: full-height centered layout (for main content areas)
  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center text-white ${className}`}
      style={{ height: '100%', fontStyle: 'italic' }}
    >
      {icon && <i className={`${icon} mb-3`} style={{ fontSize: '3rem', opacity: 0.5 }} />}
      <p className="text-center px-3 mb-0" style={{ fontSize: '1.1rem' }}>
        {message}
      </p>
    </div>
  );
}

export default EmptyState;
