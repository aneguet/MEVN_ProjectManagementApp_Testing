// Reusable functions
const utils = () => {
  const isUserLoggedIn = () => {
    return (
      localStorage.getItem('token') !== null &&
      localStorage.getItem('token') !== undefined
    );
  };
  const isUserAdmin = () => {
    return localStorage.getItem('role') == 'admin';
  };

  return {
    isUserLoggedIn,
    isUserAdmin,
  };
};
export default utils;
