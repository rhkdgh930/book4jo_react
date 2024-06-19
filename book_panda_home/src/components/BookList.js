import { useState, useEffect } from "react";
import BookItem from '../components/BookItem';
import styles from '../styles/BookList.module.css';
import { Link } from "react-router-dom";

function BookList(props) {
    return (
        <div style={{ width: "1030px" }}>
            <h2>{props.listTitle}</h2>
            <hr />
            <div className={styles.container}>
                {
                    props.bookList.map((book, i) => (
                        <Link to={`/bookSalesDetail?id=${book.id}`} style={{ color: "black" }} key={i}>
                            <BookItem rank={i + 1} book={book} />
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}

export default BookList;
