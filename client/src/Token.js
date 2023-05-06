import api from "./privateApi"; 


export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      const response = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        return true;
      } else {
        console.error("Refresh token failed.");
        return false;
      }
    } else {
      console.error("No refresh token found.");
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};
