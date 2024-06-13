import { useState, useContext, useEffect } from "react";
import BookInfo from "./BookInfo";
import styles from "../styles/EnrollBook.module.css";
import axios from "axios";
import { CategoryListContext } from "../context/CategoryListContext";

function EnrollBook() {
  const [bookInfoList, setBookInfoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setQueryParams({ ...queryParams, query: inputValue });
  }, [inputValue]);

  const [queryParams, setQueryParams] = useState({
    query: "",
    start: 1,
    display: 100,
    sort: "sim",
  });
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkc2ZAbmF2ZXIuY29tIiwiYXV0aCI6IlVTRVIiLCJleHAiOjE3MTc4MTEyMDZ9.itU3soVS6d35eQXAafD5lvpL1Qgg4bfY0VwLNtHRMpg";

  const salesInfo = {
    visitCount: 0,
    sellCount: 0,
    stock: 0,
    categoryId: 0,
  };

  let inputVal = "";
  let selectedInfo = 0;

  const handleQueryInput = (event) => {
    setInputValue(event.target.value);
  };

  const search = async () => {
    try {
      console.log(queryParams);
      const response = await axios.post("/api/book", queryParams, {
        "Content-Type": "application/json",
        withCredentials: true,
      });
      setBookInfoList([]);
      console.log("요청 성공:", response.data);
      setBookInfoList(response.data); // state 업데이트
      setIsLoading(false);
    } catch (error) {
      console.error("요청 실패:", error);
      // 여기서 오류를 처리합니다.
    }
  };

  const selectStockHandler = function (event) {
    salesInfo.stock = event.target.value;
  };
  const selectCategoryHandler = function (e) {
    salesInfo.categoryId = e.target.value;
  };

  return (
    <div className={styles.container}>
      <h2>도서 등록</h2>
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <input
            type="text"
            onChange={handleQueryInput}
            placeholder="도서 검색"
            value={inputValue}
            className={styles.searchInput}
          />
          <button onClick={search} className={styles.searchButton}>
            검색
          </button>
        </div>
      </div>

      <div className={styles.bookList}>
        {isLoading === false ? (
          bookInfoList.map((bookInfo, i) => <BookInfo key={i} bookInfo={bookInfo} />)
        ) : (
          <h1>로딩중....</h1>
        )}
      </div>
    </div>
  );
}

export default EnrollBook;
