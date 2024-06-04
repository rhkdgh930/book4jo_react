import React, { useState } from 'react';
import styles from '../styles/BookItem.module.css'; // CSS 모듈 불러오기
import BookSales from './BookSales';
import { useNavigate } from "react-router-dom";


const BookItem = ({ book }) => {
  const {title, image, author, discount} = book;
  const navigate = useNavigate();

  const handleOpenBookSales = () => {
        // console.log(curBook);
        navigate(`/sales`, { state: {...book} }); 
    };

  return (
    <div className={styles.bookItem}>
      <img src={book.image} alt={book.title} className={styles.img} />
      <div >
        <h3 >{book.title}</h3>
        <div >
          <p >{book.author}</p>
          <p >{book.description}</p>
        </div>
        <a href={book.link} className={styles.bookDetailLink}>책 자세히 보기</a>
        
          <button onClick={handleOpenBookSales}>책 판매</button>
        
      </div>
    </div>
  );
};

export default BookItem;
