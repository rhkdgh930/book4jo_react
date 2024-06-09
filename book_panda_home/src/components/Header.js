import React, { useState, useEffect } from "react";
import styles from "../styles/Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { logout } from '../apis/auth.js';
import { useAuthCookies } from '../components/cookieHelper';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { hasAccessToken, hasRefreshToken } = useAuthCookies();
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    setIsLoggedIn(hasAccessToken() || hasRefreshToken());
  };

  useEffect(() => {
    checkLoginStatus();
  }, [hasAccessToken, hasRefreshToken]); // 쿠키 상태가 변경될 때마다 다시 확인

  const onLogoutClick = async () => {
    try {
      await logout();
      checkLoginStatus(); // 로그아웃 후 로그인 상태를 다시 확인합니다.
      navigate('/signin');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div className={styles.top}>
      <div className={styles.topContainer}>
        <div className={styles.leftCategoryContainer}>
          <div><Link to="/"> HOME</Link></div>
          <div>국내도서</div>
        </div>
        <div className={styles.rightCategoryContainer}>
          {isLoggedIn ? (
            <div className={styles.link} onClick={onLogoutClick}>로그아웃</div>
          ) : (
            <div><Link to="/signin" className={styles.link}>로그인</Link></div>
          )}
          <div>마이페이지</div>
          <div><Link to="/cart">장바구니</Link></div>
        </div>
      </div>
    </div>
  );
};

export default Header;
