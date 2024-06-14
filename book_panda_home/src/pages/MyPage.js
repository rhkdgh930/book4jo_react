import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MyPage.css";
import { Link } from "react-router-dom";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({
    userEmail: "",
    name: "",
    address: "",
    phoneNumber: "",
  });

  const [editMode, setEditMode] = useState({
    name: false,
    address: false,
    phoneNumber: false,
  });

  const [password, setPassword] = useState("");
  const [passwordEditMode, setPasswordEditMode] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get("/api/api/mypage", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUpdate = async (field) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.put(`/api/api/mypage/${field}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          value: userInfo[field],
        },
      });
      if (response.status === 200) {
        alert("업데이트 성공");
        setEditMode((prevState) => ({ ...prevState, [field]: false }));
      }
    } catch (error) {
      console.error("업데이트 실패:", error);
      alert("업데이트 실패");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.put("api/mypage/change-password", null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          newPassword: password,
        },
      });
      if (response.status === 200) {
        alert("비밀번호 변경 성공");
        setPasswordEditMode(false);
      }
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      alert("비밀번호 변경 실패");
    }
  };

  const toggleEditMode = (field) => {
    setEditMode((prevState) => ({ ...prevState, [field]: !prevState[field] }));
  };

  const togglePasswordEditMode = () => {
    setPasswordEditMode(!passwordEditMode);
  };

  return (
    <form>
      <div className="select-page">
        <div className="select-page-button">
          <Link to="/mypage">회원정보관리</Link>
        </div>
        <div className="select-page-button">
          <Link to="/mypage/ordered">주문내역</Link>
        </div>
      </div>
      <div className="mypage-container">
        <h2>회원정보 관리</h2>
        <div className="inputs-row">
          <div className="info-item">
            <label className="label">이메일: </label>
            <span className="span">{userInfo.userEmail}</span>
          </div>
          <div className="fake"></div>
        </div>
        <div className="inputs-row">
          <div className="info-item">
            <label className="label">비밀번호: </label>
            {passwordEditMode ? (
              <input className="mypage-input" type="password" value={password} onChange={handlePasswordChange} />
            ) : (
              <span className="span">********</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              passwordEditMode ? handlePasswordUpdate() : togglePasswordEditMode();
            }}
          >
            {passwordEditMode ? "저장" : "변경"}
          </button>
        </div>
        <div className="inputs-row">
          <div className="info-item">
            <label className="label">이름: </label>
            {editMode.name ? (
              <input className="mypage-input" type="text" name="name" value={userInfo.name} onChange={handleChange} />
            ) : (
              <span className="span">{userInfo.name}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              editMode.name ? handleUpdate("name") : toggleEditMode("name");
            }}
          >
            {editMode.name ? "저장" : "변경"}
          </button>
        </div>
        <div className="inputs-row">
          <div className="info-item">
            <label className="label">주소: </label>
            {editMode.address ? (
              <input
                className="mypage-input"
                type="text"
                name="address"
                value={userInfo.address}
                onChange={handleChange}
              />
            ) : (
              <span className="span">{userInfo.address}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              editMode.address ? handleUpdate("address") : toggleEditMode("address");
            }}
          >
            {editMode.address ? "저장" : "변경"}
          </button>
        </div>
        <div className="inputs-row">
          <div className="info-item">
            <label className="label">전화번호: </label>
            {editMode.phoneNumber ? (
              <input
                className="mypage-input"
                type="text"
                name="phoneNumber"
                value={userInfo.phoneNumber}
                onChange={handleChange}
              />
            ) : (
              <span className="span">{userInfo.phoneNumber}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              editMode.phoneNumber ? handleUpdate("phoneNumber") : toggleEditMode("phoneNumber");
            }}
          >
            {editMode.phoneNumber ? "저장" : "변경"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MyPage;
