import React, { useState, useEffect } from "react";
import styles from "../../styles/Star.module.css";

const Star = ({ onRatingChange }) => {
  const [rateValue, setRateValue] = useState("1");

  const handleRateInput = (event) => {
    const newValue = event.target.value;
    setRateValue(newValue);
    onRatingChange(newValue);
  };

  return (
    <div className={styles.rating}>
      <input type="radio" id="star5" name="rating" value="5" checked={rateValue === "5"} onChange={handleRateInput} />
      <label htmlFor="star5" title="5 stars"></label>
      <input type="radio" id="star4" name="rating" value="4" checked={rateValue === "4"} onChange={handleRateInput} />
      <label htmlFor="star4" title="4 stars"></label>
      <input type="radio" id="star3" name="rating" value="3" checked={rateValue === "3"} onChange={handleRateInput} />
      <label htmlFor="star3" title="3 stars"></label>
      <input type="radio" id="star2" name="rating" value="2" checked={rateValue === "2"} onChange={handleRateInput} />
      <label htmlFor="star2" title="2 stars"></label>
      <input type="radio" id="star1" name="rating" value="1" checked={rateValue === "1"} onChange={handleRateInput} />
      <label htmlFor="star1" title="1 star"></label>
    </div>
  );
};

export default Star;
