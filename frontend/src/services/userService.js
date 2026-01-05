import axios from 'axios';

// Upload profile picture to Cloudinary (external API - use regular axios)
const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ChatApk');
  formData.append('cloud_name', 'dwv10qvzj');

  const res = await axios.post('https://api.cloudinary.com/v1_1/dwv10qvzj/image/upload', formData);
  return res.data.secure_url;
};

export { uploadProfileImage };
