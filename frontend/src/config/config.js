const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

const API_URL = `${BASE_URL}/api/v1`;
const SOCKET_URL = BASE_URL;

// Cache for Cloudinary config
let cloudinaryConfig = null;

// Fetch Cloudinary config from backend
const getCloudinaryConfig = async () => {
  if (!cloudinaryConfig) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required to upload files');
    }

    const response = await fetch(`${API_URL}/cloudinary/config`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Cloudinary configuration');
    }

    cloudinaryConfig = await response.json();

    // Validate config structure
    if (!cloudinaryConfig?.cloudName || !cloudinaryConfig?.uploadPreset) {
      throw new Error('Invalid Cloudinary configuration received');
    }
  }

  return cloudinaryConfig;
};

export { BASE_URL, API_URL, SOCKET_URL, getCloudinaryConfig };
