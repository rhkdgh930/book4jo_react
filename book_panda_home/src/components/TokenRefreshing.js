import axios from 'axios';

// Axios 인스턴스 생성
const apiClient = axios.create({
  //baseURL: 'http://localhost:8080/'
  baseURL: 'http://34.22.77.154/api'
});

// 토큰 갱신 함수
export const refreshToken = async () => {
  console.log("리프레시 토큰 요청 중");

  try {
    const response = await axios.post('users/refresh-token', {}, { withCredentials: true });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    console.log("토큰 리프레시 성공", accessToken);

    // 새로운 액세스 토큰을 로컬스토리지에 저장
    localStorage.setItem('accessToken', accessToken);

    return accessToken;
  } catch (error) {
    console.error('토큰 리프레시 실패', error);
    return null;
  }
};

// 토큰 만료 체크 함수
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const jwtPayload = JSON.parse(atob(token.split('.')[1]));
    const exp = jwtPayload.exp;

    const isExpired = Date.now() >= exp * 1000;
    console.log("토큰 만료 확인", { token, exp, isExpired });
    return isExpired;
  } catch (error) {
    console.error('토큰 해석 실패', error);
    return true;
  }
};

// 인터셉터 설정 함수
export const setupInterceptors = () => {
  console.log("인터셉터 설정 시작");

  apiClient.interceptors.request.use(async (config) => {
    console.log("인터셉터 콘피그", config);
    let token = localStorage.getItem('accessToken');

    if (isTokenExpired(token)) {
      console.log("토큰이 만료됨");
      token = await refreshToken();
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log("토큰", token);
    }

    return config;
  }, (error) => {
    console.error("에러1", error);
    return Promise.reject(error);
  });

  apiClient.interceptors.response.use(
    response => {
      console.log("인터셉터 리스폰스", response);
      return response;
    },
    async (error) => {
      console.error("리스폰스 에러", error);
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const token = await refreshToken();
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  console.log("인터셉터 설정 완료");
};

export default apiClient;