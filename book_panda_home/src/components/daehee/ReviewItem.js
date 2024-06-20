import React, { useState } from "react";
import api from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import style from "../../styles/ReviewItem.module.css";

const ReviewItem = ({ review }) => {
  return (
    <div className={style.item}>
      <h3 className={style.email}>{review.userResponseDto.userEmail}</h3>
      <div className={style.content}>
        <p className={style.rate}>{review.rate}점!</p>
        <p className={style.text}>{review.content}</p>
      </div>
    </div>
  );
};

export default ReviewItem;
