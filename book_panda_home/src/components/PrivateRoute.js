import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      alert('로그인이 필요합니다.');
    }
  }, [accessToken]);

  if (!accessToken) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default PrivateRoute;
