import axios from 'axios';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'https://your-api-url.com',
});

// 토큰 갱신 함수
const refreshToken = async () => {
  const refreshToken = document.cookie.replace(/(?:(?:^|.*;\s*)refreshToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  try {
    const response = await axios.post('"http://localhost:8080/api/refresh-token', { token: refreshToken });
    const { accessToken } = response.data;

    // 새로운 액세스 토큰을 로컬스토리지에 저장
    localStorage.setItem('accessToken', accessToken);

    return accessToken;
  } catch (error) {
    // 토큰 갱신 실패 시 로직 처리 (예: 로그아웃)
    console.error('Failed to refresh token', error);
    return null;
  }
};

// 요청 인터셉터
apiClient.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('accessToken');

  // 만료 시간 체크 로직 추가 (예를 들어, JWT 토큰의 exp 클레임 확인)
  // 만료된 경우 토큰 갱신
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

export default TokenRefreshing;
