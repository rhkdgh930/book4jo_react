import axios from "axios";

export const login = async ({ email, pw }) => {
  try {
    const response = await axios.post("/api/api/users/sign-in", { userEmail: email, userPassword: pw });
    return response.data;
  } catch (error) {
    throw new Error("로그인 실패");
  }
};
