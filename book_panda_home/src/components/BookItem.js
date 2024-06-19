import React from "react";
import "../styles/BookItem.css";

function BookItem(props) {
    const getRankClass = (rank) => {
        switch (rank) {
            case 1:
                return "gold";
            case 2:
                return "silver";
            default:
                return "gray";
        }
    };

    return (
        <div className="book-item">
            <div className="book-item-img-box">
                <div className={`rank-badge ${getRankClass(props.rank)}`}>
                    <span className="rank top">{props.rank}</span>
                </div>
                <img src={props.book.bookInfo.image} alt="" />
            </div>
            <h6 className="book-title">{props.book.bookInfo.title}</h6>
        </div>
    );
}

export default BookItem;
