import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BookSales = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const goToBack = () => {
    navigate(-1);
  };

  const [newstock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({
    ...state,
    salesInfoDto: {
      visitCount: 0,
      sellCount: 0,
      stock: 0,
    },
  });

  const handleStock = (event) => {
    setStock(event.target.value);
    setQueryParams({ ...queryParams, salesInfoDto: { ...queryParams.salesInfoDto, stock: event.target.value } });
  };

  const createSales = async () => {
    try {
      console.log("ASDFASFASDF");
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }
      console.log("토큰 : " + token);
      setQueryParams({
        ...queryParams,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await axios.post("/api/bookSales", queryParams, {
        "Content-Type": "application/json",
        withCredentials: true,
      });
      console.log("요청 성공:", response.data);

      navigate(`/admin/salesDetail`, { state: { ...response.data } });

      // 여기서 응답을 처리합니다.
    } catch (error) {
      console.error("요청 실패:", error);
      // 여기서 오류를 처리합니다.
    }
  };

  return (
    <div className="sales">
      <h2>책 판매 페이지</h2>
      <h3>{state.title}</h3>
      <img src={state.image} alt={state.title} />

      <label>
        판매량:
        <input type="text" value={newstock} onChange={handleStock} />
      </label>
      <button onClick={createSales}>제출</button>
      <button onClick={goToBack}>이전 페이지로 이동.</button>
    </div>
  );
};

export default BookSales;
