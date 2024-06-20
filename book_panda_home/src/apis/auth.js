import api from '../api'; // 공통 axios 인스턴스 import

export const login = async (credentials) => {
  try {
    const response = await api.post('/users/sign-in', credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/users/logout');
  } catch (error) {
    console.error("Logout error:", error.response ? error.response.data : error.message);
    throw error;
  }
};
