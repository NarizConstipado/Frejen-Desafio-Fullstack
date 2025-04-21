import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      return true;
    }
    return false;
  } catch (error) {
    return true;
  }
};

export const currentUser = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.log(error);
  }
};
