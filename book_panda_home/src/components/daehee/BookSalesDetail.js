import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BookReview from "./BookReview";
import PostBookReview from "./PostBookReview";

const BookSalesDetail = () => {
  const { state } = useLocation();

  const [newstock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [queryParams, setQueryParams] = useState({
    ...state,
    salesInfoDto: {
      visitCount: 0,
      sellCount: 0,
      stock: 0,
    },
  });
  const getSales = async () => {
    setIsLoading(true);
    try {
      console.log("쿼리 파람 : " + queryParams.id);
      const response = await axios.get("http://localhost:8080/bookSales", {
        params: { id: queryParams.id }, // 쿼리 매개변수 설정
        "Content-Type": "application/json",
        withCredentials: true,
      });
      console.log("요청 성공:", response.data);
      //setQueryParams(...response.data.bookSales, ...response.data.reviewList);
      console.log("쿼리 파람 : " + queryParams);
      setIsLoading(false);

      // 여기서 응답을 처리합니다.
    } catch (error) {
      console.error("요청 실패:", error);
      // 여기서 오류를 처리합니다.
    }
  };

  return (
    <div className="sales">
      <button onClick={getSales} />

      {isLoading && <div>로딩중</div>}

      {!isLoading && (
        <div>
          <img src={queryParams.bookInfo.image} alt={queryParams.title} />
          <h3>{queryParams.bookInfo.title}</h3>
          <div>
            <p>{queryParams.bookInfo.discount}</p>
            <p>{queryParams.stock}</p>
            <button>장바구니 담기</button>
            <button>바로 구매</button>
          </div>
          <p>{queryParams.bookInfo.description}</p>
          <div>
            <BookReview bookSales={queryParams} />
            <PostBookReview bookSalesInfo={queryParams} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSalesDetail;
