import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BookReview from "./BookReview";
import PostBookReview from "./PostBookReview";

const BookSalesDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [newstock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [queryParams, setQueryParams] = useState({
    ...state,
  });
  console.log("ckckckckc" + JSON.stringify(queryParams));
  //장바구니 추가시 알림창, 로딩버튼
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const addToCart = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/cart/items", null, { 
        params: { id: queryParams.id},
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        })
      setShowNotification(true)
    } catch (error) {
      console.error("장바구니에 추가 실패: ", error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sales">
      <button onClick={getSales} />

      {isLoading && <div>로딩중</div>}

      {!isLoading && (
        <div>
          <img src={queryParams.image} alt={queryParams.title} />
          <h3>{queryParams.title}</h3>
          <div>
            <p>{queryParams.discount}</p>
            <p>{queryParams.stock}</p>
            <button onClick={addToCart} disabled={loading}> {loading ? "추가 중..." : "장바구니 담기"}</button>
            <button>바로 구매</button>
          </div>
          <p>{queryParams.description}</p>
          <div>
            <BookReview bookSales={queryParams} />
            <PostBookReview bookSalesInfo={queryParams} />
          </div>
        </div>
      )}

      {/* 장바구니에 추가 시 알림 창 */}
      {showNotification && (
        <div className="notification">
          <p>장바구니에 추가되었습니다.</p>
          <button onClick={()=>setShowNotification(false)}>확인</button>
          <button onClick={()=>{setShowNotification(false); navigate("/cart");}}>장바구니로 이동</button>
        </div>
      )}

    </div>
  );
};

export default BookSalesDetail;
