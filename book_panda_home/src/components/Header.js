import React, { useEffect, useState } from "react";
import styles from "../styles/Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { logout } from "../apis/auth.js";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get("/users/login-check", { withCredentials: true });
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error("실패:", error);
      }
    };

    checkAuthStatus();
  }, [setIsLoggedIn]);

  const onLogoutClick = async () => {
    try {
      localStorage.removeItem('accessToken');
      await logout();
      setIsLoggedIn(false);
      navigate("/signin");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleMyPageClick = async () => {
    try {
      const response = await api.post("/users/is-user", {}, { withCredentials: true });
      console.log(response.data); // 추가된 로그: 서버에서 반환된 데이터 확인
      if (response.data === true) {
        navigate("/mypage/ordered");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.error("마이페이지 이동 실패:", error);
    }
  };


  return (
    <div className={styles.top}>
      <div className={styles.topContainer}>
        <div className={styles.leftCategoryContainer}>
          <div><Link to="/" className={styles.home}>HOME</Link></div>
        </div>
        <div className={styles.rightCategoryContainer}>
          {isLoggedIn ? (
            <Link onClick={onLogoutClick} className={styles.link}>
              로그아웃
            </Link>
          ) : (
            <Link to="/signin" className={styles.link}>
              로그인
            </Link>
          )}
          <Link onClick={handleMyPageClick} className={styles.link}>
            마이페이지
          </Link>
          <Link to="/cart" className={styles.link}>장바구니</Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
