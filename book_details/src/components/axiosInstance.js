import axios from 'axios';

// Axios 인스턴스를 생성합니다.
const queryParams = {
    'query': '자바',
    'display': 10,
    'offset': 1,
    'sort': 'sim'
  };
  
  // Axios 인스턴스를 생성합니다.
  const axiosInstance = axios.create({
    baseURL: '/book',
    bodys: queryParams,
  });

// GET 요청에 본문을 추가하는 인터셉터를 설정합니다.
axiosInstance.interceptors.request.use(config => {
  if (config.method === 'get' && config.data) {
    config.headers['Content-Type'] = 'application/json';
    config.data = JSON.stringify(config.data);
  }
  return config;
});

export default axiosInstance;