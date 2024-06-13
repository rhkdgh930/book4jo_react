import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BookReview from "./BookReview";
import PostBookReview from "./PostBookReview";
import Notification from "../Notification";

const BookSalesDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [newstock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [queryParams, setQueryParams] = useState({
    ...state,
  });
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
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }
      const response = await axios.post("http://localhost:8080/api/cart/items", null, {
        params: { id: queryParams.id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setShowNotification(true);
    } catch (error) {
      console.error("주문 실패: ", error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    // setLoading(true);
    // try {
    //   const token = localStorage.getItem('accessToken');
    //   if (!token) {
    //     throw new Error('No access token found');
    //   }
    //   const requestData = {
    //     bookId: queryParams.id,
    //     orderDate: new Date(), // 현재 날짜로 설정
    //   };
    //   console.log("queryParams.id : " + queryParams.id);
    //   const response = await axios.post(`http://localhost:8080/api/order`, requestData, {
    //     params: { id: queryParams.id },
    //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
    //     withCredentials: true,
    //   });
    //   console.log(response.data.id);
    console.log("bookId : ", queryParams.id);
    navigate(`/bookDetails/order?bookId=${queryParams.id}`);
    // } catch (error) {
    //   console.error("주문 오류: ", queryParams.id, error);
    // } finally {
    //   setLoading(false);
    // }
  };

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
            <button onClick={addToCart}> {loading ? "추가 중..." : "장바구니 담기"}</button>
            <button onClick={createOrder}> {loading ? "추가 중..." : "바로 구매"}</button>
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
        <Notification
          message="장바구니에 추가되었습니다."
          onClose={() => setShowNotification(false)}
          onNavigate={() => {
            setShowNotification(false);
            navigate("/cart");
          }}
        />
      )}
    </div>
  );
};

export default BookSalesDetail;
