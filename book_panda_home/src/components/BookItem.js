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
                return "bronze";
        }
    };

    const truncateTitle = (title) => {
        return title.length > 22 ? title.substring(0, 22) + "..." : title;
    };

    const truncateAuthorPublisher = (author, publisher) => {
        const combined = `${author} | ${publisher}`;
        return combined.length > 10 ? combined.substring(0, 12) + "..." : combined;
    };

    return (
        <div className="book-item">
            <div className="book-item-img-box">
                <div className={`rank-badge ${getRankClass(props.rank)}`}>
                    <span className="rank top">{props.rank}</span>
                </div>
                <img src={props.book.bookInfo.image} alt="" />
            </div>
            <div className="book-title"> <strong>{truncateTitle(props.book.bookInfo.title)}</strong></div>
            <div className="book-author">{truncateAuthorPublisher(props.book.bookInfo.author, props.book.bookInfo.publisher)}</div>
            <div className="book-discount">{props.book.bookInfo.discount}원</div>
        </div>
    );
}

export default BookItem;
