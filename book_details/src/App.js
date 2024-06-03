import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from './components/axiosInstance'; // 위에서 생성한 Axios 인스턴스

function App() {

  const queryParams = {
    query: '자바',
    display: 10,
    offset: 1,
    sort: 'sim'
  };
  
  // Axios를 사용하여 요청을 보냅니다.
  axios.post('https://localhost:8080/book',queryParams,
  { "Content-Type": "application/json", withCredentials: true }, )
    .then(response => {
      console.log('요청 성공:', response);
      // 여기서 응답을 처리합니다.
    })
    .catch(error => {
      console.error('요청 실패:', error);
      // 여기서 오류를 처리합니다.
    });


  return (
    <div className="App">
      
    </div>
  );
}

export default App;
