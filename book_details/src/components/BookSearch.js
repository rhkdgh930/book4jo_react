import React, { useState } from 'react';
import axios from 'axios';

function BookSearch (){
  const [inputValue, setInputValue] = useState('');
  const [sortValue, setSortValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Input value:', inputValue);
    console.log('Sort value:', sortValue);
    getBook();
  };

  const handleQueryInput = (event) => {
    setInputValue(event.target.value);
  };

  const handleSortInput = (event) => {
    setSortValue(event.target.value);
  };

  const [queryParams, setQueryParams] = useState({
    query: "자바",
    start: 1,
    display: 10,
    sort: "sim"
  });

  const getBook = () => {
    setQueryParams({ ...queryParams, query: inputValue, sort: sortValue });
    axios.post('http://localhost:8080/book', queryParams, {
      "Content-Type": "application/json",
      withCredentials: true
    })
      .then(response => {
        console.log('요청 성공:', response.data);
        // 여기서 응답을 처리합니다.
      })
      .catch(error => {
        console.error('요청 실패:', error);
        // 여기서 오류를 처리합니다.
      });
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
    </form>
  );
};

export default BookSearch;