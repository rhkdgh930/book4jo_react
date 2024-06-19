import api from "../api";

export const login = async ({ email, pw }) => {
  try {
    const response = await api.post("/users/sign-in", { userEmail: email, userPassword: pw });
    return response.data;
  } catch (error) {
    throw new Error("로그인 실패");
  }
};
