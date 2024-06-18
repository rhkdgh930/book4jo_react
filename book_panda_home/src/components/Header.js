import React, { useEffect, useState } from "react";
import styles from "../styles/Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../apis/auth.js";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("/api/api/users/login-check", { withCredentials: true });
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error("실패:", error);
      }
    };

    checkAuthStatus();
  }, [setIsLoggedIn]);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await axios.get("/api/api/users/is-user", { withCredentials: true });
        setIsUser(response.data);
      } catch (error) {
        console.error("실패:", error);
      }
    };

    checkUserRole();
  }, []);

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

  return (
    <div className={styles.top}>
      <div className={styles.topContainer}>
        <div className={styles.leftCategoryContainer}>
          <div><Link to="/">HOME</Link></div>
        </div>
        <div className={styles.rightCategoryContainer}>
          {isLoggedIn ? (
            <div className={styles.link} onClick={onLogoutClick}>
              로그아웃
            </div>
          ) : (
            <div>
              <Link to="/signin" className={styles.link}>
                로그인
              </Link>
            </div>
          )}
          <div>
            <Link to={isUser ? "/mypage/ordered" : "/admin"}>마이페이지</Link>
          </div>
          <div>
            <Link to="/cart">장바구니</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
