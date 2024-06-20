import React, { useState, useRef, useEffect } from "react";
import api from "../../api";
import styles from "../../styles/PostBookReview.module.css";
import Star from "./Star";

const PostBookReview = ({ bookSalesInfo }) => {
  const [contentValue, setContentValue] = useState("");
  const [rateValue, setRateValue] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const bookSales = bookSalesInfo.bookSales;
  const [queryParams, setQueryParams] = useState({
    bookSales,
    rate: 0,
    content: "",
  });

  useEffect(() => {
    setQueryParams({ bookSales });
  }, []);
  useEffect(() => {
    handleTextareaChange(); // Initialize height based on initial content
  }, []);
  useEffect(() => {
    setQueryParams({ bookSales, rate: rateValue, content: contentValue });
  }, [contentValue, rateValue]);

  const handleSubmit = (event) => {
    setIsLoading(true);
    createReview();
    event.preventDefault();
  };
  const postReviewSuccess = () => {
    setRateValue(1);
  };

  const handleContentInput = (event) => {
    setContentValue(event.target.value);
    handleTextareaChange();
    const textarea = textareaRef.current;
    const newHeight = textarea.scrollHeight + 40; // 40px for padding
    setReviewHeight(newHeight);
    console.log(newHeight);
  };

  const handleTextareaChange = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset height to auto to calculate scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`; // Set new height based on scrollHeight
  };

  const [reviewHeight, setReviewHeight] = useState(100);
  const textareaRef = useRef(null);

  const createReview = async () => {
    try {
      console.log("dfasfasdf" + JSON.stringify(queryParams));
      const response = await api.post("/review", queryParams, {
        "Content-Type": "application/json",
        withCredentials: true,
      });
      console.log("요청 성공:", response.data);
      postReviewSuccess();
    } catch (error) {
      console.error("요청 실패:", error);
    }
  };
  const handleRatingChange = (newRating) => {
    console.log(newRating);
    setRateValue(newRating);
  };

  return (
    <div className={styles.post_review}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Star onRatingChange={handleRatingChange} />
        <label className={styles.label} style={{ height: `${reviewHeight}px` }}>
          <textarea
            ref={textareaRef}
            type={styles.text}
            className={styles.contentinput}
            value={contentValue}
            onChange={handleContentInput}
            placeholder="댓글을 추가해보세요!"
          />
          <button type="submit" className={styles.submitbutton}>
            제출
          </button>
        </label>
      </form>
    </div>
  );
};

export default PostBookReview;
