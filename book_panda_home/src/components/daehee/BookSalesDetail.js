import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import BookReview from "./BookReview";
import PostBookReview from "./PostBookReview";
import Notification from "../Notification";
import styles from "../../styles/BookSalesDetail.module.css";

const BookSalesDetail = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [newstock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  const count = async () => {
    try {
      const idNumber = Number(id);
      console.log("asaassa" + idNumber);
      console.log(JSON.stringify(queryParams));

      const response = await axios.get(`/api/getBookSales?id=${idNumber}`, {
        withCredentials: true,
      });
      console.log("Count data:", response.data);
      setQueryParams(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching count:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    count(); // 페이지 로드 시 count 함수 호출
  }, []); // queryParams.id가 변경될 때마다 count 함수 호출

  const addToCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }
      const idNumber = Number(id);
      const response = await axios.post(`/api/cart/items/${idNumber}`, null, {
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
    <div className={styles.sales}>
      {isLoading && <div>로딩중</div>}

      {!isLoading && (
        <div className={styles.detailsContainer}>
          <div className={styles.bookInfo}>
            <div className={styles.imageContainer}>
              <img src={queryParams.bookSales.bookInfo.image} alt={queryParams.title} className={styles.bookImage} />
            </div>
            <div className={styles.bookDetails}>
              <h3 className={styles.title}>{queryParams.bookSales.bookInfo.title}</h3>
              <p className={styles.price}>가격: {queryParams.bookSales.bookInfo.discount}원</p>
              <p className={`${queryParams.bookSales.stock === "0" ? styles.zero : styles.stock}`}>
                재고: {queryParams.bookSales.stock}권
              </p>
              <p className={styles.stock}>저자: {queryParams.bookSales.bookInfo.author}</p>
              <div className={styles.buttons}>
                <button onClick={addToCart} disabled={loading}>
                  {loading ? "추가 중..." : "장바구니 담기"}
                </button>
                <button onClick={createOrder} disabled={loading}>
                  {loading ? "추가 중..." : "바로 구매"}
                </button>
              </div>
            </div>
          </div>
          <p className={styles.description}>{queryParams.description}</p>
          <div>
            <BookReview bookSales={queryParams} />
            <PostBookReview bookSalesInfo={queryParams} />
          </div>
        </div>
      )}

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
