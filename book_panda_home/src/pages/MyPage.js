import React, { useState, useEffect } from 'react';
import { useAuthCookies } from '../components/cookieHelper'; // 쿠키 헬퍼 불러오기
import '../styles/MyPage.css';

const MyPage = () => {
  const { getAccessToken } = useAuthCookies();
  const [userInfo, setUserInfo] = useState({
    userEmail: '',
    userPassword: '',
    userName: '',
    address: '',
    phoneNumber: ''
  });

  const [editMode, setEditMode] = useState({
    userPassword: false,
    userName: false,
    address: false,
    phoneNumber: false
  });

  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken) {
      fetch('/api/mypage', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setUserInfo(data))
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
    } else {
      console.error('Access token not found');
    }
  }, [getAccessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = (field) => {
    const accessToken = getAccessToken();
    fetch(`/api/mypage/${field}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ [field]: userInfo[field] })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('업데이트 성공');
        setEditMode(prevState => ({ ...prevState, [field]: false }));
      } else {
        alert('업데이트 실패');
      }
    });
  };

  const toggleEditMode = (field) => {
    setEditMode(prevState => ({ ...prevState, [field]: !prevState[field] }));
  };

  return (
    <div className="mypage-container">
      <h2>회원정보 관리</h2>
      <div className="info-item">
        <label>이메일: </label>
        <span>{userInfo.userEmail}</span>
      </div>
      <div className="info-item">
        <label>비밀번호: </label>
        {editMode.userPassword ? (
          <input type="password" name="userPassword" value={userInfo.userPassword} onChange={handleChange} />
        ) : (
          <span>{'*'.repeat(userInfo.userPassword.length)}</span>
        )}
        <button onClick={() => editMode.userPassword ? handleUpdate('userPassword') : toggleEditMode('userPassword')}>
          {editMode.userPassword ? '저장' : '변경'}
        </button>
      </div>
      <div className="info-item">
        <label>이름: </label>
        {editMode.userName ? (
          <input type="text" name="userName" value={userInfo.userName} onChange={handleChange} />
        ) : (
          <span>{userInfo.userName}</span>
        )}
        <button onClick={() => editMode.userName ? handleUpdate('userName') : toggleEditMode('userName')}>
          {editMode.userName ? '저장' : '변경'}
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
