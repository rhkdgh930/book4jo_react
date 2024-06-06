import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import ReviewItem from "./ReviewItem";
import PaginationComponent from "../PaginationComponent";

const BookReview = ({ bookSales }) => {
  const { state } = useLocation();
  const [reviewList, setReviewList] = useState([]); // 빈 리뷰 목록 state
  const [isLoading, setIsLoading] = useState(false);

  const createReview = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8080/reviews", {
        params: { id: bookSales.id },
        "Content-Type": "application/json",
        withCredentials: true,
      });
      console.log("요청 성공:", response.data);
      setReviewList(response.data); // state 업데이트
      setIsLoading(false);
    } catch (error) {
      console.error("요청 실패:", error);
    }
  };

  return (
    <div className="book_item">
      <button onClick={createReview} />
      {!isLoading && reviewList.length > 0 && (
        <div>
          <PaginationComponent
            items={reviewList}
            itemsPerPage={10}
            renderItems={(currentReviews) => (
              <div className="book-list">
                {currentReviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default BookReview;
