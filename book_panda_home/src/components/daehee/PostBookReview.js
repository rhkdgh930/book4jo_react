import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/PostBookReview.module.css";

const PostBookReview = ({ bookSalesInfo }) => {
  const [contentValue, setContentValue] = useState("");
  const [rateValue, setRateValue] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [queryParams, setQueryParams] = useState({
    // bookSales: { id: 1 },
    rate: 0,
    content: "",
  });

  useEffect(() => {
    setQueryParams({ bookSales: { ...bookSalesInfo } });
  }, []);

  useEffect(() => {
    setQueryParams({ bookSales: bookSalesInfo, rate: rateValue, content: contentValue });
  }, [contentValue, rateValue]);

  const handleSubmit = (event) => {
    setIsLoading(true);
    createReview();
    event.preventDefault();
  };

  const handleContentInput = (event) => {
    setContentValue(event.target.value);
  };

  const handleRateInput = (event) => {
    setRateValue(event.target.value);
  };

  const createReview = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }
      console.log("토큰 : " + token);
      setQueryParams({
        ...queryParams,
      });
      const response = await axios.post(
        "/api/review",
        queryParams,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
        {
          "Content-Type": "application/json",
          withCredentials: true,
        }
      );
      console.log("요청 성공:", response.data);
    } catch (error) {
      console.error("요청 실패:", error);
    }
  };

  return (
    <div className={styles.post_review}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          별점:
          <select className={styles.select} value={rateValue} onChange={handleRateInput}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <label>
          내용:
          <input
            type={styles.text}
            className={styles.contentinput}
            value={contentValue}
            onChange={handleContentInput}
          />
        </label>
        <button type="submit" className={styles.submitbutton}>
          제출
        </button>
      </form>
    </div>
  );
};

export default PostBookReview;
