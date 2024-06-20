import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api";
import BookReview from "./BookReview";
import PostBookReview from "./PostBookReview";
import Notification from "../Notification";
import styles from "../../styles/BookSalesDetail.module.css";

const BookSalesDetail = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [newStock, setNewStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [newPrice, setNewPrice] = useState(0);

  const count = async () => {
    try {
      const idNumber = Number(id);

      const response = await api.get(`/getBookSales?id=${idNumber}`, {
        withCredentials: true,
      });
      console.log("Count data:", response.data);
      //setUserRole(response.data.bookSales.user.roles[0]);
      //console.log("유저 권한 : " + userRole);
      await setQueryParams(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching count:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const roles = api
      .get("/users/role", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setUserRole(res.data);
      });

    count(); // 페이지 로드 시 count 함수 호출
  }, [searchParams]); // queryParams.id가 변경될 때마다 count 함수 호출

  const addToCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        throw new Error("No access token found");
      }
      const idNumber = Number(id);
      const response = await api.post(`/cart/items/${idNumber}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
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
    const idNumber = Number(id);
    console.log("bookId : ", idNumber);
    navigate(`/bookDetails/order?bookId=${idNumber}`);
    // } catch (error) {
    //   console.error("주문 오류: ", queryParams.id, error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handlePriceUpdate = (e) => {
    // 가격 업데이트 로직을 여기에 추가합니다.
    setNewPrice(e.target.value);
  };

  const handleStockUpdate = (e) => {
    // 재고 업데이트 로직을 여기에 추가합니다.
    setNewStock(e.target.value);
  };

  const sendNewPrice = async () => {
    api.patch(
      "/bookSales/price/" + newPrice,
      {
        id: queryParams.bookSales.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
  };

  const sendNewStock = async () => {
    api
      .patch(
        "/bookSales/stock/" + newStock,
        {
          id: queryParams.bookSales.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
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
              <div className={styles.littleInfos}>
                <div className={styles.price}>가격: {queryParams.bookSales.bookInfo.discount}원</div>
                {userRole === "ROLE_ADMIN" ? (
                  <div>
                    <input type="number" placeholder="가격 수정" onChange={handlePriceUpdate} />
                    <button onClick={sendNewPrice}>가격 수정</button>
                  </div>
                ) : null}
                <div className={styles.author}>저자: {queryParams.bookSales.bookInfo.author}</div>
                <div className={`${queryParams.bookSales.stock === "0" ? styles.zero : styles.stock}`}>
                  재고: {queryParams.bookSales.stock}권
                </div>
                {userRole === "ROLE_ADMIN" ? (
                  <div>
                    <input type="number" placeholder="수량 수정" onChange={handleStockUpdate} />
                    <button onClick={sendNewStock}>수량 수정</button>
                  </div>
                ) : null}
              </div>
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
          <div className={styles.bookDescContainer}>
            <h3 className={styles.bookDesc}>책 소개</h3>
            <div className={styles.bookSeperator} />
            <p className={styles.description}>{queryParams.bookSales.bookInfo.description}</p>
          </div>
          <h2>리뷰</h2>
          <hr style={{ width: "100%" }} />
          <div>
            <PostBookReview bookSalesInfo={queryParams} />
            <BookReview bookSales={queryParams} />
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
