import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MyPage.css';
import { Link, useNavigate } from "react-router-dom";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({
    userEmail: '',
    name: '',
    address: '',
    phoneNumber: ''
  });

  const [editMode, setEditMode] = useState({
    name: false,
    address: false,
    phoneNumber: false
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await axios.get('http://localhost:8080/api/mypage', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setUserInfo(response.data); // response.data가 모든 필드를 포함하는지 확인
        }
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (field) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.put(`http://localhost:8080/api/mypage/${field}`,
        null,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            value: userInfo[field]
          }
        }
      );
      if (response.status === 200) {
        alert('업데이트 성공');
        setEditMode(prevState => ({ ...prevState, [field]: false }));
      }
    } catch (error) {
      console.error('업데이트 실패:', error);
      alert('업데이트 실패');
    }
  };

  const toggleEditMode = (field) => {
    setEditMode(prevState => ({ ...prevState, [field]: !prevState[field] }));
  };

  return (
    <div className="mypage-container">
      <div><Link to="/mypage">장바구니</Link></div>
      <div><Link to="/mypage/ordered">장바구니</Link></div>
      <h2>회원정보 관리</h2>
      <div className="info-item">
        <label>이메일: </label>
        <span>{userInfo.userEmail}</span>
      </div>
      <div className="info-item">
        <label>이름: </label>
        {editMode.name ? (
          <input type="text" name="name" value={userInfo.name} onChange={handleChange} />
        ) : (
          <span>{userInfo.name}</span>
        )}
        <button onClick={() => editMode.name ? handleUpdate('name') : toggleEditMode('name')}>
          {editMode.name ? '저장' : '변경'}
        </button>
      </div>
      <div className="info-item">
        <label>주소: </label>
        {editMode.address ? (
          <input type="text" name="address" value={userInfo.address} onChange={handleChange} />
        ) : (
          <span>{userInfo.address}</span>
        )}
        <button onClick={() => editMode.address ? handleUpdate('address') : toggleEditMode('address')}>
          {editMode.address ? '저장' : '변경'}
        </button>
      </div>
      <div className="info-item">
        <label>전화번호: </label>
        {editMode.phoneNumber ? (
          <input type="text" name="phoneNumber" value={userInfo.phoneNumber} onChange={handleChange} />
        ) : (
          <span>{userInfo.phoneNumber}</span>
        )}
        <button onClick={() => editMode.phoneNumber ? handleUpdate('phoneNumber') : toggleEditMode('phoneNumber')}>
          {editMode.phoneNumber ? '저장' : '변경'}
        </button>
      </div>
    </div>
  );
};

export default MyPage;
