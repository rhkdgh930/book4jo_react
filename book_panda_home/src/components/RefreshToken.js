import axios from 'axios';
import { useEffect } from 'react';

// privateApi 인스턴스 생성
const privateApi = axios.create({
  baseURL: process.env.REACT_APP_SERVER_IP, // 서버 IP
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});

// 토큰 갱신 함수
const refreshAccessToken = async () => {
  try {
    const response = await axios.post('/api/users/refresh-token', {
      refreshToken: localStorage.getItem('refreshToken'),
    });
    // 토큰 갱신 성공 시
    if (response.status === 200) {
      const { token, refreshToken } = response.data;
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      return token; // 새로운 액세스 토큰 반환
    }
  } catch (error) {
    throw error;
  }
};

// privateApi에 인터셉터 적용
privateApi.interceptors.response.use(
  (response) => response, // 응답 성공 시 처리
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    // 토큰 만료 시
    if (status === 401) {
      try {
        const newAccessToken = await refreshAccessToken(); // 토큰 갱신 시도
        // 토큰 갱신 성공 시
        if (newAccessToken) {
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(config); // 원래 요청 재시도
        }
      } catch (refreshError) {
        throw refreshError; // 토큰 갱신 실패 시 에러 전달
      }
    }
    return Promise.reject(error); // 그 외의 경우 에러 전달
  }
);

// privateApi 인스턴스 및 토큰 갱신 함수 내보내기
export { privateApi, refreshAccessToken };
