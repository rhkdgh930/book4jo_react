import React, { useState, useEffect } from "react";
import api from "../../api";
import styles from "../../styles/PostBookReview.module.css";

const PostBookReview = ({ bookSalesInfo }) => {
  const [contentValue, setContentValue] = useState("");
  const [rateValue, setRateValue] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const bookSales = bookSalesInfo.bookSales;
  console.log("+=================================");
  console.log(JSON.stringify(bookSales));
  console.log("+=================================");
  const [queryParams, setQueryParams] = useState({
    bookSales,
    rate: 0,
    content: "",
  });

  useEffect(() => {
    setQueryParams({ bookSales });
  }, []);

  useEffect(() => {
    setQueryParams({ bookSales, rate: rateValue, content: contentValue });
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
      console.log("dfasfasdf" + JSON.stringify(queryParams));
      const response = await api.post("/review", queryParams, {
        "Content-Type": "application/json",
        withCredentials: true,
      });
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
        <button type="submit" className={styles.submitbutton} onClick={createReview}>
          제출
        </button>
      </form>
    </div>
  );
};

export default PostBookReview;
