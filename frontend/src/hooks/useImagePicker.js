import { useRef, useEffect, useCallback } from 'react';
import showToast from '../utils/toastHelper.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const MAX_SIZE = 1 * 1024 * 1024; // 1MB

const useImagePicker = (setPicture, setPreview) => {
  const previousBlobRef = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (previousBlobRef.current) {
        URL.revokeObjectURL(previousBlobRef.current);
      }
    };
  }, []);

  const handleImageSelection = useCallback(
    (file) => {
      if (!file) return;

      if (!ALLOWED_TYPES.includes(file.type)) {
        showToast('Only JPG or PNG allowed!', 'error');
        return;
      }

      if (file.size > MAX_SIZE) {
        showToast('File size must be less than 1MB!', 'error');
        return;
      }

      // Revoke previous blob if exists
      if (previousBlobRef.current) {
        URL.revokeObjectURL(previousBlobRef.current);
      }

      const blobUrl = URL.createObjectURL(file);
      previousBlobRef.current = blobUrl;

      setPicture(file);
      setPreview(blobUrl);
    },
    [setPicture, setPreview]
  );

  return handleImageSelection;
};

export default useImagePicker;
