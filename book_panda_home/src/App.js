// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Nav from './components/Nav';
import Main from './pages/Main';
import AdminPage from './pages/AdminPage';
import CategoryList from './components/CategoryList';
import ShippingManagement from './components/ShippingManagement';
import BookDetail from './components/BookDetail';
import Cart from './components/Cart';
import Order from './components/Order';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import MyPage from './pages/MyPage';
import MypageCheck from './pages/MypageCheck';
import Resign from './pages/Resign';
import FindPassword from './pages/FindPassword';
import { CategoryListContext } from './context/CategoryListContext';
import EnrollBook from './components/EnrollBook';
import BookSearch from './components/daehee/BookSearch';
import BookSales from './components/daehee/BookSales';
import BookSalesDetail from './components/daehee/BookSalesDetail';
import CategoryDetailPage from './pages/CategoryDetailPage';
import Payment from './components/Payment';
import apiClient, { refreshToken } from './components/TokenRefreshing';
import PrivateRoute from './components/PrivateRoute';
import axios from 'axios';

const App = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 모든 Axios 요청에 대해 apiClient 인터셉터 설정
  useEffect(() => {
    apiClient.interceptors.request.use(
      config => config,
      error => Promise.reject(error)
    );

    apiClient.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const token = await refreshToken();
          if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <CategoryListContext.Provider value={[categoryList, setCategoryList]}>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <SearchBar />
        <Nav />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }>
            <Route path="category" element={<CategoryList />} />
            <Route path="shippingManagement" element={<ShippingManagement />} />
            <Route path="enrollBook" element={<EnrollBook />} />
            <Route path="bookDetail" element={<BookDetail />} />
            <Route path="search" element={<BookSearch />} />
            <Route path="sales" element={<BookSales />} />
            <Route path="salesDetail" element={<BookSalesDetail />} />
          </Route>
          <Route path="/category" element={<CategoryDetailPage />} />
          <Route path="/signin" element={<Signin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage/user" element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          } />
          <Route path="/mypage/check" element={
            <PrivateRoute>
              <MypageCheck />
            </PrivateRoute>
          } />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/resign" element={
            <PrivateRoute>
              <Resign />
            </PrivateRoute>
          } />
          <Route path="/cart" element={
              <Cart />
          } />
          <Route path="/order" element={
              <Order />
          } />
          <Route path="/payment" element={
              <Payment />
          } />
        </Routes>
      </div>
    </CategoryListContext.Provider>
  );
}

export default App;
