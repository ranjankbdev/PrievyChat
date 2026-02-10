import { useEffect } from 'react';

const useClickOutside = (ref, handler, active = true) => {
  useEffect(() => {
    if (!active) return;

    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      event.stopPropagation();
      handler(event);
    };

    document.addEventListener('pointerdown', listener, true);
    return () => {
      document.removeEventListener('pointerdown', listener, true);
    };
  }, [ref, handler, active]);
};

export default useClickOutside;
