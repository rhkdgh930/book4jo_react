import axios from 'axios';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // 실제 API URL로 변경
  withCredentials: true, // 모든 요청에 자격 증명 포함
});

// 토큰 갱신 함수
export const refreshToken = async () => {
  const refreshToken = document.cookie.replace(/(?:(?:^|.*;\s*)refreshToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  try {
    const response = await axios.post('http://localhost:8080/api/refresh-token', {}, { withCredentials: true });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // 새로운 액세스 토큰을 로컬스토리지에 저장
    localStorage.setItem('accessToken', accessToken);

    // 새로운 리프레시 토큰을 쿠키에 저장
    document.cookie = `refreshToken=${newRefreshToken};path=/;`;

    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return null;
  }
};

// 요청 인터셉터
apiClient.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('accessToken');

  if (isTokenExpired(token)) {
    token = await refreshToken();
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// 토큰 만료 체크 함수
const isTokenExpired = (token) => {
  if (!token) return true;

  const jwtPayload = JSON.parse(atob(token.split('.')[1]));
  const exp = jwtPayload.exp;

  return Date.now() >= exp * 1000;
};

export default apiClient;
