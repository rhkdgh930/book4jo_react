import React, { useState, useEffect } from "react";
import api from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import ReviewItem from "./ReviewItem";
import PaginationComponent from "../PaginationComponent";

const BookReview = ({ bookSales }) => {
  const { state } = useLocation();
  const [reviewList, setReviewList] = useState([]); // 빈 리뷰 목록 state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 초기 렌더링 시 createReview 호출
    createReview();

    // 5초마다 createReview 호출을 위한 setInterval 설정
    const interval = setInterval(() => {
      createReview();
    }, 5000);

    // 컴포넌트가 언마운트될 때 clearInterval을 통해 interval 정리
    return () => clearInterval(interval);
  }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시에만 useEffect가 실행되도록 설정

  const createReview = async () => {
    try {
      setIsLoading(true);

      const response = await api.get(`/reviews?id=${bookSales.bookSales.id}`, {
        "Content-Type": "application/json",
        withCredentials: true,
      });
      setReviewList(response.data); // state 업데이트
      setIsLoading(false);
    } catch (error) {
      console.error("요청 실패:", error);
    }
  };

  return (
    <div className="book_item">
      {reviewList.length > 0 && (
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
