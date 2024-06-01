import './App.css';
import Header  from './components/Header';
import SearchBar from './components/SearchBar';
import Nav from './components/Nav';
import Main from './pages/Main';
import AdminPage from './pages/AdminPage';
import Category from './components/Category';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


const privatePaths = ["/admin", "/profile", "/order"];
function App() {
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
    <div className="App">
      
     
        <Header></Header>
        <SearchBar></SearchBar>
        <Nav></Nav>
        <Routes>
          <Route path="/" element={<Main/>}></Route>
          <Route path="/admin" element={<AdminPage/>}>
                <Route path="category" element={<Category/>}/>
                <Route path="user" element={<p>member</p>}/>
          </Route>
        </Routes>

    </div>
  );
}

export default App;
