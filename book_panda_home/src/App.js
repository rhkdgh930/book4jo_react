import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Nav from "./components/Nav";
import Main from "./pages/Main";
import AdminPage from "./pages/AdminPage";
import CategoryList from "./components/CategoryList";
//import Category from "./components/Category";
import BookDetail from "./components/BookDetail";
import Cart from "./components/Cart";
import Order from "./components/Order";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Mypage from "./pages/Mypage";
import { CategoryListContext } from "./context/CategoryListContext";
import { useState } from "react";
import EnrollBook from "./components/EnrollBook";
import BookSearch from "./components/daehee/BookSearch";
import BookSales from "./components/daehee/BookSales";
import BookSalesDetail from "./components/daehee/BookSalesDetail";

const privatePaths = ["/admin", "/profile", "/order"];
function App() {
  const [categoryList, setCategoryList] = useState([]);
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
        <Header></Header>
        <SearchBar></SearchBar>
        <Nav></Nav>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/admin" element={<AdminPage />}>
            <Route path="category" element={<CategoryList />} />
            <Route path="user" element={<p>member</p>} />
            <Route path="enroll" element={<EnrollBook />}></Route>
            <Route path="bookDetail" element={<BookDetail />}></Route>
            <Route path="search" element={<BookSearch />} />
            <Route path="sales" element={<BookSales />} />
            <Route path="salesDetail" element={<BookSalesDetail />} />
          </Route>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </div>
    </CategoryListContext.Provider>
  );
}

export default App;
