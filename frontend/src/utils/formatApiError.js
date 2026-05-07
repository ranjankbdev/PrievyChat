const formatApiError = (error) => {
  if (error?.response?.status === 429) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  return error?.response?.data?.message || error?.message || 'Something went wrong!';
};

export default formatApiError;
