import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Nav from "./components/Nav";
import Main from "./pages/Main";
import AdminPage from "./pages/AdminPage";
import CategoryList from "./components/CategoryList";
import ShippingManagement from "./components/ShippingManagement";
//import Category from "./components/Category";
import BookDetail from "./components/BookDetail";
import Cart from "./components/Cart";
import Order from "./components/Order";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import FindPassword from "./pages/FindPassword"
import { CategoryListContext } from "./context/CategoryListContext";
import { useState } from "react";
import EnrollBook from "./components/EnrollBook";
import BookSearch from "./components/daehee/BookSearch";
import BookSales from "./components/daehee/BookSales";
import BookSalesDetail from "./components/daehee/BookSalesDetail";
import CategoryDetailPage from './pages/CategoryDetailPage';
import Payment from "./components/Payment"
import BookSalesOrder from "./components/BookSalesOrder"
import CartOrder from "./components/CartOrder"
const privatePaths = ["/admin", "/profile", "/order"];
const App = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 인증되지 않은 사용자가 들어가면 안되는 곳
  // => 구매페이지, 프로필페이지, 관리자페이지
  //
  /*
  const location = useLocation();
  useEffect(() => {
    if (privatePaths.includes(location.pathname)) {
      // user auth logic.... (api call);
    }
  }, [location.pathname]);
  */
  return (
    <CategoryListContext.Provider value={[categoryList, setCategoryList]}>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <SearchBar></SearchBar>
        <Nav></Nav>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/admin" element={<AdminPage />}>
            <Route path="category" element={<CategoryList />} />
            <Route path="shippingManagement" element={<ShippingManagement />} />
            <Route path="enrollBook" element={<EnrollBook />}></Route>

            <Route path="bookDetail" element={<BookDetail />}></Route>
            <Route path="search" element={<BookSearch />} />
            <Route path="sales" element={<BookSales />} />
            <Route path="salesDetail" element={<BookSalesDetail />} />
          </Route>
          <Route path="/category" element={<CategoryDetailPage />} />
          <Route path="/signin" element={<Signin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/bookDetails/order" element={<BookSalesOrder />} />
          <Route path="/cart/order" element={<CartOrder />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </div>
    </CategoryListContext.Provider>
  );
}

export default App;
