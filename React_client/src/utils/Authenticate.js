import { jwtDecode } from "jwt-decode";

const isAuthenticated = () => {
  // Check if token exists in localStorage and is not expired
  let token = localStorage.getItem("token");
;

  if (!token) {
    return false; // No token found, hence not authenticated
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

    // Check if the token is expired
    if (decodedToken.exp < currentTime) {
      // Token is expired, remove it from localStorage
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false; // If decoding fails, consider the user not authenticated
  }
};

export default isAuthenticated;
