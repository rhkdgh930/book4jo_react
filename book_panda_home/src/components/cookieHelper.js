import { useCookies } from 'react-cookie';

const ACCESS_TOKEN_COOKIE = 'accessTokenCookie';
const REFRESH_TOKEN_COOKIE = 'refreshTokenCookie';

export const useAuthCookies = () => {
  const [cookies, setCookie, removeCookie] = useCookies([ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE]);

  const getAccessToken = () => cookies[ACCESS_TOKEN_COOKIE];
  const getRefreshToken = () => cookies[REFRESH_TOKEN_COOKIE];

  const setAccessToken = (token, options = {}) => {
    setCookie(ACCESS_TOKEN_COOKIE, token, { ...options, path: '/' });
  };

  const setRefreshToken = (token, options = {}) => {
    setCookie(REFRESH_TOKEN_COOKIE, token, { ...options, path: '/' });
  };

  const removeAccessToken = () => {
    removeCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
  };

  const removeRefreshToken = () => {
    removeCookie(REFRESH_TOKEN_COOKIE, { path: '/' });
  };

  const hasAccessToken = () => !!cookies[ACCESS_TOKEN_COOKIE];
  const hasRefreshToken = () => !!cookies[REFRESH_TOKEN_COOKIE];

  return {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    removeAccessToken,
    removeRefreshToken,
    hasAccessToken,
    hasRefreshToken,
  };
};
