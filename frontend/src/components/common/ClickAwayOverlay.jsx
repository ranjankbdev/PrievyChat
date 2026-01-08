function ClickAwayOverlay({ onClickAway }) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ zIndex: 10, background: 'transparent' }}
      onClick={onClickAway}
    />
  );
}

export default ClickAwayOverlay;
