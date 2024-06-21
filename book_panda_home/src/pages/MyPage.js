import React, { useState, useEffect } from "react";
import api from "../api";
import { Form, Input, Inputs, Title, Wrapper, Button, ButtonB, CustomLink, Error, Red } from '../components/Common';
import "../styles/MyPage.css";
import { Link } from "react-router-dom";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({
    userEmail: "",
    name: "",
    address: "",
    detailedAddress: "",
    postCode: "",
    phoneNumber: "",
  });

  const [editMode, setEditMode] = useState({
    name: false,
    address: false,
    phoneNumber: false,
  });

  const [password, setPassword] = useState("");
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const daumPostcodeScript = document.createElement("script");
    daumPostcodeScript.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    daumPostcodeScript.onload = () => setScriptLoaded(true);
    document.head.appendChild(daumPostcodeScript);

    return () => {
      document.head.removeChild(daumPostcodeScript);
    };
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await api.get("/mypage", {
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

      let requestData = {};
      if (field === "address") {
        requestData = {
          address: userInfo.address,
          detailedAddress: userInfo.detailedAddress,
          postCode: userInfo.postCode,
        };
      } else {
        requestData[field] = userInfo[field];
      }

      const response = await api.put(`/mypage/${field}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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

      const response = await api.put("/mypage/change-password", { newPassword: password }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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

  const handlePostcode = (e) => {
    e.preventDefault();
    if (!scriptLoaded) {
      setErrors({ ...errors, address: '주소 검색 스크립트가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.' });
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        setUserInfo((prevState) => ({
          ...prevState,
          address: data.address + (data.buildingName ? `, ${data.buildingName}` : ""),
          postCode: data.zonecode,
        }));
      },
    }).open();
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
          <Link to="/mypage/check">회원정보관리</Link>
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
              <div>
                <input
                  className="mypage-input"
                  type="text"
                  name="address"
                  value={userInfo.address}
                  readOnly
                />
                <input
                  className="mypage-input"
                  type="text"
                  name="detailedAddress"
                  value={userInfo.detailedAddress}
                  onChange={handleChange}
                />
                <input
                  className="mypage-input"
                  type="text"
                  name="postCode"
                  value={userInfo.postCode}
                  readOnly
                />
                <ButtonB onClick={handlePostcode}>주소 검색</ButtonB>
              </div>
            ) : (
              <span className="span">
                {userInfo.address} {userInfo.detailedAddress} ({userInfo.postCode})
              </span>
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
      <p className="the-custom-link"><CustomLink to="/resign">회원탈퇴하기</CustomLink></p>
      </div>
    </form>
  );
};

export default MyPage;
