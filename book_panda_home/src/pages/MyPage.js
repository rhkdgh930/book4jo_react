import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MyPage.css';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({
    userEmail: '',
    userName: '',
    address: '',
    phoneNumber: ''
  });

  const [editMode, setEditMode] = useState({
    userName: false,
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
        setUserInfo(response.data);
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
        { [field]: userInfo[field] },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
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
      <h2>회원정보 관리</h2>
      <div className="info-item">
        <label>이메일: </label>
        <span>{userInfo.userEmail}</span>
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
