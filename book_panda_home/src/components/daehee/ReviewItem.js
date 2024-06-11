import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ReviewItem = ({ review }) => {
  return (
    <div className="book_item">
      <h2>{review.userResponseDto.userEmail}</h2>
      <h2>{review.rate}점!</h2>
      <h3>{review.content}</h3>
    </div>
  );
};

export default ReviewItem;
