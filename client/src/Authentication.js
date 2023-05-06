import { 
  refreshToken 
} from './Token';
import api from './privateApi';


// Function to check user authentication status
export const checkAuthenticated = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        const response = await api.get("/api/check_authentication/");
        if (response.data.authenticated) {
          console.log("User is authenticated");
          return true;
        } else {
          console.log("User is not authenticated");
          const refreshed = await refreshToken();
          if (!refreshed) {
            return false;
          }
        }
      } else {
        console.log("No access token found");
        return false;
      }
    } catch (error) {
      console.error('An unknown error occurred:', error);
      return false;
    }
  };