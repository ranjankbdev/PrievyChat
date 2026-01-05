import showToast from '../utils/toastHelper';

const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const MAX_SIZE = 1 * 1024 * 1024;

const useImagePicker = (setPicture, setPreview) => (file, preview) => {
  if (!file) return;

  if (!ALLOWED_TYPES.includes(file.type)) {
    showToast('Only JPG or PNG allowed!', 'error');
    return;
  }

  if (file.size > MAX_SIZE) {
    showToast('File size must be less than 1MB!', 'error');
    return;
  }

  // clean up blob
  if (preview && preview.startsWith('blob:')) {
    URL.revokeObjectURL(preview);
  }

  setPicture(file);
  setPreview(URL.createObjectURL(file));
};

export default useImagePicker;
