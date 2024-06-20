import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Nav from "./components/Nav";
import Main from "./pages/Main";
import AdminPage from "./pages/AdminPage";
import CategoryList from "./components/CategoryList";
import ShippingManagement from "./components/ShippingManagement";
import BookDetail from "./components/BookDetail";
import Cart from "./components/Cart";
import Order from "./components/Order";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import FindPassword from "./pages/FindPassword";
import { CategoryListContext } from "./context/CategoryListContext";
import EnrollBook from "./components/EnrollBook";
import BookSearch from "./components/daehee/BookSearch";
import BookSales from "./components/daehee/BookSales";
import BookSalesDetail from "./components/daehee/BookSalesDetail";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import PrivateRoute from "./components/PrivateRoute";
import SearchPage from "./pages/SearchPage";
import MypageCheck from "./pages/MypageCheck";
import Resign from "./pages/Resign";
import BookSalesOrder from "./components/BookSalesOrder";
import OrderHist from "./components/OrderHist";
import CartOrder from "./components/CartOrder";
import apiClient, { setupInterceptors } from "./components/TokenRefreshing";
import axios from "axios";
const privatePaths = ["/admin", "/profile", "/order"];

const App = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toggleAutoComplete, setToggleAutoComplete] = useState(false);
  useEffect(() => {
    console.log("인터셉터 함수 호출");
    setupInterceptors();

    // API 요청 테스트
    apiClient
      .get("/api/test")
      .then((response) => {
        console.log("API 요청 성공", response);
      })
      .catch((error) => {
        console.error("API 요청 실패", error);
      });
  }, []);

  return (
    <CategoryListContext.Provider value={[categoryList, setCategoryList]}>
      <div className="App" onClick={() => setToggleAutoComplete(false)}>
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <SearchBar toggleValue={toggleAutoComplete} setToggle={setToggleAutoComplete} />
        <Nav />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          >
            <Route
              path="category"
              element={
                <PrivateRoute>
                  <CategoryList />
                </PrivateRoute>
              }
            />
            <Route
              path="shippingManagement"
              element={
                <PrivateRoute>
                  <ShippingManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="enrollBook"
              element={
                <PrivateRoute>
                  <EnrollBook />
                </PrivateRoute>
              }
            />
            <Route
              path="bookDetail"
              element={
                <PrivateRoute>
                  <BookDetail />
                </PrivateRoute>
              }
            />
            <Route path="sales" element={<BookSales />} />
          </Route>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/bookSalesDetail" element={<BookSalesDetail />} />
          <Route path="/category" element={<CategoryDetailPage />} />
          <Route path="/signin" element={<Signin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/mypage/user"
            element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/mypage/check"
            element={
              <PrivateRoute>
                <MypageCheck />
              </PrivateRoute>
            }
          />
          <Route
            path="/mypage/ordered"
            element={
              <PrivateRoute>
                <OrderHist />
              </PrivateRoute>
            }
          />
          <Route path="/find-password" element={<FindPassword />} />
          <Route
            path="/resign"
            element={
              <PrivateRoute>
                <Resign />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookDetails/order"
            element={
              <PrivateRoute>
                <BookSalesOrder />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart/order"
            element={
              <PrivateRoute>
                <CartOrder />
              </PrivateRoute>
            }
          />
          <Route
            path="/order"
            element={
              <PrivateRoute>
                <Order />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </CategoryListContext.Provider>
  );
};

export default App;
