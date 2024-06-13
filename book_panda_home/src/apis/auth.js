import axios from "axios";

export const login = async (credentials) => {
  try {
    const response = await axios.post("/api/api/users/sign-in", credentials, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.post("/api/api/users/logout", {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout error:", error.response ? error.response.data : error.message);
    throw error;
  }
};
