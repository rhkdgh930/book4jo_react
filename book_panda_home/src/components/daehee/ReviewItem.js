import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ReviewItem = ({ review }) => {
  return (
    <div className="book_item">
      <h3>{review.content}</h3>
    </div>
  );
};

export default ReviewItem;
