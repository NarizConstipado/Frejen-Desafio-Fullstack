import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Check if the token exists
};

export const isTokenExpired = (token) => {
  if (!token) return true; // No token means it's expired or not valid

  try {
    const { exp } = jwtDecode(token); // Decode token to get expiration time
    if (Date.now() >= exp * 1000) {
      return true; // If token has expired
    }
    return false; // Token is still valid
  } catch (error) {
    return true; // If decoding fails, treat it as expired
  }
};

export const currentUser = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.log(error);
  }
};
