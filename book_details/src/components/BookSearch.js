import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookItem from './BookItem';

function BookSearch (){
  const [inputValue, setInputValue] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setQueryParams({ ...queryParams, query: inputValue});
  }, [inputValue]);

  useEffect(() => {
    setQueryParams({ ...queryParams, sort: sortValue});
  }, [sortValue]);


  const [bookList, setBookList] = useState([]); // 빈 책 목록 state

  const handleSubmit = (event) => {
    isLoading(true);
    event.preventDefault();
    getBook();
  };

  const handleQueryInput = (event) => {
    setInputValue(event.target.value);
  };

  const handleSortInput = (event) => {
    setSortValue(event.target.value);
  };

  const [queryParams, setQueryParams] = useState({
    query: inputValue,
    start: 1,
    display: 10,
    sort: "sim"
  });

  const getBook = async () => {
    try{
      const response = await axios.post('http://localhost:8080/book', queryParams, {
        "Content-Type": "application/json",
        withCredentials: true
      })
      setBookList([])
      console.log('요청 성공:', response.data);
      setBookList(response.data); // state 업데이트
      setIsLoading(false);
    }
    catch (error) {
      console.error('요청 실패:', error);
      // 여기서 오류를 처리합니다.
    }
  };

  

  return (
    <form onSubmit={handleSubmit}>
      <label>
        검색 쿼리:
        <input type="text" value={inputValue} onChange={handleQueryInput} />
      </label>
      <label>
        정렬 기준:
        <input type="text" value={sortValue} onChange={handleSortInput} />
      </label>
      <button type="submit">제출</button>
      {isLoading && (
        <div>로딩중</div>
      )}

      {!isLoading && bookList.length > 0 && (
        <div className="book-list">
          {bookList.map(book => (<BookItem key={book.isbn} book={book} />))}
        </div>
      )}

    </form>
  );
};

export default BookSearch;